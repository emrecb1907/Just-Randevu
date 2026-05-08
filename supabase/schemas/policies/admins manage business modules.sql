drop policy if exists "admins manage business modules" on public.business_modules;

create policy "admins manage business modules" on public.business_modules
for all using (app_private.has_business_role(business_id, array['business_owner','admin']::public.app_role[]) or app_private.is_super_admin());;
