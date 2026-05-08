drop index if exists public.businesses_created_by_idx;

create index businesses_created_by_idx on public.businesses (created_by);;
