drop table if exists public.branches cascade;

create table public.branches (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  phone text,
  address text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (business_id, name)
);;

alter table public.branches enable row level security;
