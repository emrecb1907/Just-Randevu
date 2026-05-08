drop index if exists public.receivables_customer_id_idx;

create index receivables_customer_id_idx on public.receivables (customer_id);;
