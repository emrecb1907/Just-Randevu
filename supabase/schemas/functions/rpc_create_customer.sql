drop function if exists public.rpc_create_customer(uuid, uuid, text, text, text, text, text, boolean, boolean) cascade;

create or replace function public.rpc_create_customer(
  target_business_id uuid,
  target_branch_id uuid,
  customer_first_name text,
  customer_last_name text,
  customer_phone text,
  customer_email text,
  customer_notes text,
  customer_kvkk_consent boolean,
  customer_whatsapp_consent boolean
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
declare
  created_customer_id uuid;
begin
  insert into public.customers (
    business_id,
    branch_id,
    first_name,
    last_name,
    phone,
    email,
    notes,
    kvkk_consent,
    whatsapp_consent
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
    customer_whatsapp_consent
  )
  on conflict (business_id, phone)
  do update set
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    email = excluded.email,
    notes = excluded.notes,
    kvkk_consent = excluded.kvkk_consent,
    whatsapp_consent = excluded.whatsapp_consent,
    updated_at = now(),
    is_active = true
  returning id into created_customer_id;

  return created_customer_id;
end;
$$;;
