drop index if exists public.subscriptions_business_id_idx;

create index subscriptions_business_id_idx on public.subscriptions (business_id);;
