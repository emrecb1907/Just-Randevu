drop policy if exists "super admin manages subscription payments" on public.payments;

create policy "super admin manages subscription payments" on public.payments
for all using (app_private.is_super_admin());;
