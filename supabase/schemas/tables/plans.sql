drop table if exists public.plans cascade;

create table public.plans (
  key public.plan_key primary key,
  name text not null,
  monthly_price_cents integer not null default 0,
  branch_limit integer not null,
  staff_limit integer not null,
  staff_limit_scope text not null check (staff_limit_scope in ('business', 'branch')),
  iyzico_product_reference_code text,
  iyzico_pricing_plan_reference_code text,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);;

alter table public.plans enable row level security;
