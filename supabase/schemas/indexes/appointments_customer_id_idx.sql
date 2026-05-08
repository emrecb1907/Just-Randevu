drop index if exists public.appointments_customer_id_idx;

create index appointments_customer_id_idx on public.appointments (customer_id);;
