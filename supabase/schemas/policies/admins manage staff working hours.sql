drop policy if exists "admins manage staff working hours" on public.staff_working_hours;

create policy "admins manage staff working hours" on public.staff_working_hours
for all using (
  exists (
    select 1 from public.business_members bm
    where bm.id = staff_working_hours.business_member_id
      and app_private.has_business_role(bm.business_id, array['business_owner','admin']::public.app_role[])
  ) or app_private.is_super_admin()
);;
