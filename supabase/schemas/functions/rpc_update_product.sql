drop function if exists public.rpc_update_product(uuid, uuid, text, text, numeric, integer) cascade;

create or replace function public.rpc_update_product(
  target_business_id uuid,
  target_product_id uuid,
  product_name text,
  product_unit text,
  product_critical_stock numeric,
  product_sale_price_cents integer
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  update public.products
  set name = product_name,
      unit = product_unit,
      critical_stock = product_critical_stock,
      sale_price_cents = product_sale_price_cents,
      is_active = true
  where id = target_product_id
    and business_id = target_business_id;

  if not found then
    raise exception 'Ürün kaydı bulunamadı.';
  end if;

  return target_product_id;
end;
$$;;
