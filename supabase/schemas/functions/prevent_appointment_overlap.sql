drop function if exists app_private.prevent_appointment_overlap() cascade;

create or replace function app_private.prevent_appointment_overlap()
returns trigger
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  if new.status not in ('iptal', 'gelmedi') then
    if exists (
      select 1
      from public.appointments a
      where a.staff_member_id = new.staff_member_id
        and a.id <> coalesce(new.id, gen_random_uuid())
        and a.status not in ('iptal', 'gelmedi')
        and tstzrange(a.starts_at, a.ends_at, '[)') && tstzrange(new.starts_at, new.ends_at, '[)')
    ) then
      raise exception 'Bu personelde randevu çakışması var.';
    end if;
  end if;
  return new;
end;
$$;;
