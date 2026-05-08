drop index if exists public.payments_business_id_idx;

create index payments_business_id_idx on public.payments (business_id);;
