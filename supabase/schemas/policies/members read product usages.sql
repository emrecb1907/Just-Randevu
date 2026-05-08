drop policy if exists "members read product usages" on public.appointment_product_usages;

create policy "members read product usages" on public.appointment_product_usages
for select using (app_private.is_business_member(business_id) or app_private.is_super_admin());;
