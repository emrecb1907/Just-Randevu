drop policy if exists "members read subscription payments" on public.payments;

create policy "members read subscription payments" on public.payments
for select using (app_private.is_business_member(business_id) or app_private.is_super_admin());;
