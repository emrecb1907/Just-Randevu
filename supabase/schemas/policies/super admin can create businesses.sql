drop policy if exists "super admin can create businesses" on public.businesses;

create policy "super admin can create businesses" on public.businesses
for insert with check (app_private.is_super_admin() or created_by = (select auth.uid()));;
