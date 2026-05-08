drop table if exists public.business_hours cascade;

create table public.business_hours (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  weekday integer not null check (weekday between 0 and 6),
  opens_at time not null,
  closes_at time not null,
  is_closed boolean not null default false,
  unique (business_id, weekday),
  check (closes_at > opens_at)
);;

alter table public.business_hours enable row level security;
