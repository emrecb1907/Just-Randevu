drop index if exists public.audit_logs_created_at_idx;

create index audit_logs_created_at_idx on public.audit_logs (created_at);;
