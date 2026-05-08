drop function if exists public.rpc_upsert_staff_working_hour(uuid, uuid, integer, time, time, boolean) cascade;

create or replace function public.rpc_upsert_staff_working_hour(
  target_business_id uuid,
  target_member_id uuid,
  schedule_weekday integer,
  schedule_starts_at time,
  schedule_ends_at time,
  schedule_is_available boolean default true
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
declare
  saved_id uuid;
begin
  if not exists (
    select 1
    from public.business_members bm
    where bm.id = target_member_id
      and bm.business_id = target_business_id
      and bm.is_active = true
  ) then
    raise exception 'Personel bulunamadı.';
  end if;

  insert into public.staff_working_hours (
    business_member_id,
    weekday,
    starts_at,
    ends_at,
    is_available
  )
  values (
    target_member_id,
    schedule_weekday,
    schedule_starts_at,
    schedule_ends_at,
    schedule_is_available
  )
  on conflict (business_member_id, weekday)
  do update set
    starts_at = excluded.starts_at,
    ends_at = excluded.ends_at,
    is_available = excluded.is_available
  returning id into saved_id;

  return saved_id;
end;
$$;;
