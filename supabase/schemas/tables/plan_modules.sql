drop table if exists public.plan_modules cascade;

create table public.plan_modules (
  plan_key public.plan_key not null references public.plans(key) on delete cascade,
  module_key public.module_key not null references public.modules(key) on delete cascade,
  primary key (plan_key, module_key)
);;

alter table public.plan_modules enable row level security;
