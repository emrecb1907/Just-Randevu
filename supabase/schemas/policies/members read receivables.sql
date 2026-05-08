drop policy if exists "members read receivables" on public.receivables;

create policy "members read receivables" on public.receivables
for select using (app_private.is_business_member(business_id) or app_private.is_super_admin());;
