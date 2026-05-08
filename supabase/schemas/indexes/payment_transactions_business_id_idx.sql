drop index if exists public.payment_transactions_business_id_idx;

create index payment_transactions_business_id_idx on public.payment_transactions (business_id);;
