drop table if exists public.modules cascade;

create table public.modules (
  key public.module_key primary key,
  name text not null,
  category text not null,
  description text not null,
  is_active boolean not null default true
);;

alter table public.modules enable row level security;
