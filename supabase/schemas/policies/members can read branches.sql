drop policy if exists "members can read branches" on public.branches;

create policy "members can read branches" on public.branches
for select using (app_private.is_business_member(business_id) or app_private.is_super_admin());;
