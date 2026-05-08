drop table if exists public.stock_movements cascade;

create table public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  branch_id uuid not null references public.branches(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  movement_type text not null check (movement_type in ('giris', 'cikis', 'duzeltme', 'satis', 'islemde_kullanim')),
  quantity numeric not null check (quantity > 0),
  unit_cost_cents integer check (unit_cost_cents >= 0),
  reason text not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);;

alter table public.stock_movements enable row level security;
