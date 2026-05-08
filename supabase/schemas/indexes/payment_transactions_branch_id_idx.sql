drop index if exists public.payment_transactions_branch_id_idx;

create index payment_transactions_branch_id_idx on public.payment_transactions (branch_id);;
