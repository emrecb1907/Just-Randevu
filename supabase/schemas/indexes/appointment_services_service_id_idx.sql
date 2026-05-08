drop index if exists public.appointment_services_service_id_idx;

create index appointment_services_service_id_idx on public.appointment_services (service_id);;
