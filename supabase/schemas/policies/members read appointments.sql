drop policy if exists "members read appointments" on public.appointments;

create policy "members read appointments" on public.appointments
for select using (app_private.is_business_member(business_id) or app_private.is_super_admin());;
