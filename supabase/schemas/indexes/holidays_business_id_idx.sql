drop index if exists public.holidays_business_id_idx;

create index holidays_business_id_idx on public.holidays (business_id);;
