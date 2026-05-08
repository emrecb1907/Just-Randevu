drop policy if exists "authenticated can read catalog plans" on public.plans;

create policy "authenticated can read catalog plans" on public.plans
for select to authenticated using (true);;
