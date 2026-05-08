drop function if exists public.rpc_create_business_with_owner(uuid, text, text, text, public.plan_key, integer) cascade;
drop function if exists public.rpc_create_business_with_owner(uuid, text, text, text, public.plan_key, integer, time, time) cascade;

create or replace function public.rpc_create_business_with_owner(
  owner_profile_id uuid,
  business_name text,
  business_email text,
  business_phone text,
  selected_plan public.plan_key,
  selected_slot_minutes integer default 15,
  business_opens_at time default '09:00',
  business_closes_at time default '18:00'
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
declare
  created_business_id uuid;
  created_branch_id uuid;
begin
  insert into public.businesses (name, email, phone, plan_key, slot_minutes, created_by)
  values (business_name, business_email, business_phone, selected_plan, selected_slot_minutes, owner_profile_id)
  returning id into created_business_id;

  insert into public.branches (business_id, name, phone)
  values (created_business_id, 'Merkez', business_phone)
  returning id into created_branch_id;

  insert into public.business_hours (business_id, weekday, opens_at, closes_at, is_closed)
  select created_business_id, weekday, business_opens_at, business_closes_at, false
  from generate_series(0, 6) as weekday;

  insert into public.business_members (
    business_id,
    branch_id,
    profile_id,
    role,
    can_view_customer_phone,
    can_edit_prices,
    can_take_payments
  )
  values (
    created_business_id,
    created_branch_id,
    owner_profile_id,
    'business_owner',
    true,
    true,
    true
  );

  insert into public.business_modules (business_id, module_key, is_enabled)
  select created_business_id, pm.module_key, true
  from public.plan_modules pm
  where pm.plan_key = selected_plan
  on conflict (business_id, module_key) do nothing;

  insert into public.subscriptions (business_id, plan_key, status, price_snapshot_cents)
  select created_business_id, selected_plan, 'pending', p.monthly_price_cents
  from public.plans p
  where p.key = selected_plan;

  return created_business_id;
end;
$$;;
