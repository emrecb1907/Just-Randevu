drop index if exists public.payments_subscription_id_idx;

create index payments_subscription_id_idx on public.payments (subscription_id);;
