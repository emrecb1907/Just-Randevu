drop table if exists public.notification_templates cascade;

create table public.notification_templates (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  provider text not null default 'meta_whatsapp',
  template_name text not null,
  language text not null default 'tr',
  module_key public.module_key not null default 'whatsapp',
  is_active boolean not null default true
);;

alter table public.notification_templates enable row level security;
