drop function if exists public.rpc_get_user_context(uuid) cascade;

create or replace function public.rpc_get_user_context(target_profile_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  return jsonb_build_object(
    'profile', (
      select jsonb_build_object(
        'id', p.id,
        'first_name', p.first_name,
        'last_name', p.last_name,
        'email', p.email,
        'phone', p.phone,
        'avatar_url', p.avatar_url,
        'theme', p.theme,
        'must_change_password', p.must_change_password
      )
      from public.profiles p
      where p.id = target_profile_id
    ),
    'memberships', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'member_id', bm.id,
          'business_id', bm.business_id,
          'branch_id', bm.branch_id,
          'role', bm.role,
          'business_name', b.name,
          'business_plan', b.plan_key,
          'branch_name', br.name,
          'can_view_customer_phone', bm.can_view_customer_phone,
          'can_edit_prices', bm.can_edit_prices,
          'can_take_payments', bm.can_take_payments
        )
        order by bm.created_at asc
      )
      from public.business_members bm
      join public.businesses b on b.id = bm.business_id
      left join public.branches br on br.id = bm.branch_id
      where bm.profile_id = target_profile_id
        and bm.is_active = true
        and b.is_active = true
    ), '[]'::jsonb)
  );
end;
$$;;
