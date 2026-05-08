drop type if exists public.plan_key cascade;

create type public.plan_key as enum ('standard', 'premium');;
