drop index if exists public.staff_time_off_range_idx;

create index staff_time_off_range_idx on public.staff_time_off (starts_at, ends_at);;
