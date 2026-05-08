drop policy if exists "members read ticket items" on public.ticket_items;

create policy "members read ticket items" on public.ticket_items
for select using (
  exists (
    select 1 from public.tickets t
    where t.id = ticket_items.ticket_id
      and app_private.is_business_member(t.business_id)
  ) or app_private.is_super_admin()
);;
