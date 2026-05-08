drop index if exists public.tickets_customer_id_idx;

create index tickets_customer_id_idx on public.tickets (customer_id);;
