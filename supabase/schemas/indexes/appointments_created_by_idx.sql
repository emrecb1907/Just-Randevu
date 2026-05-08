drop index if exists public.appointments_created_by_idx;

create index appointments_created_by_idx on public.appointments (created_by);;
