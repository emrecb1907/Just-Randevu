drop index if exists public.payment_transactions_created_by_idx;

create index payment_transactions_created_by_idx on public.payment_transactions (created_by);;
