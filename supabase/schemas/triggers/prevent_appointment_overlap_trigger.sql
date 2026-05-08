drop trigger if exists prevent_appointment_overlap_trigger on public.appointments;

create trigger prevent_appointment_overlap_trigger
before insert or update on public.appointments
for each row execute function app_private.prevent_appointment_overlap();;
