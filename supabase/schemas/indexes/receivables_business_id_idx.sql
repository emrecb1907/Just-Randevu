drop index if exists public.receivables_business_id_idx;

create index receivables_business_id_idx on public.receivables (business_id);;
