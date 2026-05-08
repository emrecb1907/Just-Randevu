drop function if exists public.rpc_toggle_business_module(uuid, public.module_key, boolean) cascade;

create or replace function public.rpc_toggle_business_module(
  target_business_id uuid,
  target_module public.module_key,
  target_enabled boolean
)
returns boolean
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  if target_enabled and not exists (
    select 1
    from public.businesses b
    join public.plan_modules pm on pm.plan_key = b.plan_key
    where b.id = target_business_id
      and pm.module_key = target_module
  ) then
    raise exception 'Bu modül seçili pakete dahil değil.';
  end if;

  insert into public.business_modules (business_id, module_key, is_enabled)
  values (target_business_id, target_module, target_enabled)
  on conflict (business_id, module_key)
  do update set is_enabled = excluded.is_enabled, updated_at = now();

  return target_enabled;
end;
$$;;
