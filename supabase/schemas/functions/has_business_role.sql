drop function if exists app_private.has_business_role(uuid, public.app_role[]) cascade;

create or replace function app_private.has_business_role(target_business_id uuid, allowed_roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = public, app_private
as $$
  select exists (
    select 1
    from public.business_members bm
    where bm.business_id = target_business_id
      and bm.profile_id = (select auth.uid())
      and bm.role = any(allowed_roles)
      and bm.is_active = true
  );
$$;;
