drop policy if exists "admins manage stock products" on public.products;

create policy "admins manage stock products" on public.products
for all using (app_private.has_business_role(business_id, array['business_owner','admin']::public.app_role[]) or app_private.is_super_admin());;
