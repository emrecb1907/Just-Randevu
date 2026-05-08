drop function if exists public.rpc_super_admin_update_plan(public.plan_key, integer, integer, integer, text, boolean) cascade;

create or replace function public.rpc_super_admin_update_plan(
  target_plan public.plan_key,
  target_monthly_price_cents integer,
  target_branch_limit integer,
  target_staff_limit integer,
  target_staff_limit_scope text,
  target_is_active boolean
)
returns public.plan_key
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  update public.plans
  set monthly_price_cents = target_monthly_price_cents,
      branch_limit = target_branch_limit,
      staff_limit = target_staff_limit,
      staff_limit_scope = target_staff_limit_scope,
      is_active = target_is_active,
      updated_at = now()
  where key = target_plan;

  if not found then
    raise exception 'Paket bulunamadı.';
  end if;

  return target_plan;
end;
$$;;
