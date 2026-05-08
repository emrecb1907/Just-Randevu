drop policy if exists "members can read businesses" on public.businesses;

create policy "members can read businesses" on public.businesses
for select using (app_private.is_business_member(id) or app_private.is_super_admin());;
