drop policy if exists "admins manage installments" on public.installments;

create policy "admins manage installments" on public.installments
for all using (
  exists (
    select 1 from public.receivables r
    where r.id = installments.receivable_id
      and app_private.has_business_role(r.business_id, array['business_owner','admin']::public.app_role[])
  ) or app_private.is_super_admin()
);;
