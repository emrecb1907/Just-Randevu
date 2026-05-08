drop index if exists public.appointments_staff_member_id_idx;

create index appointments_staff_member_id_idx on public.appointments (staff_member_id);;
