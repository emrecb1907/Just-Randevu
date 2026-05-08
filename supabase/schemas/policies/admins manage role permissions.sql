drop policy if exists "admins manage role permissions" on public.role_permissions;

create policy "admins manage role permissions" on public.role_permissions
for all using (app_private.has_business_role(business_id, array['business_owner','admin']::public.app_role[]) or app_private.is_super_admin());;
