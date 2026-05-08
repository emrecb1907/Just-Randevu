drop index if exists public.income_expenses_appointment_id_idx;

create index income_expenses_appointment_id_idx on public.income_expenses (appointment_id);;
