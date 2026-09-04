-- Set which financial year is active for a company.
-- Must run as a function (not plain update) to satisfy the partial unique
-- index that allows only one active FY per company. Owner / admin only.
create or replace function public.sp_set_active_fy(p_company uuid, p_fy_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
    if not public.fn_can_admin(p_company) then
        raise exception 'You do not have permission to change financial years';
    end if;

    if not exists (
        select 1 from public.financial_years
        where id = p_fy_id and company_id = p_company
    ) then
        raise exception 'Financial year not found';
    end if;

    update public.financial_years set is_active = false
    where company_id = p_company;

    update public.financial_years set is_active = true
    where id = p_fy_id;
end;
$$;

-- =========================================================================
-- 007_admin.sql
-- Admin / member management RPCs.
-- These run as SECURITY DEFINER because the client cannot read auth.users
-- or list other company_members rows (RLS restricts SELECT to own rows).
-- Every function first verifies the caller's role via public.fn_can_admin /
-- direct role checks, and raises a generic permission error otherwise.
-- =========================================================================

-- List every member of a company (with email). Owner / admin only.
create or replace function public.fn_list_members(p_company uuid)
returns table (
    id uuid,
    user_id uuid,
    email text,
    role public.company_member_role,
    is_active boolean,
    created_at timestamptz,
    updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
    if not public.fn_can_admin(p_company) then
        raise exception 'You do not have permission to manage members';
    end if;

    return query
        select cm.id,
               cm.user_id,
               u.email,
               cm.role,
               cm.is_active,
               cm.created_at,
               cm.updated_at
        from public.company_members cm
        left join auth.users u on u.id = cm.user_id
        where cm.company_id = p_company
        order by
            case cm.role when 'owner' then 0 when 'admin' then 1 when 'accountant' then 2 else 3 end,
            u.email;
end;
$$;

-- Add (or reactivate) a member by email. Owner / admin only.
create or replace function public.fn_add_member(
    p_company uuid,
    p_email text,
    p_role text default 'accountant'
)
returns public.company_members
language plpgsql
security definer
set search_path = public
as $$
declare
    v_user_id uuid;
    v_role public.company_member_role;
    v_row public.company_members;
begin
    if not public.fn_can_admin(p_company) then
        raise exception 'You do not have permission to manage members';
    end if;

    begin
        v_role := public.company_member_role(p_role);
    exception when others then
        raise exception 'Invalid role %', p_role;
    end;

    select u.id into v_user_id
    from auth.users u
    where lower(u.email) = lower(btrim(p_email));

    if v_user_id is null then
        raise exception 'No user found with email %. Ask them to sign in to BizKhata first.', p_email;
    end if;

    insert into public.company_members (company_id, user_id, role, is_active)
    values (p_company, v_user_id, v_role, true)
    on conflict (company_id, user_id)
    do update set role = excluded.role, is_active = true, updated_at = now()
    returning * into v_row;

    return v_row;
end;
$$;

-- Change a member's role or active state. Owner only.
create or replace function public.fn_update_member(
    p_company uuid,
    p_member_id uuid,
    p_role text,
    p_is_active boolean
)
returns public.company_members
language plpgsql
security definer
set search_path = public
as $$
declare
    v_target public.company_members;
    v_role public.company_member_role;
    v_row public.company_members;
begin
    -- Only the owner may change roles / membership state.
    if not exists (
        select 1
        from public.company_members cm
        where cm.company_id = p_company
          and cm.user_id = auth.uid()
          and cm.is_active
          and cm.role = 'owner'
    ) then
        raise exception 'Only the company owner can change member roles';
    end if;

    select * into v_target
    from public.company_members
    where id = p_member_id and company_id = p_company;

    if v_target.id is null then
        raise exception 'Member not found';
    end if;

    -- Never allow demoting or deactivating the owner's own row.
    if v_target.user_id = auth.uid() then
        raise exception 'You cannot change your own role';
    end if;
    if v_target.role = 'owner' then
        raise exception 'You cannot change the role of another owner';
    end if;

    begin
        v_role := public.company_member_role(p_role);
    exception when others then
        raise exception 'Invalid role %', p_role;
    end;

    update public.company_members
    set role = v_role, is_active = p_is_active, updated_at = now()
    where id = p_member_id
    returning * into v_row;

    return v_row;
end;
$$;

-- Remove a member. Owner only.
create or replace function public.fn_remove_member(
    p_company uuid,
    p_member_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
    v_target public.company_members;
begin
    if not exists (
        select 1
        from public.company_members cm
        where cm.company_id = p_company
          and cm.user_id = auth.uid()
          and cm.is_active
          and cm.role = 'owner'
    ) then
        raise exception 'Only the company owner can remove members';
    end if;

    select * into v_target
    from public.company_members
    where id = p_member_id and company_id = p_company;

    if v_target.id is null then
        return;
    end if;

    if v_target.user_id = auth.uid() then
        raise exception 'You cannot remove yourself';
    end if;
    if v_target.role = 'owner' then
        raise exception 'You cannot remove the company owner';
    end if;

    delete from public.company_members where id = p_member_id;
end;
$$;

-- =====================================================================
-- Permissions: match the pattern in 005_rls_policies.sql
-- Revoke from PUBLIC, then grant only to authenticated.
-- =====================================================================
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
