drop policy if exists "members manage appointments" on public.appointments;

create policy "members manage appointments" on public.appointments
for all using (app_private.is_business_member(business_id) or app_private.is_super_admin());;
