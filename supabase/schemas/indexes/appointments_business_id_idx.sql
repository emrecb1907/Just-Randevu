drop index if exists public.appointments_business_id_idx;

create index appointments_business_id_idx on public.appointments (business_id);;
