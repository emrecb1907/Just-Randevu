drop policy if exists "admins manage staff services" on public.staff_services;

create policy "admins manage staff services" on public.staff_services
for all using (
  exists (
    select 1
    from public.business_members bm
    where bm.id = staff_services.business_member_id
      and app_private.has_business_role(bm.business_id, array['business_owner','admin']::public.app_role[])
  ) or app_private.is_super_admin()
);;
