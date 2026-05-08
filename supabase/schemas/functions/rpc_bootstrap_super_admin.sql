drop function if exists public.rpc_bootstrap_super_admin(uuid, text, text, text) cascade;

create or replace function public.rpc_bootstrap_super_admin(
  super_profile_id uuid,
  super_email text,
  super_first_name text default 'Emre',
  super_last_name text default 'CB'
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
declare
  selected_business_id uuid;
  selected_branch_id uuid;
begin
  perform public.rpc_upsert_profile(
    super_profile_id,
    super_first_name,
    super_last_name,
    super_email,
    null,
    null,
    'system',
    false
  );

  select id
  into selected_business_id
  from public.businesses
  where name = 'Just Randevu Sistem'
  order by created_at asc
  limit 1;

  if selected_business_id is null then
    insert into public.businesses (
      name,
      legal_name,
      email,
      plan_key,
      is_active,
      created_by
    )
    values (
      'Just Randevu Sistem',
      'Sistem Yönetimi',
      super_email,
      'premium',
      true,
      super_profile_id
    )
    returning id into selected_business_id;
  else
    update public.businesses
    set legal_name = 'Sistem Yönetimi',
        email = super_email,
        plan_key = 'premium',
        is_active = true,
        created_by = super_profile_id,
        updated_at = now()
    where id = selected_business_id;
  end if;

  insert into public.branches (business_id, name, is_active)
  values (selected_business_id, 'Merkez', true)
  on conflict (business_id, name)
  do update set is_active = true
  returning id into selected_branch_id;

  insert into public.business_members (
    business_id,
    branch_id,
    profile_id,
    role,
    is_active,
    can_view_customer_phone,
    can_edit_prices,
    can_take_payments
  )
  values (
    selected_business_id,
    selected_branch_id,
    super_profile_id,
    'super_admin',
    true,
    true,
    true,
    true
  )
  on conflict (business_id, profile_id)
  do update set
    branch_id = excluded.branch_id,
    role = 'super_admin',
    is_active = true,
    can_view_customer_phone = true,
    can_edit_prices = true,
    can_take_payments = true;

  insert into public.business_modules (business_id, module_key, is_enabled)
  select selected_business_id, pm.module_key, true
  from public.plan_modules pm
  where pm.plan_key = 'premium'
  on conflict (business_id, module_key)
  do update set is_enabled = true, updated_at = now();

  insert into public.subscriptions (business_id, plan_key, status)
  select selected_business_id, 'premium', 'active'
  where not exists (
    select 1
    from public.subscriptions s
    where s.business_id = selected_business_id
  );

  return selected_business_id;
end;
$$;;
