drop function if exists public.rpc_update_business_settings(uuid, text, integer) cascade;

create or replace function public.rpc_update_business_settings(
  target_business_id uuid,
  business_name text,
  selected_slot_minutes integer
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  update public.businesses
  set name = business_name,
      slot_minutes = selected_slot_minutes,
      updated_at = now()
  where id = target_business_id;

  return target_business_id;
end;
$$;;
