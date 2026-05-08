drop index if exists public.staff_services_service_id_idx;

create index staff_services_service_id_idx on public.staff_services (service_id);;
