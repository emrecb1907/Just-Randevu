drop policy if exists "authenticated can read service templates" on public.service_templates;

create policy "authenticated can read service templates" on public.service_templates
for select to authenticated using (true);;
