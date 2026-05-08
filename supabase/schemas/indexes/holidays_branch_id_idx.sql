drop index if exists public.holidays_branch_id_idx;

create index holidays_branch_id_idx on public.holidays (branch_id);;
