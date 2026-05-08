drop function if exists public.rpc_create_product_with_stock(uuid, uuid, text, text, numeric, integer, numeric, text) cascade;

create or replace function public.rpc_create_product_with_stock(
  target_business_id uuid,
  target_branch_id uuid,
  product_name text,
  product_unit text,
  product_critical_stock numeric,
  product_sale_price_cents integer,
  movement_quantity numeric,
  movement_reason text
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
declare
  created_product_id uuid;
begin
  insert into public.products (
    business_id,
    name,
    unit,
    critical_stock,
    sale_price_cents
  )
  values (
    target_business_id,
    product_name,
    product_unit,
    product_critical_stock,
    product_sale_price_cents
  )
  on conflict (business_id, name)
  do update set
    unit = excluded.unit,
    critical_stock = excluded.critical_stock,
    sale_price_cents = excluded.sale_price_cents,
    is_active = true
  returning id into created_product_id;

  if movement_quantity > 0 then
    insert into public.stock_movements (
      business_id,
      branch_id,
      product_id,
      movement_type,
      quantity,
      unit_cost_cents,
      reason
    )
    values (
      target_business_id,
      target_branch_id,
      created_product_id,
      'giris',
      movement_quantity,
      product_sale_price_cents,
      movement_reason
    );
  end if;

  return created_product_id;
end;
$$;;
