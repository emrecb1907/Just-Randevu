drop index if exists public.business_members_branch_id_idx;

create index business_members_branch_id_idx on public.business_members (branch_id);;
