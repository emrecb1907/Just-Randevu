drop policy if exists "admins manage product usages" on public.appointment_product_usages;

create policy "admins manage product usages" on public.appointment_product_usages
for all using (app_private.has_business_role(business_id, array['business_owner','admin']::public.app_role[]) or app_private.is_super_admin());;
