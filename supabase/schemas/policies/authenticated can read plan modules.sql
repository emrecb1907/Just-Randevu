drop policy if exists "authenticated can read plan modules" on public.plan_modules;

create policy "authenticated can read plan modules" on public.plan_modules
for select to authenticated using (true);;
