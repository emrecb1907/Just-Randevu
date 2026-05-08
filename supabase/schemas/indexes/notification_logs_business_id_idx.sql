drop index if exists public.notification_logs_business_id_idx;

create index notification_logs_business_id_idx on public.notification_logs (business_id);;
