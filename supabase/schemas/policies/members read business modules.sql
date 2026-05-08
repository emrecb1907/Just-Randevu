drop policy if exists "members read business modules" on public.business_modules;

create policy "members read business modules" on public.business_modules
for select using (app_private.is_business_member(business_id) or app_private.is_super_admin());;
