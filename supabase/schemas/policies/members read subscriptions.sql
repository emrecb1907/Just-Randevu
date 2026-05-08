drop policy if exists "members read subscriptions" on public.subscriptions;

create policy "members read subscriptions" on public.subscriptions
for select using (app_private.is_business_member(business_id) or app_private.is_super_admin());;
