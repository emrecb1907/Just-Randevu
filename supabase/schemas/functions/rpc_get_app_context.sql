drop function if exists public.rpc_get_app_context(uuid) cascade;

create or replace function public.rpc_get_app_context(target_business_id uuid default null)
returns jsonb
language plpgsql
security definer
set search_path = public, app_private
as $$
declare
  selected_business_id uuid;
begin
  select coalesce(
    target_business_id,
    (
      select b.id
      from public.businesses b
      where b.is_active = true
      order by b.created_at asc
      limit 1
    )
  )
  into selected_business_id;

  if selected_business_id is null then
    return jsonb_build_object(
      'business', null,
      'branches', '[]'::jsonb,
      'members', '[]'::jsonb,
      'customers', '[]'::jsonb,
      'services', '[]'::jsonb,
      'products', '[]'::jsonb,
      'income_expenses', '[]'::jsonb,
      'business_modules', '[]'::jsonb,
      'business_hours', '[]'::jsonb,
      'appointments', '[]'::jsonb
    );
  end if;

  return jsonb_build_object(
    'business', (
      select to_jsonb(b)
      from public.businesses b
      where b.id = selected_business_id
    ),
    'plan', (
      select to_jsonb(p)
      from public.businesses b
      join public.plans p on p.key = b.plan_key
      where b.id = selected_business_id
    ),
    'subscription', (
      select to_jsonb(s)
      from public.subscriptions s
      where s.business_id = selected_business_id
      order by s.created_at desc
      limit 1
    ),
    'branches', coalesce((
      select jsonb_agg(to_jsonb(br) order by br.created_at asc)
      from public.branches br
      where br.business_id = selected_business_id
        and br.is_active = true
    ), '[]'::jsonb),
    'members', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', bm.id,
          'role', bm.role,
          'branch_id', bm.branch_id,
          'profile_id', bm.profile_id,
          'branch_name', br.name,
          'first_name', p.first_name,
          'last_name', p.last_name,
          'email', p.email,
          'phone', p.phone,
          'avatar_url', p.avatar_url,
          'theme', p.theme,
          'can_view_customer_phone', bm.can_view_customer_phone,
          'can_edit_prices', bm.can_edit_prices,
          'can_take_payments', bm.can_take_payments
        )
        order by bm.created_at asc
      )
      from public.business_members bm
      join public.profiles p on p.id = bm.profile_id
      left join public.branches br on br.id = bm.branch_id
      where bm.business_id = selected_business_id
        and bm.is_active = true
    ), '[]'::jsonb),
    'customers', coalesce((
      select jsonb_agg(to_jsonb(c) order by c.created_at desc)
      from public.customers c
      where c.business_id = selected_business_id
        and c.is_active = true
    ), '[]'::jsonb),
    'services', coalesce((
      select jsonb_agg(to_jsonb(s) order by s.created_at desc)
      from public.services s
      where s.business_id = selected_business_id
        and s.is_active = true
    ), '[]'::jsonb),
    'products', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'business_id', p.business_id,
          'name', p.name,
          'sku', p.sku,
          'unit', p.unit,
          'critical_stock', p.critical_stock,
          'sale_price_cents', p.sale_price_cents,
          'is_active', p.is_active,
          'created_at', p.created_at,
          'stock', coalesce((
            select sum(
              case
                when sm.movement_type = 'giris' then sm.quantity
                when sm.movement_type = 'duzeltme' then sm.quantity
                else -sm.quantity
              end
            )
            from public.stock_movements sm
            where sm.product_id = p.id
          ), 0)
        )
        order by p.created_at desc
      )
      from public.products p
      where p.business_id = selected_business_id
        and p.is_active = true
    ), '[]'::jsonb),
    'income_expenses', coalesce((
      select jsonb_agg(to_jsonb(ie) order by ie.occurred_at desc)
      from public.income_expenses ie
      where ie.business_id = selected_business_id
    ), '[]'::jsonb),
    'business_modules', coalesce((
      select jsonb_agg(to_jsonb(bm) order by bm.module_key asc)
      from public.business_modules bm
      where bm.business_id = selected_business_id
    ), '[]'::jsonb),
    'business_hours', coalesce((
      select jsonb_agg(to_jsonb(bh) order by bh.weekday asc)
      from public.business_hours bh
      where bh.business_id = selected_business_id
    ), '[]'::jsonb),
    'appointments', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', a.id,
          'branch_id', a.branch_id,
          'customer_id', a.customer_id,
          'staff_member_id', a.staff_member_id,
          'starts_at', a.starts_at,
          'ends_at', a.ends_at,
          'status', a.status,
          'note', a.note,
          'total_price_cents', a.total_price_cents,
          'customer_name', concat_ws(' ', c.first_name, c.last_name),
          'customer_phone', c.phone,
          'staff_name', concat_ws(' ', p.first_name, p.last_name),
          'service_id', aps.service_id,
          'service_name', coalesce(aps.service_name_snapshot, 'Randevu'),
          'duration_minutes', coalesce(aps.duration_minutes_snapshot, extract(epoch from (a.ends_at - a.starts_at))::integer / 60)
        )
        order by a.starts_at asc
      )
      from public.appointments a
      join public.customers c on c.id = a.customer_id
      join public.business_members bm on bm.id = a.staff_member_id
      join public.profiles p on p.id = bm.profile_id
      left join lateral (
        select appointment_id, service_id, service_name_snapshot, duration_minutes_snapshot
        from public.appointment_services aps
        where aps.appointment_id = a.id
        order by aps.id asc
        limit 1
      ) aps on true
      where a.business_id = selected_business_id
    ), '[]'::jsonb)
  );
end;
$$;;
