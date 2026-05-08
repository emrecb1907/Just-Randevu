drop index if exists public.payment_transactions_ticket_id_idx;

create index payment_transactions_ticket_id_idx on public.payment_transactions (ticket_id);;
