drop index if exists public.tickets_business_id_idx;

create index tickets_business_id_idx on public.tickets (business_id);;
