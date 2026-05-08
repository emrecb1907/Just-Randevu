drop function if exists public.rpc_update_appointment_status(uuid, uuid, public.appointment_status, uuid) cascade;

create or replace function public.rpc_update_appointment_status(
  target_business_id uuid,
  target_appointment_id uuid,
  appointment_status public.appointment_status,
  actor_profile_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
declare
  old_status public.appointment_status;
  appointment_staff_id uuid;
  actor_member record;
begin
  select status, staff_member_id
  into old_status, appointment_staff_id
  from public.appointments
  where id = target_appointment_id
    and business_id = target_business_id;

  if old_status is null then
    raise exception 'Randevu kaydı bulunamadı.';
  end if;

  select bm.id, bm.role
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
    and appointment_staff_id <> actor_member.id then
    raise exception 'Personel sadece kendi randevusunun durumunu değiştirebilir.';
  end if;

  update public.appointments
  set status = appointment_status,
      updated_at = now()
  where id = target_appointment_id
    and business_id = target_business_id;

  if old_status <> appointment_status then
    insert into public.appointment_status_history (
      appointment_id,
      old_status,
      new_status,
      changed_by
    )
    values (
      target_appointment_id,
      old_status,
      appointment_status,
      actor_profile_id
    );
  end if;

  perform app_private.sync_appointment_finance(target_appointment_id);

  return target_appointment_id;
end;
$$;;
