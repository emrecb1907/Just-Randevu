drop policy if exists "members can read customers" on public.customers;

create policy "members can read customers" on public.customers
for select using (app_private.is_business_member(business_id) or app_private.is_super_admin());;
