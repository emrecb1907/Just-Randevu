drop policy if exists "members can read services" on public.services;

create policy "members can read services" on public.services
for select using (app_private.is_business_member(business_id) or app_private.is_super_admin());;
