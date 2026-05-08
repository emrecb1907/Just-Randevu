drop index if exists public.audit_logs_actor_id_idx;

create index audit_logs_actor_id_idx on public.audit_logs (actor_id);;
