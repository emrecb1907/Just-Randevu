drop table if exists public.payment_transactions cascade;

create table public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  appointment_id uuid references public.appointments(id) on delete set null,
  ticket_id uuid references public.tickets(id) on delete set null,
  method text not null check (method in ('nakit', 'kart', 'havale', 'iyzico', 'diger')),
  amount_cents integer not null check (amount_cents > 0),
  status text not null default 'completed' check (status in ('pending', 'completed', 'failed', 'refunded', 'canceled')),
  provider_reference text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);;

alter table public.payment_transactions enable row level security;
