drop index if exists public.services_business_id_idx;

create index services_business_id_idx on public.services (business_id);;
