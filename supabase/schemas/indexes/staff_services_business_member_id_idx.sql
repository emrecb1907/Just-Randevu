drop index if exists public.staff_services_business_member_id_idx;

create index staff_services_business_member_id_idx on public.staff_services (business_member_id);;
