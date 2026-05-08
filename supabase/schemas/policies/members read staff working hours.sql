drop policy if exists "members read staff working hours" on public.staff_working_hours;

create policy "members read staff working hours" on public.staff_working_hours
for select using (
  exists (
    select 1 from public.business_members bm
    where bm.id = staff_working_hours.business_member_id
      and app_private.is_business_member(bm.business_id)
  ) or app_private.is_super_admin()
);;
