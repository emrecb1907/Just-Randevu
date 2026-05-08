drop policy if exists "members read holidays" on public.holidays;

create policy "members read holidays" on public.holidays
for select using (app_private.is_business_member(business_id) or app_private.is_super_admin());;
