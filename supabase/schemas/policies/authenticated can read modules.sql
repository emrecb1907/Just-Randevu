drop policy if exists "authenticated can read modules" on public.modules;

create policy "authenticated can read modules" on public.modules
for select to authenticated using (true);;
