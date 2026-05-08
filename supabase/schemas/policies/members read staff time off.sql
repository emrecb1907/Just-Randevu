drop policy if exists "members read staff time off" on public.staff_time_off;

create policy "members read staff time off" on public.staff_time_off
for select using (
  exists (
    select 1 from public.business_members bm
    where bm.id = staff_time_off.business_member_id
      and app_private.is_business_member(bm.business_id)
  ) or app_private.is_super_admin()
);;
