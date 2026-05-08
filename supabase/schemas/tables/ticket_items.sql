drop table if exists public.ticket_items cascade;

create table public.ticket_items (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  item_type text not null check (item_type in ('service', 'product')),
  service_id uuid references public.services(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  name_snapshot text not null,
  quantity numeric not null default 1,
  unit_price_cents integer not null check (unit_price_cents >= 0)
);;

alter table public.ticket_items enable row level security;
