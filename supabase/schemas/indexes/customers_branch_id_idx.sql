drop index if exists public.customers_branch_id_idx;

create index customers_branch_id_idx on public.customers (branch_id);;
