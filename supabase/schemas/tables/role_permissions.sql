drop table if exists public.role_permissions cascade;

create table public.role_permissions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  role public.app_role not null,
  permission_key text not null,
  is_allowed boolean not null default true,
  created_at timestamptz not null default now(),
  unique (business_id, role, permission_key)
);;

alter table public.role_permissions enable row level security;
