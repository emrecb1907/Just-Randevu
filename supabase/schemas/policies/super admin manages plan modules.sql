drop policy if exists "super admin manages plan modules" on public.plan_modules;

create policy "super admin manages plan modules" on public.plan_modules
for all using (app_private.is_super_admin());;
