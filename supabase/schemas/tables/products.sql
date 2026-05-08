drop table if exists public.products cascade;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  sku text,
  unit text not null default 'adet',
  critical_stock numeric not null default 0,
  sale_price_cents integer not null default 0 check (sale_price_cents >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (business_id, name)
);;

alter table public.products enable row level security;
