drop policy if exists "members read commissions" on public.commissions;

create policy "members read commissions" on public.commissions
for select using (app_private.is_business_member(business_id) or app_private.is_super_admin());;
