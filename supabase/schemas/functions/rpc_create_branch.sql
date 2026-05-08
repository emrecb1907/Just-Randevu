drop function if exists public.rpc_create_branch(uuid, text, text, text) cascade;

create or replace function public.rpc_create_branch(
  target_business_id uuid,
  branch_name text,
  branch_phone text default null,
  branch_address text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
declare
  created_branch_id uuid;
  active_branch_count integer;
  allowed_branch_count integer;
begin
  select count(*) into active_branch_count
  from public.branches
  where business_id = target_business_id
    and is_active = true;

  select p.branch_limit into allowed_branch_count
  from public.businesses b
  join public.plans p on p.key = b.plan_key
  where b.id = target_business_id;

  if active_branch_count >= coalesce(allowed_branch_count, 1) then
    raise exception 'Bu paketin şube limiti dolu.';
  end if;

  insert into public.branches (business_id, name, phone, address)
  values (target_business_id, branch_name, nullif(branch_phone, ''), nullif(branch_address, ''))
  returning id into created_branch_id;

  return created_branch_id;
end;
$$;;
