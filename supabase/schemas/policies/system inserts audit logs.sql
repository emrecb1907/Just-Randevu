drop policy if exists "system inserts audit logs" on public.audit_logs;

create policy "system inserts audit logs" on public.audit_logs
for insert with check (business_id is null or app_private.is_business_member(business_id) or app_private.is_super_admin());;
