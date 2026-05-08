drop table if exists public.business_members cascade;

create table public.business_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null,
  is_active boolean not null default true,
  can_view_customer_phone boolean not null default false,
  can_edit_prices boolean not null default false,
  can_take_payments boolean not null default false,
  created_at timestamptz not null default now(),
  unique (business_id, profile_id)
);;

alter table public.business_members enable row level security;
