drop table if exists public.business_modules cascade;

create table public.business_modules (
  business_id uuid not null references public.businesses(id) on delete cascade,
  module_key public.module_key not null references public.modules(key) on delete cascade,
  is_enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (business_id, module_key)
);;

alter table public.business_modules enable row level security;
