drop policy if exists "super admin manages plans" on public.plans;

create policy "super admin manages plans" on public.plans
for all using (app_private.is_super_admin());;
