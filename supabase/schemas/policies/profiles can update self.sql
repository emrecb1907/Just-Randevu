drop policy if exists "profiles can update self" on public.profiles;

create policy "profiles can update self" on public.profiles
for update using (id = (select auth.uid())) with check (id = (select auth.uid()));;
