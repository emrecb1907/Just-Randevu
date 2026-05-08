drop policy if exists "members read stock products" on public.products;

create policy "members read stock products" on public.products
for select using (app_private.is_business_member(business_id) or app_private.is_super_admin());;
