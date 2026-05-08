drop policy if exists "admins manage branches" on public.branches;

create policy "admins manage branches" on public.branches
for all using (app_private.has_business_role(business_id, array['business_owner','admin']::public.app_role[]) or app_private.is_super_admin());;
