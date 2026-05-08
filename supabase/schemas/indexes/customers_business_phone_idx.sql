drop index if exists public.customers_business_phone_idx;

create index customers_business_phone_idx on public.customers (business_id, phone);;
