drop index if exists public.appointments_staff_starts_at_idx;

create index appointments_staff_starts_at_idx on public.appointments (staff_member_id, starts_at);;
