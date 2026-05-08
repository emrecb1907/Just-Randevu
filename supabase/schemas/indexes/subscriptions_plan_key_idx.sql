drop index if exists public.subscriptions_plan_key_idx;

create index subscriptions_plan_key_idx on public.subscriptions (plan_key);;
