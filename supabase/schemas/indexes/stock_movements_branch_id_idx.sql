drop index if exists public.stock_movements_branch_id_idx;

create index stock_movements_branch_id_idx on public.stock_movements (branch_id);;
