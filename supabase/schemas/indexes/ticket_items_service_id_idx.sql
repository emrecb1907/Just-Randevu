drop index if exists public.ticket_items_service_id_idx;

create index ticket_items_service_id_idx on public.ticket_items (service_id);;
