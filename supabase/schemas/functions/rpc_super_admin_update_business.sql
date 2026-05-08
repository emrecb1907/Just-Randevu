drop function if exists public.rpc_super_admin_update_business(uuid, text, text, text, public.plan_key, integer, boolean) cascade;

create or replace function public.rpc_super_admin_update_business(
  target_business_id uuid,
  business_name text,
  business_email text,
  business_phone text,
  selected_plan public.plan_key,
  selected_slot_minutes integer,
  target_is_active boolean
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
      slot_minutes = selected_slot_minutes,
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

  insert into public.subscriptions (business_id, plan_key, status)
  values (target_business_id, selected_plan, 'pending')
  on conflict do nothing;

  return target_business_id;
end;
$$;;
