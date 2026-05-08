drop index if exists public.business_members_business_id_idx;

create index business_members_business_id_idx on public.business_members (business_id);;
