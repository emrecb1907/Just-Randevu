drop policy if exists "super admin manages subscriptions" on public.subscriptions;

create policy "super admin manages subscriptions" on public.subscriptions
for all using (app_private.is_super_admin());;
