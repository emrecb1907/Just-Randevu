drop event trigger if exists ensure_rls;

create event trigger ensure_rls
on ddl_command_end
execute function public.rls_auto_enable();
