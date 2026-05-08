drop table if exists public.survey_responses cascade;

create table public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);;

alter table public.survey_responses enable row level security;
