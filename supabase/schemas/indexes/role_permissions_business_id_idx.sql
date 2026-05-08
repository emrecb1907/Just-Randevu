drop index if exists public.role_permissions_business_id_idx;

create index role_permissions_business_id_idx on public.role_permissions (business_id);;
