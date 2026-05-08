drop index if exists public.appointment_product_usages_product_id_idx;

create index appointment_product_usages_product_id_idx on public.appointment_product_usages (product_id);;
