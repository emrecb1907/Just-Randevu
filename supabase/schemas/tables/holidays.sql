drop table if exists public.holidays cascade;

create table public.holidays (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete cascade,
  starts_on date not null,
  ends_on date not null,
  name text not null,
  check (ends_on >= starts_on)
);;

alter table public.holidays enable row level security;
