drop index if exists public.notification_templates_business_id_idx;

create index notification_templates_business_id_idx on public.notification_templates (business_id);;
