drop policy if exists "members read branch hours" on public.branch_hours;

create policy "members read branch hours" on public.branch_hours
for select using (
  exists (
    select 1 from public.branches b
    where b.id = branch_hours.branch_id
      and app_private.is_business_member(b.business_id)
  ) or app_private.is_super_admin()
);;
