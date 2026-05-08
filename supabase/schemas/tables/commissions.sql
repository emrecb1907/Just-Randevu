drop table if exists public.commissions cascade;

create table public.commissions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  business_member_id uuid not null references public.business_members(id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete set null,
  calculation_type text not null check (calculation_type in ('percentage', 'fixed')),
  rate numeric,
  amount_cents integer not null check (amount_cents >= 0),
  status text not null default 'earned' check (status in ('earned', 'paid', 'canceled')),
  created_at timestamptz not null default now()
);;

alter table public.commissions enable row level security;
