drop function if exists public.rpc_update_staff_member(uuid, uuid, uuid, public.app_role) cascade;

create or replace function public.rpc_update_staff_member(
  target_business_id uuid,
  target_member_id uuid,
  target_branch_id uuid,
  staff_role public.app_role
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  update public.business_members
  set branch_id = target_branch_id,
      role = staff_role,
      can_view_customer_phone = staff_role in ('business_owner', 'admin'),
      can_edit_prices = staff_role in ('business_owner', 'admin'),
      can_take_payments = staff_role in ('business_owner', 'admin'),
      is_active = true
  where id = target_member_id
    and business_id = target_business_id
    and role <> 'super_admin';

  if not found then
    raise exception 'Personel kaydı bulunamadı.';
  end if;

  return target_member_id;
end;
$$;;
