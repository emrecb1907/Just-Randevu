drop function if exists app_private.is_module_enabled(uuid, public.module_key) cascade;

create or replace function app_private.is_module_enabled(target_business_id uuid, target_module public.module_key)
returns boolean
language sql
stable
security definer
set search_path = public, app_private
as $$
  select exists (
    select 1
    from public.businesses b
    join public.plan_modules pm on pm.plan_key = b.plan_key and pm.module_key = target_module
    join public.business_modules bm on bm.business_id = b.id and bm.module_key = target_module
    where b.id = target_business_id
      and b.is_active = true
      and bm.is_enabled = true
  );
$$;;
