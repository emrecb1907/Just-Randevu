drop index if exists public.appointment_status_history_changed_by_idx;

create index appointment_status_history_changed_by_idx on public.appointment_status_history (changed_by);;
