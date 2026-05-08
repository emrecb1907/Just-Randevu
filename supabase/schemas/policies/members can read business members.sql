drop policy if exists "members can read business members" on public.business_members;

create policy "members can read business members" on public.business_members
for select using (app_private.is_business_member(business_id) or app_private.is_super_admin());;
