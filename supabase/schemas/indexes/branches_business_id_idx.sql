drop index if exists public.branches_business_id_idx;

create index branches_business_id_idx on public.branches (business_id);;
