-- SPEC-001. Additive migration: only apm_ objects. Existing application is untouched.
begin;

create table if not exists public.apm_migrations (
  version text primary key, applied_at timestamptz not null default now()
);
create table if not exists public.apm_users (
  id uuid primary key, display_name text not null,
  access_code_hash text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.apm_settings (
  user_id uuid primary key references public.apm_users(id) on delete cascade,
  daily_minutes integer not null default 30 check (daily_minutes between 10 and 120),
  new_cards_per_day integer not null default 4 check (new_cards_per_day between 0 and 30),
  retention numeric not null default 0.9 check (retention between 0.8 and 0.97),
  timezone text not null default 'Asia/Shanghai',
  day_start_hour integer not null default 4 check (day_start_hour between 0 and 23),
  route_mode text not null default 'guided' check (route_mode in ('guided','chapter')),
  familiarity jsonb not null default '{}',
  version integer not null default 0,
  updated_at timestamptz not null default now()
);
create table if not exists public.apm_chapters (
  id uuid primary key, position integer not null unique,
  title text not null, subtitle text not null, description text not null,
  color text not null, target_cards integer not null,
  icon text not null
);
create table if not exists public.apm_lessons (
  id uuid primary key, chapter_id uuid not null references public.apm_chapters(id),
  title text not null, position integer not null,
  source_key text not null unique, summary text not null,
  reading_minutes integer not null, headings jsonb not null default '[]',
  unique(chapter_id, position)
);
create table if not exists public.apm_source_revisions (
  id uuid primary key, lesson_id uuid not null references public.apm_lessons(id),
  content_hash text not null, relative_path text not null,
  body_markdown text not null, imported_at timestamptz not null default now(),
  unique(lesson_id, content_hash)
);
create table if not exists public.apm_cards (
  id uuid primary key, canonical_key text not null unique,
  lesson_id uuid not null references public.apm_lessons(id),
  chapter_id uuid not null references public.apm_chapters(id),
  concept_keys text[] not null, position integer not null,
  active_revision integer not null default 1,
  lifecycle text not null default 'active' check(lifecycle in ('active','retired'))
);
create table if not exists public.apm_card_revisions (
  card_id uuid not null references public.apm_cards(id), revision integer not null,
  title text not null, kind text not null,
  prompt text not null, answer_short text not null,
  required_points text[] not null, pitfalls text not null default '',
  explanation text not null default '', source_refs jsonb not null,
  estimated_seconds integer not null default 45,
  created_at timestamptz not null default now(),
  primary key(card_id, revision)
);
create table if not exists public.apm_review_states (
  user_id uuid not null references public.apm_users(id) on delete cascade,
  card_id uuid not null references public.apm_cards(id),
  fsrs jsonb not null, due timestamptz not null,
  version integer not null default 0,
  suspended boolean not null default false,
  last_event_id uuid,
  primary key(user_id, card_id)
);
create table if not exists public.apm_review_events (
  id uuid primary key, user_id uuid not null references public.apm_users(id) on delete cascade,
  card_id uuid not null, card_revision integer not null,
  client_event_id uuid not null, request_hash text not null,
  kind text not null check(kind in ('review','undo')),
  rating integer check(rating between 1 and 4),
  state_before jsonb not null, state_after jsonb not null,
  settings_snapshot jsonb not null,
  scheduler_version text not null,
  reviewed_at timestamptz not null, received_at timestamptz not null default now(),
  duration_ms integer not null check(duration_ms between 0 and 1800000),
  undone_event_id uuid references public.apm_review_events(id),
  result jsonb not null,
  unique(user_id,client_event_id),
  foreign key(user_id,card_id) references public.apm_review_states(user_id,card_id),
  foreign key(card_id,card_revision) references public.apm_card_revisions(card_id,revision)
);
create unique index if not exists apm_one_undo on public.apm_review_events(undone_event_id) where undone_event_id is not null;
create index if not exists apm_due on public.apm_review_states(user_id,due) where suspended=false;
create index if not exists apm_history on public.apm_review_events(user_id,received_at desc);
create table if not exists public.apm_study_activity (
  user_id uuid not null references public.apm_users(id) on delete cascade,
  lesson_id uuid not null references public.apm_lessons(id),
  completed_at timestamptz not null default now(),
  primary key(user_id,lesson_id)
);

create or replace function public.apm_commit_review(
  p_user uuid, p_card uuid, p_revision integer, p_expected integer,
  p_settings_version integer, p_client_event uuid, p_hash text,
  p_rating integer, p_before jsonb, p_after jsonb,
  p_reviewed_at timestamptz, p_duration integer
) returns jsonb language plpgsql security invoker set search_path='' as $$
declare
  s public.apm_review_states;
  cfg public.apm_settings;
  old public.apm_review_events;
  eid uuid := gen_random_uuid();
  output jsonb;
begin
  if not exists(select 1 from public.apm_users where id=p_user and active) then
    raise exception 'USER_INACTIVE';
  end if;
  -- Serializes mutation and configuration changes for this user.
  select * into cfg from public.apm_settings where user_id=p_user for update;
  if not found then raise exception 'SETTINGS_MISSING'; end if;
  select * into old from public.apm_review_events where user_id=p_user and client_event_id=p_client_event;
  if found then
    if old.request_hash <> p_hash then raise exception 'IDEMPOTENCY_CONFLICT'; end if;
    return old.result;
  end if;
  if cfg.version <> p_settings_version then raise exception 'SETTINGS_CONFLICT'; end if;
  perform 1 from public.apm_cards where id=p_card and lifecycle='active' and active_revision=p_revision for share;
  if not found then raise exception 'CONTENT_CONFLICT'; end if;
  if p_rating not between 1 and 4 or p_reviewed_at>now()+interval '1 minute'
    or p_reviewed_at<now()-interval '11 minutes' then raise exception 'INVALID_REVIEW'; end if;
  insert into public.apm_review_states(user_id,card_id,fsrs,due)
    values(p_user,p_card,p_before,(p_before->>'due')::timestamptz)
    on conflict do nothing;
  select * into s from public.apm_review_states where user_id=p_user and card_id=p_card for update;
  if s.version <> p_expected or s.suspended then raise exception 'STATE_CONFLICT'; end if;
  if p_expected>0 and s.fsrs<>p_before then raise exception 'STATE_CONFLICT'; end if;
  output := jsonb_build_object('eventId',eid,'cardId',p_card,'version',s.version+1,'state',p_after);
  insert into public.apm_review_events(id,user_id,card_id,card_revision,client_event_id,request_hash,kind,rating,
    state_before,state_after,settings_snapshot,scheduler_version,reviewed_at,duration_ms,result)
  values(eid,p_user,p_card,p_revision,p_client_event,p_hash,'review',p_rating,p_before,p_after,to_jsonb(cfg),
    'ts-fsrs@5.4.2/FSRS-6',p_reviewed_at,p_duration,output);
  update public.apm_review_states set fsrs=p_after,due=(p_after->>'due')::timestamptz,
    version=version+1,last_event_id=eid where user_id=p_user and card_id=p_card;
  return output;
end $$;

create or replace function public.apm_undo_review(
  p_user uuid,p_event uuid,p_expected integer,p_client_event uuid,p_hash text
) returns jsonb language plpgsql security invoker set search_path='' as $$
declare e public.apm_review_events; s public.apm_review_states;
  old public.apm_review_events; eid uuid:=gen_random_uuid(); output jsonb;
begin
  perform 1 from public.apm_settings where user_id=p_user for update;
  select * into old from public.apm_review_events where user_id=p_user and client_event_id=p_client_event;
  if found then
    if old.request_hash<>p_hash then raise exception 'IDEMPOTENCY_CONFLICT'; end if;
    return old.result;
  end if;
  select * into e from public.apm_review_events where id=p_event and user_id=p_user and kind='review';
  if not found then raise exception 'EVENT_NOT_FOUND'; end if;
  select * into s from public.apm_review_states where user_id=p_user and card_id=e.card_id for update;
  if s.last_event_id<>e.id or s.version<>p_expected then raise exception 'STATE_CONFLICT'; end if;
  output:=jsonb_build_object('eventId',eid,'cardId',e.card_id,'version',s.version+1,'state',e.state_before);
  insert into public.apm_review_events(id,user_id,card_id,card_revision,client_event_id,request_hash,kind,
    state_before,state_after,settings_snapshot,scheduler_version,reviewed_at,duration_ms,undone_event_id,result)
  values(eid,p_user,e.card_id,e.card_revision,p_client_event,p_hash,'undo',s.fsrs,e.state_before,
    e.settings_snapshot,e.scheduler_version,now(),0,e.id,output);
  update public.apm_review_states set fsrs=e.state_before,due=(e.state_before->>'due')::timestamptz,
    version=version+1,last_event_id=eid where user_id=p_user and card_id=e.card_id;
  return output;
end $$;

-- RLS denies all browser roles. Only the authenticated application server uses these tables.
do $$ declare t text; begin
  foreach t in array array['apm_migrations','apm_users','apm_settings','apm_chapters','apm_lessons',
    'apm_source_revisions','apm_cards','apm_card_revisions','apm_review_states','apm_review_events','apm_study_activity'] loop
    execute format('alter table public.%I enable row level security',t);
    execute format('revoke all on table public.%I from public,anon,authenticated',t);
    execute format('grant all on table public.%I to service_role',t);
  end loop;
end $$;
revoke all on function public.apm_commit_review(uuid,uuid,integer,integer,integer,uuid,text,integer,jsonb,jsonb,timestamptz,integer) from public,anon,authenticated;
grant execute on function public.apm_commit_review(uuid,uuid,integer,integer,integer,uuid,text,integer,jsonb,jsonb,timestamptz,integer) to service_role;
revoke all on function public.apm_undo_review(uuid,uuid,integer,uuid,text) from public,anon,authenticated;
grant execute on function public.apm_undo_review(uuid,uuid,integer,uuid,text) to service_role;
insert into public.apm_migrations(version) values('202609050001') on conflict do nothing;
notify pgrst, 'reload schema';
commit;
