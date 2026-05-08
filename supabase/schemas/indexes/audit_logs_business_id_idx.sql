drop index if exists public.audit_logs_business_id_idx;

create index audit_logs_business_id_idx on public.audit_logs (business_id);;
