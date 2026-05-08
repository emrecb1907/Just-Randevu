drop function if exists app_private.create_income_from_completed_appointment() cascade;

create or replace function app_private.create_income_from_completed_appointment()
returns trigger
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  if new.status = 'tamamlandı'
     and old.status is distinct from new.status
     and app_private.is_module_enabled(new.business_id, 'finance') then
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
      new.business_id,
      new.branch_id,
      new.id,
      'gelir',
      'Randevu',
      new.total_price_cents,
      'appointment',
      now(),
      'Tamamlanan randevudan otomatik gelir'
    );
  end if;
  return new;
end;
$$;;
