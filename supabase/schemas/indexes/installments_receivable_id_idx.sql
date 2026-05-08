drop index if exists public.installments_receivable_id_idx;

create index installments_receivable_id_idx on public.installments (receivable_id);;
