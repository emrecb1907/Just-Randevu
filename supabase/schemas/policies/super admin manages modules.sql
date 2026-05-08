drop policy if exists "super admin manages modules" on public.modules;

create policy "super admin manages modules" on public.modules
for all using (app_private.is_super_admin());;
