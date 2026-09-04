-- =====================================================================
-- FIX 007: Add GRANT/REVOKE + diagnostic test
-- Run this ENTIRE file in Supabase SQL Editor.
-- =====================================================================

-- 1. Permissions (safe to re-run: create or replace + grant are idempotent)
revoke all on function public.sp_set_active_fy(uuid, uuid) from public;
revoke all on function public.fn_list_members(uuid) from public;
revoke all on function public.fn_add_member(uuid, text, text) from public;
revoke all on function public.fn_update_member(uuid, uuid, text, boolean) from public;
revoke all on function public.fn_remove_member(uuid, uuid) from public;

grant execute on function public.sp_set_active_fy(uuid, uuid) to authenticated;
grant execute on function public.fn_list_members(uuid) to authenticated;
grant execute on function public.fn_add_member(uuid, text, text) to authenticated;
grant execute on function public.fn_update_member(uuid, uuid, text, boolean) to authenticated;
grant execute on function public.fn_remove_member(uuid, uuid) to authenticated;

-- 2. Diagnostic: check all 5 functions exist
select proname, proargtypes::regtype[] as arg_types
from pg_proc
where pronamespace = 'public'::regnamespace
  and proname in ('fn_list_members','fn_add_member','fn_update_member','fn_remove_member','sp_set_active_fy')
order by proname;

-- 3. Diagnostic: check your own membership row
select cm.company_id, cm.user_id, cm.role, cm.is_active,
       c.name as company_name
from public.company_members cm
join public.companies c on c.id = cm.company_id
where cm.user_id = auth.uid();

-- 4. Diagnostic: try calling fn_list_members on your company
--    Replace '<your-company-id>' with the UUID from query #3 above
-- select * from public.fn_list_members('<your-company-id>');
