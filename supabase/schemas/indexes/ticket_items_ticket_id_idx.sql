drop index if exists public.ticket_items_ticket_id_idx;

create index ticket_items_ticket_id_idx on public.ticket_items (ticket_id);;
