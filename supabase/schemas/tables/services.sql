drop table if exists public.services cascade;

create table public.services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  default_price_cents integer not null default 0 check (default_price_cents >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (business_id, name)
);;

alter table public.services enable row level security;
