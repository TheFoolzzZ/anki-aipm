-- SPEC-002. Atomic, idempotent card batch publishing. Only apm_ objects.
begin;

create table if not exists public.apm_content_batches (
  batch_id text primary key,
  content_hash text not null,
  chapter_position integer not null,
  card_count integer not null check (card_count between 1 and 20),
  status text not null check (status = 'published'),
  result jsonb not null,
  published_at timestamptz not null default now()
);

alter table public.apm_content_batches enable row level security;
revoke all on table public.apm_content_batches from public, anon, authenticated;
grant all on table public.apm_content_batches to service_role;

create or replace function public.apm_publish_card_batch(
  p_batch_id text,
  p_content_hash text,
  p_chapter_position integer,
  p_cards jsonb
) returns jsonb language plpgsql security invoker set search_path='' as $$
declare
  item jsonb;
  source_item jsonb;
  existing public.apm_cards;
  lesson public.apm_lessons;
  v_card_id uuid;
  revision_number integer;
  output jsonb;
  inserted_count integer := 0;
begin
  if p_batch_id !~ '^[a-z0-9][a-z0-9-]{2,79}$' or p_content_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'INVALID_BATCH';
  end if;
  if jsonb_typeof(p_cards) <> 'array' or jsonb_array_length(p_cards) not between 1 and 20 then
    raise exception 'INVALID_BATCH_SIZE';
  end if;

  perform pg_advisory_xact_lock(hashtext(p_batch_id));
  select result into output from public.apm_content_batches
    where batch_id = p_batch_id and content_hash = p_content_hash;
  if found then return output; end if;
  if exists(select 1 from public.apm_content_batches where batch_id = p_batch_id) then
    raise exception 'BATCH_ID_CONFLICT';
  end if;

  for item in select value from jsonb_array_elements(p_cards) loop
    v_card_id := (item->>'card_id')::uuid;
    revision_number := (item->>'revision')::integer;
    select * into lesson from public.apm_lessons where id = (item->>'lesson_id')::uuid;
    if not found or lesson.chapter_id <> (item->>'chapter_id')::uuid then
      raise exception 'LESSON_CHAPTER_CONFLICT';
    end if;
    if not exists(select 1 from public.apm_chapters where id=lesson.chapter_id and position=p_chapter_position) then
      raise exception 'BATCH_CHAPTER_CONFLICT';
    end if;

    for source_item in select value from jsonb_array_elements(item->'source_refs') loop
      if not exists(
        select 1 from public.apm_source_revisions
        where id=(source_item->>'source_revision_id')::uuid
          and content_hash=source_item->>'content_hash'
      ) then raise exception 'SOURCE_REVISION_CONFLICT'; end if;
    end loop;

    select * into existing from public.apm_cards
      where canonical_key=item->>'canonical_key' for update;
    if found then
      if existing.id<>v_card_id or existing.lesson_id<>lesson.id or existing.chapter_id<>lesson.chapter_id then
        raise exception 'CARD_IDENTITY_CONFLICT';
      end if;
      if revision_number<>existing.active_revision+1 then raise exception 'REVISION_SEQUENCE_CONFLICT'; end if;
    else
      if revision_number<>1 then raise exception 'NEW_CARD_REVISION_CONFLICT'; end if;
      insert into public.apm_cards(id,canonical_key,lesson_id,chapter_id,concept_keys,position,active_revision,lifecycle)
      values(v_card_id,item->>'canonical_key',lesson.id,lesson.chapter_id,
        array(select jsonb_array_elements_text(item->'concept_keys')),
        (item->>'position')::integer,1,'active');
    end if;

    if exists(select 1 from public.apm_card_revisions as stored_revision where stored_revision.card_id=v_card_id and stored_revision.revision=revision_number) then
      raise exception 'REVISION_EXISTS';
    end if;
    insert into public.apm_card_revisions(card_id,revision,title,kind,prompt,answer_short,required_points,pitfalls,explanation,source_refs,estimated_seconds)
    values(v_card_id,revision_number,item->>'title',item->>'kind',item->>'prompt',item->>'answer_short',
      array(select jsonb_array_elements_text(item->'required_points')),
      coalesce(item->>'pitfalls',''),coalesce(item->>'explanation',''),item->'source_refs',
      (item->>'estimated_seconds')::integer);
    update public.apm_cards set active_revision=revision_number, lifecycle='active',
      concept_keys=array(select jsonb_array_elements_text(item->'concept_keys')),
      position=(item->>'position')::integer where id=v_card_id;
    inserted_count := inserted_count + 1;
  end loop;

  output := jsonb_build_object('batchId',p_batch_id,'contentHash',p_content_hash,'cardCount',inserted_count,'status','published');
  insert into public.apm_content_batches(batch_id,content_hash,chapter_position,card_count,status,result)
  values(p_batch_id,p_content_hash,p_chapter_position,inserted_count,'published',output);
  return output;
end $$;

revoke all on function public.apm_publish_card_batch(text,text,integer,jsonb) from public,anon,authenticated;
grant execute on function public.apm_publish_card_batch(text,text,integer,jsonb) to service_role;

insert into public.apm_migrations(version) values('202609060001') on conflict do nothing;
commit;
