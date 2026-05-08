drop index if exists public.appointment_product_usages_business_id_idx;

create index appointment_product_usages_business_id_idx on public.appointment_product_usages (business_id);;
