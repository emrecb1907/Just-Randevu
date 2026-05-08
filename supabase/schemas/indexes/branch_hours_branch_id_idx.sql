drop index if exists public.branch_hours_branch_id_idx;

create index branch_hours_branch_id_idx on public.branch_hours (branch_id);;
