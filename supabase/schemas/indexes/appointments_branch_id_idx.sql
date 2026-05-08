drop index if exists public.appointments_branch_id_idx;

create index appointments_branch_id_idx on public.appointments (branch_id);;
