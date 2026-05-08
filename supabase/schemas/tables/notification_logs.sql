drop table if exists public.notification_logs cascade;

create table public.notification_logs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  appointment_id uuid references public.appointments(id) on delete set null,
  provider text not null default 'meta_whatsapp',
  status text not null,
  error_message text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);;

alter table public.notification_logs enable row level security;
