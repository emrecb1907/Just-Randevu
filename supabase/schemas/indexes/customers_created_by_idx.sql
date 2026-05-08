drop index if exists public.customers_created_by_idx;

create index customers_created_by_idx on public.customers (created_by);;
