drop type if exists public.subscription_status cascade;

create type public.subscription_status as enum ('active', 'pending', 'unpaid', 'canceled', 'expired');;
