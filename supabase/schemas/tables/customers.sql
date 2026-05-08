drop table if exists public.customers cascade;

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text,
  notes text,
  kvkk_consent boolean not null default false,
  whatsapp_consent boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, phone)
);;

alter table public.customers enable row level security;
