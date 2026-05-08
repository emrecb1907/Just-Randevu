drop index if exists public.appointments_business_starts_at_idx;

create index appointments_business_starts_at_idx on public.appointments (business_id, starts_at);;
