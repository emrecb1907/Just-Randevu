drop function if exists public.rpc_super_admin_delete_business(uuid) cascade;

create or replace function public.rpc_super_admin_delete_business(
  target_business_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  update public.businesses
  set is_active = false,
      updated_at = now()
  where id = target_business_id
    and name <> 'Just Randevu Sistem';

  if not found then
    raise exception 'İşletme kaydı bulunamadı.';
  end if;

  return target_business_id;
end;
$$;;
