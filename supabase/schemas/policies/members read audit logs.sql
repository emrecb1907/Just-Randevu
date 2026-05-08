drop policy if exists "members read audit logs" on public.audit_logs;

create policy "members read audit logs" on public.audit_logs
for select using (business_id is null or app_private.is_business_member(business_id) or app_private.is_super_admin());;
