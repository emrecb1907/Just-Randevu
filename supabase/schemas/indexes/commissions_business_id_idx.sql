drop index if exists public.commissions_business_id_idx;

create index commissions_business_id_idx on public.commissions (business_id);;
