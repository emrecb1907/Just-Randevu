drop index if exists public.notification_logs_appointment_id_idx;

create index notification_logs_appointment_id_idx on public.notification_logs (appointment_id);;
