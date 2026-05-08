drop policy if exists "admins manage commissions" on public.commissions;

create policy "admins manage commissions" on public.commissions
for all using (app_private.has_business_role(business_id, array['business_owner','admin']::public.app_role[]) or app_private.is_super_admin());;
