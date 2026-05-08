drop policy if exists "admins can manage own business" on public.businesses;

create policy "admins can manage own business" on public.businesses
for update using (app_private.has_business_role(id, array['business_owner','admin']::public.app_role[]) or app_private.is_super_admin());;
