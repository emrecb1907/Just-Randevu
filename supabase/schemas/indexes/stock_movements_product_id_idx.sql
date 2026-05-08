drop index if exists public.stock_movements_product_id_idx;

create index stock_movements_product_id_idx on public.stock_movements (product_id);;
