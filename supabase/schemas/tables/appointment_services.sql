drop table if exists public.appointment_services cascade;

create table public.appointment_services (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete restrict,
  service_name_snapshot text not null,
  duration_minutes_snapshot integer not null,
  price_snapshot_cents integer not null check (price_snapshot_cents >= 0)
);;

alter table public.appointment_services enable row level security;
