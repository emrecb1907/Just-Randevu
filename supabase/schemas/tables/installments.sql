drop table if exists public.installments cascade;

create table public.installments (
  id uuid primary key default gen_random_uuid(),
  receivable_id uuid not null references public.receivables(id) on delete cascade,
  due_date date not null,
  amount_cents integer not null check (amount_cents > 0),
  paid_at timestamptz,
  status text not null default 'pending' check (status in ('pending', 'paid', 'overdue', 'canceled'))
);;

alter table public.installments enable row level security;
