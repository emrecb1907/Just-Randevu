drop policy if exists "members manage appointment services" on public.appointment_services;

create policy "members manage appointment services" on public.appointment_services
for all using (
  exists (
    select 1 from public.appointments a
    where a.id = appointment_services.appointment_id
      and app_private.is_business_member(a.business_id)
  ) or app_private.is_super_admin()
);;
