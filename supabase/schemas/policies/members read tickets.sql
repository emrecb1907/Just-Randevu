drop policy if exists "members read tickets" on public.tickets;

create policy "members read tickets" on public.tickets
for select using (app_private.is_business_member(business_id) or app_private.is_super_admin());;
