drop policy if exists "members read notification templates" on public.notification_templates;

create policy "members read notification templates" on public.notification_templates
for select using (business_id is null or app_private.is_business_member(business_id) or app_private.is_super_admin());;
