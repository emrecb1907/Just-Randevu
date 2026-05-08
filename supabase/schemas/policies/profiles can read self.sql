drop policy if exists "profiles can read self" on public.profiles;

create policy "profiles can read self" on public.profiles
for select using (id = (select auth.uid()) or app_private.is_super_admin());;
