drop table if exists public.service_templates cascade;

create table public.service_templates (
  id uuid primary key default gen_random_uuid(),
  sector text not null,
  name text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  suggested_price_cents integer not null default 0 check (suggested_price_cents >= 0),
  unique (sector, name)
);;

alter table public.service_templates enable row level security;
