-- SPEC-004. Shared invite codes, unique usernames, and atomic learner registration.
begin;

alter table public.apm_users drop constraint if exists apm_users_access_code_hash_key;

alter table public.apm_users add column if not exists username_normalized text;
alter table public.apm_users add column if not exists last_active_at timestamptz;

update public.apm_users
set username_normalized = lower(btrim(display_name))
where username_normalized is null or username_normalized = '';

update public.apm_users
set username_normalized = id::text
where username_normalized is null or username_normalized = '';

update public.apm_users
set last_active_at = coalesce(last_active_at, created_at, now())
where last_active_at is null;

alter table public.apm_users alter column username_normalized set not null;
alter table public.apm_users alter column last_active_at set default now();
alter table public.apm_users alter column last_active_at set not null;

create unique index if not exists apm_users_username_idx on public.apm_users(username_normalized);

alter table public.apm_users drop constraint if exists apm_users_display_name_len;
alter table public.apm_users add constraint apm_users_display_name_len
  check (char_length(btrim(display_name)) between 2 and 24);

create or replace function public.apm_register_user(
  p_display_name text,
  p_access_code_hash text
) returns public.apm_users language plpgsql security invoker set search_path='' as $$
declare
  v_clean_name text := btrim(regexp_replace(coalesce(p_display_name, ''), '\s+', ' ', 'g'));
  v_norm text := lower(v_clean_name);
  v_user public.apm_users;
begin
  if coalesce(p_display_name, '') ~ '[[:cntrl:]]'
     or char_length(v_clean_name) < 2 or char_length(v_clean_name) > 24 then
    raise exception 'INVALID_USERNAME';
  end if;
  if exists(select 1 from public.apm_users where username_normalized = v_norm) then
    raise exception 'USERNAME_TAKEN';
  end if;
  insert into public.apm_users(id, display_name, username_normalized, access_code_hash, active, last_active_at)
  values (gen_random_uuid(), v_clean_name, v_norm, p_access_code_hash, true, now())
  returning * into v_user;

  insert into public.apm_settings(user_id)
  values (v_user.id)
  on conflict (user_id) do nothing;

  return v_user;
exception
  when unique_violation then
    raise exception 'USERNAME_TAKEN';
end $$;

revoke all on function public.apm_register_user(text, text) from public, anon, authenticated;
grant execute on function public.apm_register_user(text, text) to service_role;

insert into public.apm_migrations(version) values('202610170001') on conflict do nothing;
notify pgrst, 'reload schema';
commit;
