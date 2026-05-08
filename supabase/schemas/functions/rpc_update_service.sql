drop function if exists public.rpc_update_service(uuid, uuid, text, text, integer, integer, boolean) cascade;
drop function if exists public.rpc_update_service(uuid, uuid, text, integer, integer, boolean) cascade;

create or replace function public.rpc_update_service(
  target_business_id uuid,
  target_service_id uuid,
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
begin
  update public.services
  set name = service_name,
      duration_minutes = service_duration_minutes,
      default_price_cents = service_default_price_cents,
      is_active = service_is_active
  where id = target_service_id
    and business_id = target_business_id;

  if not found then
    raise exception 'Hizmet kaydı bulunamadı.';
  end if;

  return target_service_id;
end;
$$;;
