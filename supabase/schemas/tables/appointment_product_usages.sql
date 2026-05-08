drop table if exists public.appointment_product_usages cascade;

create table public.appointment_product_usages (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity numeric not null check (quantity > 0),
  stock_movement_id uuid references public.stock_movements(id) on delete set null,
  created_at timestamptz not null default now()
);;

alter table public.appointment_product_usages enable row level security;
