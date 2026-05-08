drop extension if exists btree_gist cascade;
drop extension if exists pgcrypto cascade;

create extension if not exists pgcrypto;
create extension if not exists btree_gist;
