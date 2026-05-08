drop policy if exists "members read notification logs" on public.notification_logs;

create policy "members read notification logs" on public.notification_logs
for select using (app_private.is_business_member(business_id) or app_private.is_super_admin());;
