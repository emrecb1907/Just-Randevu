drop policy if exists "members read appointment services" on public.appointment_services;

create policy "members read appointment services" on public.appointment_services
for select using (
  exists (
    select 1 from public.appointments a
    where a.id = appointment_services.appointment_id
      and app_private.is_business_member(a.business_id)
  ) or app_private.is_super_admin()
);;
