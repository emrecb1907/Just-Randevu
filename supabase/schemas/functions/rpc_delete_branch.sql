drop function if exists public.rpc_delete_branch(uuid, uuid) cascade;

create or replace function public.rpc_delete_branch(
  target_business_id uuid,
  target_branch_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
declare
  active_branch_count integer;
begin
  select count(*) into active_branch_count
  from public.branches
  where business_id = target_business_id
    and is_active = true;

  if active_branch_count <= 1 then
    raise exception 'En az bir aktif şube kalmalı.';
  end if;

  update public.branches
  set is_active = false
  where id = target_branch_id
    and business_id = target_business_id;

  if not found then
    raise exception 'Şube bulunamadı.';
  end if;

  return target_branch_id;
end;
$$;;
