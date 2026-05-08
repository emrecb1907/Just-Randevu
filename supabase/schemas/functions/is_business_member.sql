drop function if exists app_private.is_business_member(uuid) cascade;

create or replace function app_private.is_business_member(target_business_id uuid)
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
      and bm.is_active = true
  );
$$;;
