drop function if exists app_private.calculate_staff_commission(integer, numeric) cascade;

create or replace function app_private.calculate_staff_commission(
  total_cents integer,
  rate numeric
)
returns integer
language sql
immutable
set search_path = public, app_private
as $$
  select greatest(0, round(total_cents * rate / 100.0))::integer;
$$;;
