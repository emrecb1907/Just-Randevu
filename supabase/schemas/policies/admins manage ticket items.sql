drop policy if exists "admins manage ticket items" on public.ticket_items;

create policy "admins manage ticket items" on public.ticket_items
for all using (
  exists (
    select 1 from public.tickets t
    where t.id = ticket_items.ticket_id
      and app_private.has_business_role(t.business_id, array['business_owner','admin']::public.app_role[])
  ) or app_private.is_super_admin()
);;
