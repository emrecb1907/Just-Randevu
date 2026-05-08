drop function if exists public.rpc_get_system_context() cascade;

create or replace function public.rpc_get_system_context()
returns jsonb
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  return jsonb_build_object(
    'businesses', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', b.id,
          'name', b.name,
          'legal_name', b.legal_name,
          'email', b.email,
          'phone', b.phone,
          'plan_key', b.plan_key,
          'slot_minutes', b.slot_minutes,
          'opens_at', coalesce((
            select bh.opens_at
            from public.business_hours bh
            where bh.business_id = b.id
              and bh.is_closed = false
            order by bh.weekday asc
            limit 1
          ), '09:00'::time),
          'closes_at', coalesce((
            select bh.closes_at
            from public.business_hours bh
            where bh.business_id = b.id
              and bh.is_closed = false
            order by bh.weekday asc
            limit 1
          ), '18:00'::time),
          'is_active', b.is_active,
          'created_at', b.created_at,
          'branch_count', coalesce((
            select count(*)::integer
            from public.branches br
            where br.business_id = b.id
              and br.is_active = true
          ), 0),
          'member_count', coalesce((
            select count(*)::integer
            from public.business_members bm
            where bm.business_id = b.id
              and bm.is_active = true
              and bm.role <> 'super_admin'
          ), 0),
          'enabled_module_count', coalesce((
            select count(*)::integer
            from public.business_modules mod
            where mod.business_id = b.id
              and mod.is_enabled = true
          ), 0),
          'subscription_status', coalesce((
            select s.status::text
            from public.subscriptions s
            where s.business_id = b.id
            order by s.created_at desc
            limit 1
          ), 'pending'),
          'subscription_price_snapshot_cents', coalesce((
            select s.price_snapshot_cents
            from public.subscriptions s
            where s.business_id = b.id
            order by s.created_at desc
            limit 1
          ), 0)
        )
        order by b.created_at desc
      )
      from public.businesses b
      where b.name <> 'Just Randevu Sistem'
    ), '[]'::jsonb),
    'plans', coalesce((
      select jsonb_agg(to_jsonb(p) order by p.monthly_price_cents asc)
      from public.plans p
    ), '[]'::jsonb),
    'modules', coalesce((
      select jsonb_agg(to_jsonb(m) order by m.category asc, m.name asc)
      from public.modules m
    ), '[]'::jsonb),
    'subscriptions', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'business_id', s.business_id,
          'business_name', b.name,
          'plan_key', s.plan_key,
          'status', s.status,
          'price_snapshot_cents', s.price_snapshot_cents,
          'current_period_start', s.current_period_start,
          'current_period_end', s.current_period_end,
          'created_at', s.created_at
        )
        order by s.created_at desc
      )
      from public.subscriptions s
      join public.businesses b on b.id = s.business_id
      where b.name <> 'Just Randevu Sistem'
    ), '[]'::jsonb),
    'payments', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'business_id', p.business_id,
          'business_name', b.name,
          'amount_cents', p.amount_cents,
          'status', p.status,
          'provider', p.provider,
          'created_at', p.created_at
        )
        order by p.created_at desc
      )
      from public.payments p
      join public.businesses b on b.id = p.business_id
      where b.name <> 'Just Randevu Sistem'
    ), '[]'::jsonb)
  );
end;
$$;;
