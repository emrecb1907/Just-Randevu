drop policy if exists "members read finance" on public.income_expenses;

create policy "members read finance" on public.income_expenses
for select using (app_private.is_business_member(business_id) or app_private.is_super_admin());;
