drop index if exists public.business_modules_business_id_idx;

create index business_modules_business_id_idx on public.business_modules (business_id);;
