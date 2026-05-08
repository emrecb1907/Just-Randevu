drop type if exists public.appointment_status cascade;

create type public.appointment_status as enum ('bekliyor', 'onaylandı', 'geldi', 'tamamlandı', 'iptal', 'gelmedi');;
