drop function if exists public.rpc_delete_income_expense(uuid, uuid) cascade;

create or replace function public.rpc_delete_income_expense(
  target_business_id uuid,
  target_entry_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  delete from public.income_expenses
  where id = target_entry_id
    and business_id = target_business_id;

  if not found then
    raise exception 'Finans kaydı bulunamadı.';
  end if;

  return target_entry_id;
end;
$$;;
