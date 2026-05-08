drop index if exists public.tickets_appointment_id_idx;

create index tickets_appointment_id_idx on public.tickets (appointment_id);;
