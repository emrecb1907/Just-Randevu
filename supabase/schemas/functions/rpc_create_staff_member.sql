drop function if exists public.rpc_create_staff_member(uuid, uuid, uuid, public.app_role) cascade;

create or replace function public.rpc_create_staff_member(
  target_business_id uuid,
  target_branch_id uuid,
  staff_profile_id uuid,
  staff_role public.app_role
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
declare
  created_member_id uuid;
  active_member_count integer;
  allowed_member_count integer;
  limit_scope text;
begin
  select p.staff_limit, p.staff_limit_scope
  into allowed_member_count, limit_scope
  from public.businesses b
  join public.plans p on p.key = b.plan_key
  where b.id = target_business_id;

  if limit_scope = 'branch' then
    select count(*)
    into active_member_count
    from public.business_members bm
    where bm.business_id = target_business_id
      and bm.branch_id = target_branch_id
      and bm.is_active = true;
  else
    select count(*)
    into active_member_count
    from public.business_members bm
    where bm.business_id = target_business_id
      and bm.is_active = true;
  end if;

  if active_member_count >= coalesce(allowed_member_count, 1)
    and not exists (
      select 1
      from public.business_members bm
      where bm.business_id = target_business_id
        and bm.profile_id = staff_profile_id
    ) then
    raise exception 'Bu paketin personel limiti dolu.';
  end if;

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
    target_business_id,
    target_branch_id,
    staff_profile_id,
    staff_role,
    staff_role in ('business_owner', 'admin'),
    staff_role in ('business_owner', 'admin'),
    staff_role in ('business_owner', 'admin')
  )
  on conflict (business_id, profile_id)
  do update set
    branch_id = excluded.branch_id,
    role = excluded.role,
    is_active = true
  returning id into created_member_id;

  return created_member_id;
end;
$$;;
