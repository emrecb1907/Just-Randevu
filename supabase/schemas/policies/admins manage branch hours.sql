drop policy if exists "admins manage branch hours" on public.branch_hours;

create policy "admins manage branch hours" on public.branch_hours
for all using (
  exists (
    select 1 from public.branches b
    where b.id = branch_hours.branch_id
      and app_private.has_business_role(b.business_id, array['business_owner','admin']::public.app_role[])
  ) or app_private.is_super_admin()
);;
