drop table if exists public.appointments cascade;

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  branch_id uuid not null references public.branches(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete restrict,
  staff_member_id uuid not null references public.business_members(id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.appointment_status not null default 'bekliyor',
  note text,
  total_price_cents integer not null default 0 check (total_price_cents >= 0),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);;

alter table public.appointments
add constraint appointments_no_staff_overlap
exclude using gist (
  staff_member_id with =,
  tstzrange(starts_at, ends_at, '[)') with &&
)
where (status not in ('iptal', 'gelmedi'));;

alter table public.appointments enable row level security;
