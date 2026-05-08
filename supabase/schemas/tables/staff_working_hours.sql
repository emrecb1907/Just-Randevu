drop table if exists public.staff_working_hours cascade;

create table public.staff_working_hours (
  id uuid primary key default gen_random_uuid(),
  business_member_id uuid not null references public.business_members(id) on delete cascade,
  weekday integer not null check (weekday between 0 and 6),
  starts_at time not null,
  ends_at time not null,
  is_available boolean not null default true,
  unique (business_member_id, weekday),
  check (ends_at > starts_at)
);;

alter table public.staff_working_hours enable row level security;
