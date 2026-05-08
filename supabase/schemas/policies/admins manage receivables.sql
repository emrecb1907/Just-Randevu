drop policy if exists "admins manage receivables" on public.receivables;

create policy "admins manage receivables" on public.receivables
for all using (app_private.has_business_role(business_id, array['business_owner','admin']::public.app_role[]) or app_private.is_super_admin());;
