drop table if exists public.staff_services cascade;

create table public.staff_services (
  business_member_id uuid not null references public.business_members(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  primary key (business_member_id, service_id)
);;

alter table public.staff_services enable row level security;
