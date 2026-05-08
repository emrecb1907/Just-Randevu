drop function if exists public.rpc_update_branch(uuid, uuid, text, text, text, boolean) cascade;

create or replace function public.rpc_update_branch(
  target_business_id uuid,
  target_branch_id uuid,
  branch_name text,
  branch_phone text default null,
  branch_address text default null,
  target_is_active boolean default true
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  update public.branches
  set
    name = branch_name,
    phone = nullif(branch_phone, ''),
    address = nullif(branch_address, ''),
    is_active = target_is_active
  where id = target_branch_id
    and business_id = target_business_id;

  if not found then
    raise exception 'Şube bulunamadı.';
  end if;

  return target_branch_id;
end;
$$;;
