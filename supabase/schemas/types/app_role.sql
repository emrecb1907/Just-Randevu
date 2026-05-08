drop type if exists public.app_role cascade;

create type public.app_role as enum ('super_admin', 'business_owner', 'admin', 'staff');;
