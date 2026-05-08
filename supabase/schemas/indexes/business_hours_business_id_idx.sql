drop index if exists public.business_hours_business_id_idx;

create index business_hours_business_id_idx on public.business_hours (business_id);;
