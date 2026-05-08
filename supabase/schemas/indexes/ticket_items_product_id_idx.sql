drop index if exists public.ticket_items_product_id_idx;

create index ticket_items_product_id_idx on public.ticket_items (product_id);;
