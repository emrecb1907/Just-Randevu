drop policy if exists "members manage appointment history" on public.appointment_status_history;

create policy "members manage appointment history" on public.appointment_status_history
for all using (
  exists (
    select 1 from public.appointments a
    where a.id = appointment_status_history.appointment_id
      and app_private.is_business_member(a.business_id)
  ) or app_private.is_super_admin()
);;
