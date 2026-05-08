drop function if exists public.rpc_delete_service(uuid, uuid) cascade;

create or replace function public.rpc_delete_service(
  target_business_id uuid,
  target_service_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  update public.services
  set is_active = false
  where id = target_service_id
    and business_id = target_business_id;

  if not found then
    raise exception 'Hizmet kaydı bulunamadı.';
  end if;

  return target_service_id;
end;
$$;;
