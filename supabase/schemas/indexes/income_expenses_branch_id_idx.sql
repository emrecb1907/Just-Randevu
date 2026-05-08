drop index if exists public.income_expenses_branch_id_idx;

create index income_expenses_branch_id_idx on public.income_expenses (branch_id);;
