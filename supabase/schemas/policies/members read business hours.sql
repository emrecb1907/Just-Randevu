drop policy if exists "members read business hours" on public.business_hours;

create policy "members read business hours" on public.business_hours
for select using (app_private.is_business_member(business_id) or app_private.is_super_admin());;
