drop function if exists public.rpc_delete_product(uuid, uuid) cascade;

create or replace function public.rpc_delete_product(
  target_business_id uuid,
  target_product_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  update public.products
  set is_active = false
  where id = target_product_id
    and business_id = target_business_id;

  if not found then
    raise exception 'Ürün kaydı bulunamadı.';
  end if;

  return target_product_id;
end;
$$;;
