drop function if exists public.rpc_delete_customer(uuid, uuid) cascade;
drop function if exists public.rpc_delete_customer(uuid, uuid, uuid) cascade;

create or replace function public.rpc_delete_customer(
  target_business_id uuid,
  target_customer_id uuid,
  actor_profile_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  if not exists (
    select 1
    from public.business_members bm
    where bm.business_id = target_business_id
      and bm.profile_id = actor_profile_id
      and bm.role in ('business_owner', 'admin')
      and bm.is_active = true
  ) then
    raise exception 'Müşteri silme yetkiniz yok.';
  end if;

  update public.customers
  set is_active = false,
      updated_at = now()
  where id = target_customer_id
    and business_id = target_business_id;

  if not found then
    raise exception 'Müşteri kaydı bulunamadı.';
  end if;

  return target_customer_id;
end;
$$;;
