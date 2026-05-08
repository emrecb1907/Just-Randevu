drop policy if exists "admins manage tickets" on public.tickets;

create policy "admins manage tickets" on public.tickets
for all using (app_private.has_business_role(business_id, array['business_owner','admin']::public.app_role[]) or app_private.is_super_admin());;
