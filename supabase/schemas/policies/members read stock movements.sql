drop policy if exists "members read stock movements" on public.stock_movements;

create policy "members read stock movements" on public.stock_movements
for select using (app_private.is_business_member(business_id) or app_private.is_super_admin());;
