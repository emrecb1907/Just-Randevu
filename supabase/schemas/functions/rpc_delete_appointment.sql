drop function if exists public.rpc_delete_appointment(uuid, uuid) cascade;

create or replace function public.rpc_delete_appointment(
  target_business_id uuid,
  target_appointment_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  delete from public.income_expenses
  where appointment_id = target_appointment_id
    and business_id = target_business_id;

  delete from public.appointments
  where id = target_appointment_id
    and business_id = target_business_id;

  if not found then
    raise exception 'Randevu kaydı bulunamadı.';
  end if;

  return target_appointment_id;
end;
$$;;
