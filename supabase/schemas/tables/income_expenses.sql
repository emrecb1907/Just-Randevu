drop table if exists public.income_expenses cascade;

create table public.income_expenses (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  appointment_id uuid references public.appointments(id) on delete set null,
  type text not null check (type in ('gelir', 'gider')),
  category text not null,
  amount_cents integer not null check (amount_cents > 0),
  source text not null check (source in ('appointment', 'ticket', 'manual', 'stock', 'commission')),
  occurred_at timestamptz not null default now(),
  note text,
  created_at timestamptz not null default now()
);;

alter table public.income_expenses enable row level security;
