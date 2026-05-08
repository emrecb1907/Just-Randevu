drop function if exists public.rpc_upsert_profile(uuid, text, text, text, text, text, text, boolean) cascade;

create or replace function public.rpc_upsert_profile(
  profile_id uuid,
  profile_first_name text,
  profile_last_name text,
  profile_email text,
  profile_phone text default null,
  profile_avatar_url text default null,
  profile_theme text default 'light',
  profile_must_change_password boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  insert into public.profiles (
    id,
    first_name,
    last_name,
    email,
    phone,
    avatar_url,
    theme,
    must_change_password
  )
  values (
    profile_id,
    profile_first_name,
    profile_last_name,
    profile_email,
    profile_phone,
    profile_avatar_url,
    profile_theme,
    profile_must_change_password
  )
  on conflict (id)
  do update set
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    email = excluded.email,
    phone = excluded.phone,
    avatar_url = excluded.avatar_url,
    theme = excluded.theme,
    must_change_password = excluded.must_change_password,
    updated_at = now();

  return profile_id;
end;
$$;;
