drop index if exists public.stock_movements_business_id_idx;

create index stock_movements_business_id_idx on public.stock_movements (business_id);;
