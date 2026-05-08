drop index if exists public.commissions_appointment_id_idx;

create index commissions_appointment_id_idx on public.commissions (appointment_id);;
