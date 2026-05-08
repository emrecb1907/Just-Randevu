drop policy if exists "admins manage staff" on public.business_members;

create policy "admins manage staff" on public.business_members
for all using (app_private.has_business_role(business_id, array['business_owner','admin']::public.app_role[]) or app_private.is_super_admin());;
