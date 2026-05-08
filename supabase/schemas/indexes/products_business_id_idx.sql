drop index if exists public.products_business_id_idx;

create index products_business_id_idx on public.products (business_id);;
