drop policy if exists "admins manage notification templates" on public.notification_templates;

create policy "admins manage notification templates" on public.notification_templates
for all using (business_id is not null and (app_private.has_business_role(business_id, array['business_owner','admin']::public.app_role[]) or app_private.is_super_admin()));;
