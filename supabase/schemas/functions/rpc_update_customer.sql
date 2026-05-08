drop function if exists public.rpc_update_customer(uuid, uuid, uuid, text, text, text, text, text, boolean, boolean) cascade;

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
  customer_whatsapp_consent boolean
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
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
