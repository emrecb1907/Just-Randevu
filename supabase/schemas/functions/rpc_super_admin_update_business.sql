drop function if exists public.rpc_super_admin_update_business(uuid, text, text, text, public.plan_key, integer, boolean) cascade;
drop function if exists public.rpc_super_admin_update_business(uuid, text, text, text, public.plan_key, integer, time, time, boolean) cascade;
drop function if exists public.rpc_super_admin_update_business(uuid, text, text, text, public.plan_key, boolean, integer, time, time) cascade;
drop function if exists public.rpc_super_admin_update_business(uuid, text, text, text, public.plan_key, boolean, time, time) cascade;

create or replace function public.rpc_super_admin_update_business(
  target_business_id uuid,
  business_name text,
  business_email text,
  business_phone text,
  selected_plan public.plan_key,
  target_is_active boolean,
  business_opens_at time default '09:00',
  business_closes_at time default '18:00'
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  update public.businesses
  set name = business_name,
      email = business_email,
      phone = business_phone,
      plan_key = selected_plan,
      is_active = target_is_active,
      updated_at = now()
  where id = target_business_id
    and name <> 'Just Randevu Sistem';

  if not found then
    raise exception 'İşletme kaydı bulunamadı.';
  end if;

  insert into public.business_modules (business_id, module_key, is_enabled)
  select target_business_id, pm.module_key, true
  from public.plan_modules pm
  where pm.plan_key = selected_plan
  on conflict (business_id, module_key) do update
    set is_enabled = excluded.is_enabled,
        updated_at = now();

  insert into public.subscriptions (business_id, plan_key, status, price_snapshot_cents)
  select target_business_id, selected_plan, 'pending', p.monthly_price_cents
  from public.plans p
  where p.key = selected_plan
    and not exists (
      select 1
      from (
        select s.plan_key
        from public.subscriptions s
        where s.business_id = target_business_id
        order by s.created_at desc
        limit 1
      ) latest_subscription
      where latest_subscription.plan_key = selected_plan
    );

  insert into public.business_hours (business_id, weekday, opens_at, closes_at, is_closed)
  select target_business_id, weekday, business_opens_at, business_closes_at, false
  from generate_series(0, 6) as weekday
  on conflict (business_id, weekday) do update
    set opens_at = excluded.opens_at,
        closes_at = excluded.closes_at,
        is_closed = false;

  return target_business_id;
end;
$$;;
