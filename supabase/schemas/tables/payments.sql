drop table if exists public.payments cascade;

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  provider text not null default 'iyzico',
  amount_cents integer not null check (amount_cents >= 0),
  status text not null,
  provider_reference text,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);;

alter table public.payments enable row level security;
