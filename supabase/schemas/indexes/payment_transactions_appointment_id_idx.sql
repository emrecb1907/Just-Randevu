drop index if exists public.payment_transactions_appointment_id_idx;

create index payment_transactions_appointment_id_idx on public.payment_transactions (appointment_id);;
