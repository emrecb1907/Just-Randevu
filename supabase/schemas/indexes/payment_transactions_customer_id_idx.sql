drop index if exists public.payment_transactions_customer_id_idx;

create index payment_transactions_customer_id_idx on public.payment_transactions (customer_id);;
