create trigger trg_companies_updated_at
    before update on public.companies
    for each row execute function public.fn_set_updated_at();

create trigger trg_financial_years_updated_at
    before update on public.financial_years
    for each row execute function public.fn_set_updated_at();

create trigger trg_company_members_updated_at
    before update on public.company_members
    for each row execute function public.fn_set_updated_at();

create trigger trg_account_groups_updated_at
    before update on public.account_groups
    for each row execute function public.fn_set_updated_at();

create trigger trg_ledgers_updated_at
    before update on public.ledgers
    for each row execute function public.fn_set_updated_at();

create trigger trg_tax_masters_updated_at
    before update on public.tax_masters
    for each row execute function public.fn_set_updated_at();

create trigger trg_items_updated_at
    before update on public.items
    for each row execute function public.fn_set_updated_at();

create trigger trg_batches_updated_at
    before update on public.batches
    for each row execute function public.fn_set_updated_at();

create trigger trg_vouchers_updated_at
    before update on public.vouchers
    for each row execute function public.fn_set_updated_at();

create or replace function public.fn_voucher_number()
returns trigger
language plpgsql
set search_path = public
as $$
begin
    if new.voucher_number is null or new.voucher_number = '' then
        new.voucher_number := public.fn_next_voucher_number(new.company_id, new.fy_id, new.voucher_type);
    end if;
    return new;
end;
$$;

create trigger trg_vouchers_number
    before insert on public.vouchers
    for each row execute function public.fn_voucher_number();

create or replace function public.fn_val_voucher_balance()
returns trigger
language plpgsql
set search_path = public
as $$
declare
    v_company uuid := coalesce(new.company_id, old.company_id);
    v_voucher uuid := coalesce(new.voucher_id, old.voucher_id);
    v_cnt int;
    v_diff numeric;
begin
    select count(*), round(coalesce(sum(debit - credit), 0), 2)
    into v_cnt, v_diff
    from public.voucher_entries
    where company_id = v_company
      and voucher_id = v_voucher;

    if v_cnt = 0 then
        raise exception 'Voucher must have entries';
    end if;

    if v_diff <> 0 then
        raise exception 'Voucher entries must balance. Difference: %', v_diff;
    end if;

    return coalesce(new, old);
end;
$$;

create trigger trg_voucher_entries_balance
    before insert or update or delete on public.voucher_entries
    for each row execute function public.fn_val_voucher_balance();

create or replace function public.fn_company_defaults()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    v_uid uuid := auth.uid();
    v_year_start date;
    v_year_end date;
    v_fy_name text;
begin
    v_year_start := date_trunc('year', current_date - interval '9 months')::date;
    v_year_end := (v_year_start + interval '1 year')::date;
    v_fy_name := 'FY ' || to_char(v_year_start, 'YYYY') || '-' || right(to_char(v_year_end, 'YYYY'), 2);

    if v_uid is not null then
        insert into public.company_members (company_id, user_id, role)
        values (new.id, v_uid, 'owner')
        on conflict (company_id, user_id) do nothing;
    end if;

    insert into public.financial_years (company_id, name, start_date, end_date, is_active)
    values (new.id, v_fy_name, v_year_start, v_year_end, true);

    perform public.sp_seed_defaults(new.id);

    return new;
end;
$$;

create trigger trg_companies_defaults
    after insert on public.companies
    for each row execute function public.fn_company_defaults();

create or replace function public.fn_voucher_stock_cleanup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    v_item_ids uuid[];
begin
    select coalesce(array_agg(distinct vi.item_id), '{}')
    into v_item_ids
    from public.voucher_items vi
    where vi.voucher_id = old.id;

    perform public.fn_resync_stock(old.company_id, v_item_ids);

    return old;
end;
$$;

create trigger trg_vouchers_stock_cleanup
    after delete on public.vouchers
    for each row execute function public.fn_voucher_stock_cleanup();