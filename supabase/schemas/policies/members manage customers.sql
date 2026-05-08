drop policy if exists "members manage customers" on public.customers;

create policy "members manage customers" on public.customers
for all using (app_private.has_business_role(business_id, array['business_owner','admin','staff']::public.app_role[]) or app_private.is_super_admin());;
