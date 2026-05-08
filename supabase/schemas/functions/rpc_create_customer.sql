drop function if exists public.rpc_create_customer(uuid, uuid, text, text, text, text, text, boolean, boolean) cascade;
drop function if exists public.rpc_create_customer(uuid, uuid, text, text, text, text, text, boolean, boolean, uuid) cascade;
drop function if exists public.rpc_create_customer(uuid, uuid, text, text, text, text, text, boolean, boolean, uuid, boolean) cascade;

create or replace function public.rpc_create_customer(
  target_business_id uuid,
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
  created_customer_id uuid;
  existing_customer record;
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
    raise exception 'Personel sadece bağlı olduğu şubeye müşteri ekleyebilir.';
  end if;

  select id, created_by
  into existing_customer
  from public.customers
  where business_id = target_business_id
    and phone = customer_phone;

  if existing_customer.id is not null
    and actor_member.role not in ('business_owner', 'admin')
    and existing_customer.created_by is distinct from actor_profile_id then
    raise exception 'Bu telefon numarasıyla kayıtlı müşteri var.';
  end if;

  insert into public.customers (
    business_id,
    branch_id,
    first_name,
    last_name,
    phone,
    email,
    notes,
    kvkk_consent,
    whatsapp_consent,
    created_by
  )
  values (
    target_business_id,
    target_branch_id,
    customer_first_name,
    customer_last_name,
    customer_phone,
    nullif(customer_email, ''),
    nullif(customer_notes, ''),
    customer_kvkk_consent,
    customer_whatsapp_consent,
    actor_profile_id
  )
  on conflict (business_id, phone)
  do update set
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    email = excluded.email,
    notes = excluded.notes,
    kvkk_consent = excluded.kvkk_consent,
    whatsapp_consent = excluded.whatsapp_consent,
    created_by = coalesce(public.customers.created_by, excluded.created_by),
    updated_at = now(),
    is_active = true
  returning id into created_customer_id;

  return created_customer_id;
end;
$$;;
