drop table if exists public.receivables cascade;

create table public.receivables (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  amount_cents integer not null check (amount_cents > 0),
  remaining_cents integer not null check (remaining_cents >= 0),
  due_date date,
  status text not null default 'open' check (status in ('open', 'paid', 'overdue', 'canceled')),
  created_at timestamptz not null default now()
);;

alter table public.receivables enable row level security;
