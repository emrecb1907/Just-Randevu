drop table if exists public.staff_time_off cascade;

create table public.staff_time_off (
  id uuid primary key default gen_random_uuid(),
  business_member_id uuid not null references public.business_members(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);;

alter table public.staff_time_off enable row level security;
