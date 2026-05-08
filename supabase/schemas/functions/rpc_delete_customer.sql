drop function if exists public.rpc_delete_customer(uuid, uuid) cascade;

create or replace function public.rpc_delete_customer(
  target_business_id uuid,
  target_customer_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  update public.customers
  set is_active = false,
      updated_at = now()
  where id = target_customer_id
    and business_id = target_business_id;

  if not found then
    raise exception 'Müşteri kaydı bulunamadı.';
  end if;

  return target_customer_id;
end;
$$;;
