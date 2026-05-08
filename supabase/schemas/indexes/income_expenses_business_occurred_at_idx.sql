drop index if exists public.income_expenses_business_occurred_at_idx;

create index income_expenses_business_occurred_at_idx on public.income_expenses (business_id, occurred_at);;
