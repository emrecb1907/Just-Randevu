drop function if exists public.rpc_record_income_expense(uuid, uuid, text, text, integer, text, timestamptz, text) cascade;

create or replace function public.rpc_record_income_expense(
  target_business_id uuid,
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
declare
  created_entry_id uuid;
begin
  insert into public.income_expenses (
    business_id,
    branch_id,
    type,
    category,
    amount_cents,
    source,
    occurred_at,
    note
  )
  values (
    target_business_id,
    target_branch_id,
    entry_type,
    entry_category,
    entry_amount_cents,
    entry_source,
    entry_occurred_at,
    nullif(entry_note, '')
  )
  returning id into created_entry_id;

  return created_entry_id;
end;
$$;;
