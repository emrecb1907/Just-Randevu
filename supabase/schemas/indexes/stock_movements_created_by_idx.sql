drop index if exists public.stock_movements_created_by_idx;

create index stock_movements_created_by_idx on public.stock_movements (created_by);;
