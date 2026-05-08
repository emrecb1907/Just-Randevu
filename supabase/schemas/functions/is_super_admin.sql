drop function if exists app_private.is_super_admin() cascade;

create or replace function app_private.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public, app_private
as $$
  select exists (
    select 1
    from public.business_members bm
    where bm.profile_id = (select auth.uid())
      and bm.role = 'super_admin'
      and bm.is_active = true
  );
$$;;
