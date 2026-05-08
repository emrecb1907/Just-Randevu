drop policy if exists "members read payment transactions" on public.payment_transactions;

create policy "members read payment transactions" on public.payment_transactions
for select using (app_private.is_business_member(business_id) or app_private.is_super_admin());;
