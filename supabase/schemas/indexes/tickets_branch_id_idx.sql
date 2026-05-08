drop index if exists public.tickets_branch_id_idx;

create index tickets_branch_id_idx on public.tickets (branch_id);;
