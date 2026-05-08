drop table if exists public.businesses cascade;

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  phone text,
  email text,
  plan_key public.plan_key not null default 'standard',
  slot_minutes integer not null default 15 check (slot_minutes in (5, 10, 15, 20, 30)),
  is_active boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);;

alter table public.businesses enable row level security;
