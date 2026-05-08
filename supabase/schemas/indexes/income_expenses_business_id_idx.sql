drop index if exists public.income_expenses_business_id_idx;

create index income_expenses_business_id_idx on public.income_expenses (business_id);;
