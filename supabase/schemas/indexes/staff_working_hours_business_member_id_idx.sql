drop index if exists public.staff_working_hours_business_member_id_idx;

create index staff_working_hours_business_member_id_idx on public.staff_working_hours (business_member_id);;
