drop policy if exists "members read installments" on public.installments;

create policy "members read installments" on public.installments
for select using (
  exists (
    select 1 from public.receivables r
    where r.id = installments.receivable_id
      and app_private.is_business_member(r.business_id)
  ) or app_private.is_super_admin()
);;
