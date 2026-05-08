drop index if exists public.appointment_services_appointment_id_idx;

create index appointment_services_appointment_id_idx on public.appointment_services (appointment_id);;
