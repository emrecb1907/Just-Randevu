drop function if exists public.rpc_delete_staff_member(uuid, uuid) cascade;

create or replace function public.rpc_delete_staff_member(
  target_business_id uuid,
  target_member_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  update public.business_members
  set is_active = false
  where id = target_member_id
    and business_id = target_business_id
    and role not in ('super_admin', 'business_owner');

  if not found then
    raise exception 'Personel kaydı silinemedi.';
  end if;

  return target_member_id;
end;
$$;;
