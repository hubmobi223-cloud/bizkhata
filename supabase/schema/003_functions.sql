create or replace function public.fn_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
    new.updated_at := now();
    return new;
end;
$$;

create or replace function public.fn_has_access(p_company uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.company_members cm
        where cm.company_id = p_company
          and cm.user_id = auth.uid()
          and cm.is_active
    );
$$;

create or replace function public.fn_can_admin(p_company uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.company_members cm
        where cm.company_id = p_company
          and cm.user_id = auth.uid()
          and cm.is_active
          and cm.role in ('owner', 'admin')
    );
$$;

create or replace function public.fn_current_fy(p_company uuid)
returns public.financial_years
language sql
stable
security definer
set search_path = public
as $$
    select fy.*
    from public.financial_years fy
    where fy.company_id = p_company
      and fy.is_active
    limit 1;
$$;

create or replace function public.fn_next_voucher_number(
    p_company uuid,
    p_fy uuid,
    p_type public.voucher_type
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
    v_key bigint;
    v_next int;
begin
    v_key := ('x' || substr(md5(p_company::text || p_fy::text || p_type::text), 1, 16))::bit(64)::bigint;
    perform pg_advisory_xact_lock(v_key);

    select coalesce(max(voucher_number::int), 0) + 1
    into v_next
    from public.vouchers
    where company_id = p_company
      and fy_id = p_fy
      and voucher_type = p_type
      and voucher_number ~ '^[0-9]+$';

    return lpad(v_next::text, 6, '0');
end;
$$;

create or replace function public.fn_stock_direction(p_type public.voucher_type)
returns text
language sql
immutable
as $$
    select case p_type
        when 'purchase'        then 'in'
        when 'credit_note'     then 'in'
        when 'opening_balance' then 'in'
        when 'sales'           then 'out'
        when 'debit_note'      then 'out'
        else null
    end;
$$;

create or replace function public.fn_ledger_balance(
    p_company uuid,
    p_ledger uuid,
    p_as_on date default current_date
)
returns numeric
language sql
stable
security definer
set search_path = public
as $$
    select
        (select l.opening_debit - l.opening_credit
         from public.ledgers l
         where l.id = p_ledger and l.company_id = p_company)
        + coalesce((
            select sum(ve.debit - ve.credit)
            from public.voucher_entries ve
            join public.vouchers v on v.id = ve.voucher_id
            where ve.ledger_id = p_ledger
              and v.company_id = p_company
              and v.status = 'posted'
              and v.voucher_date <= p_as_on
        ), 0);
$$;

create or replace function public.fn_resync_stock(
    p_company uuid,
    p_item_ids uuid[]
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
    r record;
    v_is_in text;
    v_b_qty numeric;
    v_b_val numeric;
    v_rate numeric;
    v_cost numeric;
    v_val numeric;
    v_nqty numeric;
    v_nval numeric;
    v_nrate numeric;
    v_key uuid;
begin
    if p_item_ids is null or cardinality(p_item_ids) = 0 then
        return;
    end if;

    delete from public.stock_balances
    where company_id = p_company
      and item_id = any (p_item_ids);

    delete from public.stock_ledger sl
    where sl.company_id = p_company
      and sl.item_id = any (p_item_ids)
      and not exists (
          select 1
          from public.voucher_items vi
          join public.vouchers v on v.id = vi.voucher_id and v.status = 'posted'
          where vi.company_id = p_company
            and vi.id = sl.voucher_item_id
      );

    for r in (
        select vi.id as voucher_item_id,
               vi.item_id,
               vi.batch_id,
               v.voucher_date,
               v.voucher_type,
               vi.qty,
               vi.rate,
               vi.taxable_value
        from public.voucher_items vi
        join public.vouchers v on v.id = vi.voucher_id and v.status = 'posted'
        where vi.company_id = p_company
          and vi.item_id = any (p_item_ids)
        order by v.voucher_date, v.created_at, vi.id
    ) loop
        v_is_in := public.fn_stock_direction(r.voucher_type);

        if v_is_in is null then
            raise exception 'Voucher type % does not support inventory items', r.voucher_type;
        end if;

        delete from public.stock_ledger
        where company_id = p_company
          and voucher_item_id = r.voucher_item_id;

        select coalesce(sb.qty, 0), coalesce(sb.value, 0)
        into v_b_qty, v_b_val
        from (select 1) x
        left join public.stock_balances sb
          on sb.company_id = p_company
         and sb.item_id = r.item_id
         and sb.batch_id is not distinct from r.batch_id;

        if v_is_in = 'in' then
            v_rate := case
                when r.taxable_value > 0 and r.qty > 0 then r.taxable_value / r.qty
                else r.rate
            end;
            v_val := round((v_rate * r.qty)::numeric, 2);
            v_nqty := v_b_qty + r.qty;
            v_nval := v_b_val + v_val;
            v_nrate := case when v_nqty = 0 then 0 else v_nval / v_nqty end;

            insert into public.stock_ledger (
                company_id, voucher_item_id, item_id, batch_id,
                stock_date, inward_qty, outward_qty, rate, value,
                balance_qty, balance_value
            ) values (
                p_company, r.voucher_item_id, r.item_id, r.batch_id,
                r.voucher_date, r.qty, 0, v_rate, v_val,
                v_nqty, v_nval
            );
        else
            v_cost := case
                when v_b_qty = 0 then 0
                else v_b_val / v_b_qty
            end;
            v_val := round((v_cost * r.qty)::numeric, 2);

            if v_b_qty - r.qty < -0.001 then
                raise exception 'Insufficient stock for item %', r.item_id;
            end if;

            v_nqty := v_b_qty - r.qty;
            v_nval := v_b_val - v_val;
            v_nrate := case when v_nqty = 0 then 0 else v_nval / v_nqty end;

            insert into public.stock_ledger (
                company_id, voucher_item_id, item_id, batch_id,
                stock_date, inward_qty, outward_qty, rate, value,
                balance_qty, balance_value
            ) values (
                p_company, r.voucher_item_id, r.item_id, r.batch_id,
                r.voucher_date, 0, r.qty, v_cost, v_val,
                v_nqty, v_nval
            );
        end if;

        v_key := gen_random_uuid();

        insert into public.stock_balances (
            id, company_id, item_id, batch_id, qty, value
        ) values (
            v_key, p_company, r.item_id, r.batch_id, v_nqty, v_nval
        )
        on conflict (
            company_id,
            item_id,
            coalesce(batch_id, '00000000-0000-0000-0000-000000000000')
        ) do update
          set qty = excluded.qty,
              value = excluded.value,
              updated_at = now();
    end loop;
end;
$$;

create or replace function public.sp_post_voucher(
    p_company uuid,
    p_fy uuid,
    p_type public.voucher_type,
    p_date date,
    p_entries jsonb,
    p_party_ledger uuid default null,
    p_invoice_no text default null,
    p_invoice_date date default null,
    p_place_of_supply char(2) default null,
    p_narration text default null,
    p_items jsonb default '[]'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
    v_id uuid := gen_random_uuid();
    v_e jsonb;
    v_i jsonb;
    v_debit numeric := 0;
    v_credit numeric := 0;
    v_sort int := 0;
    v_entry_no int := 1;
    v_item_ids uuid[] := '{}';
    v_locked boolean;
begin
    if not public.fn_has_access(p_company) then
        raise exception 'Not authorized for this company';
    end if;

    select is_locked into v_locked
    from public.financial_years fy
    where fy.id = p_fy and fy.company_id = p_company;

    if v_locked is null then
        raise exception 'Invalid financial year';
    end if;

    if v_locked then
        raise exception 'Financial year is locked';
    end if;

    if p_type in ('sales', 'purchase', 'credit_note', 'debit_note')
       and p_party_ledger is null then
        raise exception 'Party ledger is required for %', p_type;
    end if;

    if jsonb_array_length(p_entries) < 2 then
        raise exception 'Voucher must have at least two entries';
    end if;

    for v_e in
        select value from jsonb_array_elements(p_entries)
    loop
        if not (v_e ? 'ledger_id' and v_e ? 'debit' and v_e ? 'credit') then
            raise exception 'Each entry must contain ledger_id, debit and credit';
        end if;
        if NULLIF(v_e ->> 'ledger_id', '') is null then
            raise exception 'Entry ledger_id cannot be null';
        end if;
        v_debit  := v_debit + coalesce((v_e ->> 'debit')::numeric, 0);
        v_credit := v_credit + coalesce((v_e ->> 'credit')::numeric, 0);
    end loop;

    if round(v_debit, 2) <> round(v_credit, 2) then
        raise exception 'Voucher does not balance: debit % vs credit %',
            round(v_debit, 2), round(v_credit, 2);
    end if;

    insert into public.vouchers (
        id, company_id, fy_id, voucher_type, voucher_date, narration,
        party_ledger_id, invoice_no, invoice_date, place_of_supply, status,
        created_by
    ) values (
        v_id, p_company, p_fy, p_type, p_date, p_narration,
        p_party_ledger, p_invoice_no, p_invoice_date, p_place_of_supply, 'posted',
        auth.uid()
    );

    for v_e in
        select value from jsonb_array_elements(p_entries)
    loop
        insert into public.voucher_entries (
            company_id, voucher_id, entry_no, ledger_id, debit, credit
        ) values (
            p_company, v_id, v_entry_no,
            (v_e ->> 'ledger_id')::uuid,
            round(coalesce((v_e ->> 'debit')::numeric, 0)::numeric, 2),
            round(coalesce((v_e ->> 'credit')::numeric, 0)::numeric, 2)
        );
        v_entry_no := v_entry_no + 1;
    end loop;

    if p_items is not null and jsonb_array_length(p_items) > 0 then
        if p_type not in ('sales', 'purchase', 'credit_note', 'debit_note', 'opening_balance') then
            raise exception 'Inventory items not allowed for %', p_type;
        end if;

        for v_i in
            select value from jsonb_array_elements(p_items)
        loop
            if not (v_i ? 'item_id' and v_i ? 'qty'
                     and v_i ? 'rate' and v_i ? 'taxable_value'
                     and v_i ? 'gst_rate') then
                raise exception 'Each item must contain item_id, qty, rate, taxable_value and gst_rate';
            end if;

            insert into public.voucher_items (
                company_id, voucher_id, item_id, unit_id, batch_id, description,
                qty, rate, discount, taxable_value, gst_rate,
                cgst, sgst, igst, cess, sort_order
            ) values (
                p_company, v_id,
                (v_i ->> 'item_id')::uuid,
                nullif(v_i ->> 'unit_id', '')::uuid,
                nullif(v_i ->> 'batch_id', '')::uuid,
                nullif(v_i ->> 'description', ''),
                (v_i ->> 'qty')::numeric,
                (v_i ->> 'rate')::numeric,
                coalesce((v_i ->> 'discount')::numeric, 0),
                (v_i ->> 'taxable_value')::numeric,
                (v_i ->> 'gst_rate')::numeric,
                coalesce((v_i ->> 'cgst')::numeric, 0),
                coalesce((v_i ->> 'sgst')::numeric, 0),
                coalesce((v_i ->> 'igst')::numeric, 0),
                coalesce((v_i ->> 'cess')::numeric, 0),
                v_sort
            );

            v_item_ids := v_item_ids || (v_i ->> 'item_id')::uuid;
            v_sort := v_sort + 1;
        end loop;

        perform public.fn_resync_stock(p_company, v_item_ids);
    end if;

    return v_id;
end;
$$;

create or replace function public.sp_cancel_voucher(p_voucher_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
    v_company uuid;
    v_item_ids uuid[] := '{}';
begin
    select company_id into v_company
    from public.vouchers
    where id = p_voucher_id;

    if v_company is null then
        raise exception 'Voucher not found';
    end if;

    if not public.fn_has_access(v_company) then
        raise exception 'Not authorized for this company';
    end if;

    update public.vouchers
    set status = 'cancelled'
    where id = p_voucher_id
      and status = 'posted';

    select coalesce(array_agg(distinct vi.item_id), '{}')
    into v_item_ids
    from public.voucher_items vi
    where vi.voucher_id = p_voucher_id;

    perform public.fn_resync_stock(v_company, v_item_ids);
end;
$$;

create or replace function public.sp_seed_defaults(p_company uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
    v_assets uuid;
    v_cur_assets uuid;
    v_liabilities uuid;
    v_cur_liabilities uuid;
    v_income uuid;
    v_expense uuid;
    v_capital uuid;
    v_sales uuid;
    v_purchase uuid;
begin
    insert into public.account_groups (company_id, name, group_type, is_summary, sort_order)
    values (p_company, 'Assets', 'assets', true, 10),
           (p_company, 'Liabilities', 'liabilities', true, 20),
           (p_company, 'Income', 'income', true, 30),
           (p_company, 'Expenses', 'expense', true, 40)
    on conflict (company_id, name) do nothing;

    insert into public.account_groups (company_id, parent_id, name, group_type, sort_order)
    select p_company, ag.id, s.name, s.group_type, s.sort_order
    from (
        values
            ('Current Assets', 'assets', 11, 'Assets'),
            ('Fixed Assets', 'assets', 12, 'Assets'),
            ('Current Liabilities', 'liabilities', 21, 'Liabilities'),
            ('Capital', 'liabilities', 22, 'Liabilities'),
            ('Sales Account', 'income', 31, 'Income'),
            ('Direct Income', 'income', 32, 'Income'),
            ('Indirect Income', 'income', 33, 'Income'),
            ('Purchase Account', 'expense', 41, 'Expenses'),
            ('Direct Expenses', 'expense', 42, 'Expenses'),
            ('Indirect Expenses', 'expense', 43, 'Expenses')
    ) as s(name, group_type, sort_order, parent)
    join public.account_groups ag
      on ag.company_id = p_company and ag.name = s.parent
    on conflict (company_id, name) do nothing;

    select id into v_cur_assets     from public.account_groups where company_id = p_company and name = 'Current Assets';
    select id into v_cur_liabilities from public.account_groups where company_id = p_company and name = 'Current Liabilities';
    select id into v_capital        from public.account_groups where company_id = p_company and name = 'Capital';
    select id into v_sales          from public.account_groups where company_id = p_company and name = 'Sales Account';
    select id into v_purchase       from public.account_groups where company_id = p_company and name = 'Purchase Account';

    if not exists (select 1 from public.ledgers where company_id = p_company and name = 'Capital') then
        insert into public.ledgers (company_id, account_group_id, name, is_party, is_cash_bank)
        values (p_company, v_capital, 'Capital', false, false);
    end if;

    if not exists (select 1 from public.ledgers where company_id = p_company and name = 'Cash in Hand') then
        insert into public.ledgers (company_id, account_group_id, name, is_cash_bank)
        values (p_company, v_cur_assets, 'Cash in Hand', true);
    end if;

    if not exists (select 1 from public.ledgers where company_id = p_company and name = 'Bank Account') then
        insert into public.ledgers (company_id, account_group_id, name, is_cash_bank)
        values (p_company, v_cur_assets, 'Bank Account', true);
    end if;

    if not exists (select 1 from public.ledgers where company_id = p_company and name = 'Sundry Debtors') then
        insert into public.ledgers (company_id, account_group_id, name, is_party, is_cash_bank)
        values (p_company, v_cur_assets, 'Sundry Debtors', true, false);
    end if;

    if not exists (select 1 from public.ledgers where company_id = p_company and name = 'Sundry Creditors') then
        insert into public.ledgers (company_id, account_group_id, name, is_party, is_cash_bank)
        values (p_company, v_cur_liabilities, 'Sundry Creditors', true, false);
    end if;

    if not exists (select 1 from public.ledgers where company_id = p_company and name = 'Sales A/c') then
        insert into public.ledgers (company_id, account_group_id, name)
        values (p_company, v_sales, 'Sales A/c');
    end if;

    if not exists (select 1 from public.ledgers where company_id = p_company and name = 'Purchase A/c') then
        insert into public.ledgers (company_id, account_group_id, name)
        values (p_company, v_purchase, 'Purchase A/c');
    end if;

    if not exists (select 1 from public.ledgers where company_id = p_company and name = 'CGST Output A/c') then
        insert into public.ledgers (company_id, account_group_id, name, is_tax_ledger, tax_rate)
        values (p_company, v_cur_liabilities, 'CGST Output A/c', true, 9);
    end if;

    if not exists (select 1 from public.ledgers where company_id = p_company and name = 'SGST Output A/c') then
        insert into public.ledgers (company_id, account_group_id, name, is_tax_ledger, tax_rate)
        values (p_company, v_cur_liabilities, 'SGST Output A/c', true, 9);
    end if;

    if not exists (select 1 from public.ledgers where company_id = p_company and name = 'IGST Output A/c') then
        insert into public.ledgers (company_id, account_group_id, name, is_tax_ledger, tax_rate)
        values (p_company, v_cur_liabilities, 'IGST Output A/c', true, 18);
    end if;

    if not exists (select 1 from public.ledgers where company_id = p_company and name = 'CGST Input A/c') then
        insert into public.ledgers (company_id, account_group_id, name, is_tax_ledger, tax_rate)
        values (p_company, v_cur_assets, 'CGST Input A/c', true, 9);
    end if;

    if not exists (select 1 from public.ledgers where company_id = p_company and name = 'SGST Input A/c') then
        insert into public.ledgers (company_id, account_group_id, name, is_tax_ledger, tax_rate)
        values (p_company, v_cur_assets, 'SGST Input A/c', true, 9);
    end if;

    if not exists (select 1 from public.ledgers where company_id = p_company and name = 'IGST Input A/c') then
        insert into public.ledgers (company_id, account_group_id, name, is_tax_ledger, tax_rate)
        values (p_company, v_cur_assets, 'IGST Input A/c', true, 18);
    end if;
end;
$$;

create or replace function public.sp_create_company(
    p_name text,
    p_fy_start date default null,
    p_fy_end date default null,
    p_gstin text default null,
    p_state_code char(2) default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
    v_company uuid := gen_random_uuid();
    v_uid uuid := auth.uid();
    v_year_start date;
    v_year_end date;
    v_fy_name text;
begin
    if v_uid is null then
        raise exception 'Authentication required';
    end if;

    if p_fy_start is null or p_fy_end is null then
        v_year_start := date_trunc('year', current_date - interval '9 months')::date;
        v_year_end := (v_year_start + interval '1 year')::date;
    else
        v_year_start := p_fy_start;
        v_year_end := p_fy_end;
    end if;

    v_fy_name := 'FY ' || to_char(v_year_start, 'YYYY') || '-' || right(to_char(v_year_end, 'YYYY'), 2);

    insert into public.companies (id, name, gstin, state_code)
    values (v_company, p_name, p_gstin, p_state_code);

    insert into public.company_members (company_id, user_id, role)
    values (v_company, v_uid, 'owner');

    insert into public.financial_years (company_id, name, start_date, end_date, is_active)
    values (v_company, v_fy_name, v_year_start, v_year_end, true);

    perform public.sp_seed_defaults(v_company);

    return v_company;
end;
$$;

create or replace function public.fn_profit_loss(
    p_company uuid,
    p_from date default null,
    p_to date default null
)
returns table (
    group_name text,
    ledger_name text,
    amount numeric
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
    v_from date := coalesce(p_from, (select start_date from public.financial_years where company_id = p_company and is_active limit 1), '1900-01-01'::date);
    v_to date := coalesce(p_to, current_date);
begin
    if not public.fn_has_access(p_company) then
        raise exception 'Not authorized for this company';
    end if;

    return query
    with movable as (
        select ve.ledger_id, round(sum(ve.debit - ve.credit), 2) as net
        from public.voucher_entries ve
        join public.vouchers v on v.id = ve.voucher_id
        where ve.company_id = p_company
          and v.status = 'posted'
          and v.voucher_date between v_from and v_to
        group by ve.ledger_id
    )
    select ag.name as group_name,
           l.name as ledger_name,
           round((l.opening_debit - l.opening_credit) + coalesce(mv.net, 0), 2) as amount
    from public.ledgers l
    join public.account_groups ag on ag.id = l.account_group_id
    left join movable mv on mv.ledger_id = l.id
    where l.company_id = p_company
      and ag.group_type in ('income', 'expense')
      and ag.is_summary = false
    order by ag.sort_order, l.name;

    if not found then
        return query select 'Total'::text, 'Net Profit / (Loss)'::text, 0::numeric;
    end if;
end;
$$;

create or replace function public.fn_balance_sheet(
    p_company uuid,
    p_as_on date default current_date
)
returns table (
    section text,
    group_name text,
    ledger_name text,
    amount numeric
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
    v_profit numeric;
begin
    if not public.fn_has_access(p_company) then
        raise exception 'Not authorized for this company';
    end if;

    with movable as (
        select ve.ledger_id, round(sum(ve.debit - ve.credit), 2) as net
        from public.voucher_entries ve
        join public.vouchers v on v.id = ve.voucher_id
        where ve.company_id = p_company
          and v.status = 'posted'
          and v.voucher_date <= p_as_on
        group by ve.ledger_id
    )
    select round(sum(
        case when ag.group_type = 'income'
             then (l.opening_debit - l.opening_credit) + coalesce(mv.net, 0)
             else -((l.opening_debit - l.opening_credit) + coalesce(mv.net, 0))
        end
    ), 2)
    into v_profit
    from public.ledgers l
    join public.account_groups ag on ag.id = l.account_group_id
    left join movable mv on mv.ledger_id = l.id
    where l.company_id = p_company
      and ag.group_type in ('income', 'expense');

    v_profit := coalesce(v_profit, 0);

    with movable as (
        select ve.ledger_id, round(sum(ve.debit - ve.credit), 2) as net
        from public.voucher_entries ve
        join public.vouchers v on v.id = ve.voucher_id
        where ve.company_id = p_company
          and v.status = 'posted'
          and v.voucher_date <= p_as_on
        group by ve.ledger_id
    ),
    real_accounts as (
        select l.id, l.name, ag.id as group_id, ag.name as group_name, ag.group_type,
               round((l.opening_debit - l.opening_credit) + coalesce(mv.net, 0), 2) as bal
        from public.ledgers l
        join public.account_groups ag on ag.id = l.account_group_id
        left join movable mv on mv.ledger_id = l.id
        where l.company_id = p_company
          and ag.group_type in ('assets', 'liabilities')
    )
    return query
    select
        case when ra.group_type = 'assets' then 'ASSETS' else 'LIABILITIES' end as section,
        ra.group_name,
        ra.ledger_name,
        case when ra.group_type = 'assets' then ra.bal else -ra.bal end as amount
    from real_accounts ra
    order by ra.group_type, ra.group_name, ra.ledger_name;

    return query
    select 'LIABILITIES'::text,
           'Capital'::text,
           case when v_profit >= 0 then 'Current Period Profit' else 'Current Period Loss' end,
           v_profit;
end;
$$;