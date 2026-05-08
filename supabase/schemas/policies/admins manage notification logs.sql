drop policy if exists "admins manage notification logs" on public.notification_logs;

create policy "admins manage notification logs" on public.notification_logs
for all using (app_private.has_business_role(business_id, array['business_owner','admin']::public.app_role[]) or app_private.is_super_admin());;
