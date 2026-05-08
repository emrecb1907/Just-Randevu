drop function if exists app_private.sync_appointment_finance(uuid) cascade;

create or replace function app_private.sync_appointment_finance(
  target_appointment_id uuid
)
returns void
language plpgsql
security definer
set search_path = public, app_private
as $$
declare
  appointment_row record;
begin
  select id, business_id, branch_id, starts_at, status, total_price_cents
  into appointment_row
  from public.appointments
  where id = target_appointment_id;

  if appointment_row.id is null then
    return;
  end if;

  delete from public.income_expenses
  where appointment_id = target_appointment_id
    and source = 'appointment';

  if appointment_row.status = 'tamamlandı'
    and appointment_row.total_price_cents > 0
    and app_private.is_module_enabled(
      appointment_row.business_id,
      'finance'::public.module_key
    )
  then
    insert into public.income_expenses (
      business_id,
      branch_id,
      appointment_id,
      type,
      category,
      amount_cents,
      source,
      occurred_at,
      note
    )
    values (
      appointment_row.business_id,
      appointment_row.branch_id,
      appointment_row.id,
      'gelir',
      'Randevu',
      appointment_row.total_price_cents,
      'appointment',
      appointment_row.starts_at,
      'Tamamlanan randevu geliri'
    );
  end if;
end;
$$;;
