drop index if exists public.customers_business_id_idx;

create index customers_business_id_idx on public.customers (business_id);;
