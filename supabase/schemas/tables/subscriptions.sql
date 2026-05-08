drop table if exists public.subscriptions cascade;

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  plan_key public.plan_key not null references public.plans(key),
  status public.subscription_status not null default 'pending',
  price_snapshot_cents integer not null default 0 check (price_snapshot_cents >= 0),
  iyzico_subscription_reference_code text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);;

alter table public.subscriptions enable row level security;
