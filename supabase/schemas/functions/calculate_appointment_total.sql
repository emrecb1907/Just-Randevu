drop function if exists app_private.calculate_appointment_total(uuid) cascade;

create or replace function app_private.calculate_appointment_total(target_appointment_id uuid)
returns integer
language sql
stable
security definer
set search_path = public, app_private
as $$
  select coalesce(sum(price_snapshot_cents), 0)::integer
  from public.appointment_services
  where appointment_id = target_appointment_id;
$$;;
