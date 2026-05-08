drop index if exists public.notification_logs_customer_id_idx;

create index notification_logs_customer_id_idx on public.notification_logs (customer_id);;
