drop policy if exists "super admin manages service templates" on public.service_templates;

create policy "super admin manages service templates" on public.service_templates
for all using (app_private.is_super_admin());;
