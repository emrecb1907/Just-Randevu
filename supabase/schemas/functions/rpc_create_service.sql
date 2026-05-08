drop function if exists public.rpc_create_service(uuid, text, text, integer, integer, boolean) cascade;
drop function if exists public.rpc_create_service(uuid, text, integer, integer, boolean) cascade;

create or replace function public.rpc_create_service(
  target_business_id uuid,
  service_name text,
  service_duration_minutes integer,
  service_default_price_cents integer,
  service_is_active boolean
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
declare
  created_service_id uuid;
begin
  insert into public.services (
    business_id,
    name,
    duration_minutes,
    default_price_cents,
    is_active
  )
  values (
    target_business_id,
    service_name,
    service_duration_minutes,
    service_default_price_cents,
    service_is_active
  )
  on conflict (business_id, name)
  do update set
    duration_minutes = excluded.duration_minutes,
    default_price_cents = excluded.default_price_cents,
    is_active = excluded.is_active
  returning id into created_service_id;

  return created_service_id;
end;
$$;;
