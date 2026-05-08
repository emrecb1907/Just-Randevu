drop function if exists public.rpc_update_customer(uuid, uuid, uuid, text, text, text, text, text, boolean, boolean) cascade;
drop function if exists public.rpc_update_customer(uuid, uuid, uuid, text, text, text, text, text, boolean, boolean, uuid, boolean) cascade;

create or replace function public.rpc_update_customer(
  target_business_id uuid,
  target_customer_id uuid,
  target_branch_id uuid,
  customer_first_name text,
  customer_last_name text,
  customer_phone text,
  customer_email text,
  customer_notes text,
  customer_kvkk_consent boolean,
  customer_whatsapp_consent boolean,
  actor_profile_id uuid,
  actor_can_manage boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
declare
  actor_member record;
begin
  select bm.id, bm.role, bm.branch_id
  into actor_member
  from public.business_members bm
  where bm.business_id = target_business_id
    and bm.profile_id = actor_profile_id
    and bm.is_active = true
  limit 1;

  if actor_member.id is null then
    raise exception 'Bu işletmede işlem yetkiniz yok.';
  end if;

  if actor_member.role = 'staff'
    and actor_member.branch_id is distinct from target_branch_id then
    raise exception 'Personel sadece bağlı olduğu şubedeki müşteri kaydını düzenleyebilir.';
  end if;

  if not exists (
    select 1
    from public.customers
    where id = target_customer_id
      and business_id = target_business_id
      and (
        actor_member.role in ('business_owner', 'admin')
        or created_by = actor_profile_id
      )
  ) then
    raise exception 'Bu müşteri kaydını düzenleme yetkiniz yok.';
  end if;

  update public.customers
  set branch_id = target_branch_id,
      first_name = customer_first_name,
      last_name = customer_last_name,
      phone = customer_phone,
      email = nullif(customer_email, ''),
      notes = nullif(customer_notes, ''),
      kvkk_consent = customer_kvkk_consent,
      whatsapp_consent = customer_whatsapp_consent,
      is_active = true,
      updated_at = now()
  where id = target_customer_id
    and business_id = target_business_id;

  if not found then
    raise exception 'Müşteri kaydı bulunamadı.';
  end if;

  return target_customer_id;
end;
$$;;
