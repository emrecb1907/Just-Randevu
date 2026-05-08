drop table if exists public.tickets cascade;

create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  branch_id uuid not null references public.branches(id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  total_cents integer not null default 0 check (total_cents >= 0),
  status text not null default 'open' check (status in ('open', 'paid', 'canceled')),
  created_at timestamptz not null default now()
);;

alter table public.tickets enable row level security;
