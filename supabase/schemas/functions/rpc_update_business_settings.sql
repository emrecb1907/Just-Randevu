drop function if exists public.rpc_update_business_settings(uuid, text, integer) cascade;
drop function if exists public.rpc_update_business_settings(uuid, text, integer, time, time) cascade;

create or replace function public.rpc_update_business_settings(
  target_business_id uuid,
  business_name text,
  selected_slot_minutes integer default 15,
  business_opens_at time default '09:00',
  business_closes_at time default '18:00'
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  update public.businesses
  set name = business_name,
      slot_minutes = selected_slot_minutes,
      updated_at = now()
  where id = target_business_id;

  insert into public.business_hours (business_id, weekday, opens_at, closes_at, is_closed)
  select target_business_id, weekday, business_opens_at, business_closes_at, false
  from generate_series(0, 6) as weekday
  on conflict (business_id, weekday) do update
    set opens_at = excluded.opens_at,
        closes_at = excluded.closes_at,
        is_closed = false;

  return target_business_id;
end;
$$;;
