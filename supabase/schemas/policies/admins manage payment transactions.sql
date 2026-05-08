drop policy if exists "admins manage payment transactions" on public.payment_transactions;

create policy "admins manage payment transactions" on public.payment_transactions
for all using (app_private.has_business_role(business_id, array['business_owner','admin']::public.app_role[]) or app_private.is_super_admin());;
