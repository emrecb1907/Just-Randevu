drop trigger if exists create_income_from_completed_appointment_trigger on public.appointments;

create trigger create_income_from_completed_appointment_trigger
after update on public.appointments
for each row execute function app_private.create_income_from_completed_appointment();;
