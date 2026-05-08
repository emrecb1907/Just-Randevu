drop function if exists public.rpc_update_income_expense(uuid, uuid, uuid, text, text, integer, text, timestamptz, text) cascade;

create or replace function public.rpc_update_income_expense(
  target_business_id uuid,
  target_entry_id uuid,
  target_branch_id uuid,
  entry_type text,
  entry_category text,
  entry_amount_cents integer,
  entry_source text,
  entry_occurred_at timestamptz,
  entry_note text
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  update public.income_expenses
  set branch_id = target_branch_id,
      type = entry_type,
      category = entry_category,
      amount_cents = entry_amount_cents,
      source = entry_source,
      occurred_at = entry_occurred_at,
      note = nullif(entry_note, '')
  where id = target_entry_id
    and business_id = target_business_id;

  if not found then
    raise exception 'Finans kaydı bulunamadı.';
  end if;

  return target_entry_id;
end;
$$;;
