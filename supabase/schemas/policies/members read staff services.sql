drop policy if exists "members read staff services" on public.staff_services;

create policy "members read staff services" on public.staff_services
for select using (
  exists (
    select 1
    from public.business_members bm
    where bm.id = staff_services.business_member_id
      and app_private.is_business_member(bm.business_id)
  ) or app_private.is_super_admin()
);;
