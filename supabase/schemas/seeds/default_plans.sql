insert into public.plans (
  key,
  name,
  monthly_price_cents,
  branch_limit,
  staff_limit,
  staff_limit_scope
) values
('standard', 'Standart', 119900, 1, 8, 'business'),
('premium', 'Premium', 249900, 3, 20, 'branch')
on conflict (key) do update set
name = excluded.name,
monthly_price_cents = excluded.monthly_price_cents,
branch_limit = excluded.branch_limit,
staff_limit = excluded.staff_limit,
staff_limit_scope = excluded.staff_limit_scope;

insert into public.plan_modules (plan_key, module_key) values
('standard', 'appointments'),
('standard', 'customers'),
('standard', 'staff'),
('standard', 'services'),
('standard', 'whatsapp')
on conflict do nothing;

insert into public.plan_modules (plan_key, module_key)
select 'premium', key from public.modules
on conflict do nothing;
