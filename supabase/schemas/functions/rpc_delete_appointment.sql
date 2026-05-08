drop function if exists public.rpc_delete_appointment(uuid, uuid) cascade;
drop function if exists public.rpc_delete_appointment(uuid, uuid, uuid) cascade;

create or replace function public.rpc_delete_appointment(
  target_business_id uuid,
  target_appointment_id uuid,
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
    raise exception 'Randevu silme yetkiniz yok.';
  end if;

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
