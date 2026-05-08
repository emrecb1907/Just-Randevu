drop index if exists public.installments_due_date_idx;

create index installments_due_date_idx on public.installments (due_date);;
