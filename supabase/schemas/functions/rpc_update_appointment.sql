drop function if exists public.rpc_update_appointment(uuid, uuid, uuid, uuid, uuid, uuid, timestamptz, public.appointment_status, text, uuid) cascade;

create or replace function public.rpc_update_appointment(
  target_business_id uuid,
  target_appointment_id uuid,
  target_branch_id uuid,
  target_customer_id uuid,
  target_staff_member_id uuid,
  target_service_id uuid,
  appointment_starts_at timestamptz,
  appointment_status public.appointment_status,
  appointment_note text,
  actor_profile_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
declare
  service_row public.services%rowtype;
  day_hours public.business_hours%rowtype;
  old_status public.appointment_status;
  appointment_start_local timestamp;
  appointment_end_local timestamp;
begin
  select status
  into old_status
  from public.appointments
  where id = target_appointment_id
    and business_id = target_business_id;

  if old_status is null then
    raise exception 'Randevu kaydı bulunamadı.';
  end if;

  select *
  into service_row
  from public.services
  where id = target_service_id
    and business_id = target_business_id
    and is_active = true;

  if service_row.id is null then
    raise exception 'Hizmet kaydı bulunamadı.';
  end if;

  if mod(extract(minute from appointment_starts_at at time zone 'Europe/Istanbul')::integer, 5) <> 0 then
    raise exception 'Randevu dakikası 5 dakikalık aralıklarla seçilmeli.';
  end if;

  appointment_start_local := appointment_starts_at at time zone 'Europe/Istanbul';
  appointment_end_local := (appointment_starts_at + make_interval(mins => service_row.duration_minutes)) at time zone 'Europe/Istanbul';

  select *
  into day_hours
  from public.business_hours
  where business_id = target_business_id
    and weekday = extract(dow from appointment_start_local)::integer;

  if day_hours.id is null
    or day_hours.is_closed = true
    or appointment_end_local::date <> appointment_start_local::date
    or appointment_start_local::time < day_hours.opens_at
    or appointment_end_local::time > day_hours.closes_at then
    raise exception 'Randevu işletme çalışma saatleri içinde olmalı.';
  end if;

  update public.appointments
  set branch_id = target_branch_id,
      customer_id = target_customer_id,
      staff_member_id = target_staff_member_id,
      starts_at = appointment_starts_at,
      ends_at = appointment_starts_at + make_interval(mins => service_row.duration_minutes),
      status = appointment_status,
      note = nullif(appointment_note, ''),
      total_price_cents = service_row.default_price_cents,
      updated_at = now()
  where id = target_appointment_id
    and business_id = target_business_id;

  if not found then
    raise exception 'Randevu kaydı bulunamadı.';
  end if;

  delete from public.appointment_services
  where appointment_id = target_appointment_id;

  insert into public.appointment_services (
    appointment_id,
    service_id,
    service_name_snapshot,
    duration_minutes_snapshot,
    price_snapshot_cents
  )
  values (
    target_appointment_id,
    service_row.id,
    service_row.name,
    service_row.duration_minutes,
    service_row.default_price_cents
  );

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
