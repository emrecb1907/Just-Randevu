drop table if exists public.appointment_status_history cascade;

create table public.appointment_status_history (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  old_status public.appointment_status,
  new_status public.appointment_status not null,
  changed_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);;

alter table public.appointment_status_history enable row level security;
