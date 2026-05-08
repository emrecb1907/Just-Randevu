drop policy if exists "admins manage services" on public.services;

create policy "admins manage services" on public.services
for all using (app_private.has_business_role(business_id, array['business_owner','admin']::public.app_role[]) or app_private.is_super_admin());;
