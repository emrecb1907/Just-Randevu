drop index if exists public.business_members_profile_id_idx;

create index business_members_profile_id_idx on public.business_members (profile_id);;
