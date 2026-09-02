create or replace view public.v_voucher_totals as
select
    v.id as voucher_id,
    v.company_id,
    v.fy_id,
    v.voucher_number,
    v.voucher_type,
    v.voucher_date,
    v.narration,
    v.party_ledger_id,
    v.invoice_no,
    v.invoice_date,
    v.place_of_supply,
    v.status,
    round(coalesce(sum(ve.debit), 0), 2) as total_debit,
    round(coalesce(sum(ve.credit), 0), 2) as total_credit
from public.vouchers v
left join public.voucher_entries ve on ve.voucher_id = v.id
group by v.id;

create or replace view public.v_ledger_postings as
select
    ve.id as entry_id,
    ve.company_id,
    ve.voucher_id,
    ve.ledger_id,
    ve.entry_no,
    ve.debit,
    ve.credit,
    l.name as ledger_name,
    ag.name as group_name,
    v.voucher_date,
    v.voucher_number,
    v.voucher_type,
    v.narration,
    v.status
from public.voucher_entries ve
join public.vouchers v on v.id = ve.voucher_id
join public.ledgers l on l.id = ve.ledger_id
join public.account_groups ag on ag.id = l.account_group_id;

create or replace view public.v_trial_balance as
select
    l.company_id,
    l.id as ledger_id,
    l.name as ledger_name,
    l.code,
    ag.name as group_name,
    ag.group_type,
    round(l.opening_debit, 2) as opening_debit,
    round(l.opening_credit, 2) as opening_credit,
    round(coalesce(sum(pe.debit), 0), 2) as period_debit,
    round(coalesce(sum(pe.credit), 0), 2) as period_credit,
    round(l.opening_debit + coalesce(sum(pe.debit), 0) - l.opening_credit - coalesce(sum(pe.credit), 0), 2) as net_balance
from public.ledgers l
join public.account_groups ag on ag.id = l.account_group_id
left join (
    select ve.ledger_id, ve.debit, ve.credit
    from public.voucher_entries ve
    join public.vouchers v on v.id = ve.voucher_id and v.status = 'posted'
) pe on pe.ledger_id = l.id
where l.is_active
group by l.id, ag.name, ag.group_type, l.opening_debit, l.opening_credit;

create or replace view public.v_day_book as
select
    v.id,
    v.company_id,
    v.fy_id,
    v.voucher_type,
    v.voucher_number,
    v.voucher_date,
    v.narration,
    p.name as party_name,
    round(coalesce(sum(ve.debit), 0), 2) as debit,
    round(coalesce(sum(ve.credit), 0), 2) as credit,
    v.status
from public.vouchers v
left join public.voucher_entries ve on ve.voucher_id = v.id
left join public.ledgers p on p.id = v.party_ledger_id
group by v.id, p.name;

create or replace view public.v_gstr1 as
select
    v.company_id,
    v.fy_id,
    v.id as voucher_id,
    v.voucher_type,
    v.invoice_no,
    v.voucher_date as invoice_date,
    p.name as receiver_name,
    p.gstin as receiver_gstin,
    v.place_of_supply,
    case
        when c.state_code = coalesce(v.place_of_supply, p.state_code, c.state_code)
        then 'intra'::text else 'inter'::text
    end as supply_type,
    vi.id as voucher_item_id,
    i.hsn_sac,
    i.name as item_name,
    vi.qty,
    u.name as unit,
    u.uqc,
    round(vi.taxable_value, 2) as taxable_value,
    vi.gst_rate,
    round(vi.cgst, 2) as cgst,
    round(vi.sgst, 2) as sgst,
    round(vi.igst, 2) as igst,
    round(vi.cess, 2) as cess
from public.vouchers v
join public.companies c on c.id = v.company_id
left join public.ledgers p on p.id = v.party_ledger_id
left join public.voucher_items vi on vi.voucher_id = v.id
left join public.items i on i.id = vi.item_id
left join public.units u on u.id = vi.unit_id
where v.voucher_type in ('sales', 'credit_note')
  and v.status = 'posted';

create or replace view public.v_gstr3b as
select
    v.company_id,
    v.fy_id,
    vi.gst_rate,
    case
        when c.state_code = coalesce(v.place_of_supply, p.state_code, c.state_code)
        then 'intra'::text else 'inter'::text
    end as supply_type,
    round(sum(vi.taxable_value), 2) as taxable_value,
    round(sum(vi.cgst), 2) as cgst,
    round(sum(vi.sgst), 2) as sgst,
    round(sum(vi.igst), 2) as igst,
    round(sum(vi.cess), 2) as cess
from public.voucher_items vi
join public.vouchers v on v.id = vi.voucher_id and v.status = 'posted'
join public.companies c on c.id = v.company_id
left join public.ledgers p on p.id = v.party_ledger_id
where v.voucher_type in ('sales', 'credit_note', 'debit_note', 'purchase')
group by v.company_id, v.fy_id, vi.gst_rate, supply_type;

create or replace view public.v_stock_book as
select
    sl.id,
    sl.company_id,
    sl.item_id,
    i.name as item_name,
    i.hsn_sac,
    sl.batch_id,
    b.batch_no,
    sl.stock_date,
    sl.voucher_item_id,
    vi.voucher_id,
    v.voucher_type,
    case when sl.inward_qty <> 0 then 'in' else 'out' end as movement,
    sl.inward_qty,
    sl.outward_qty,
    sl.rate,
    sl.value,
    sl.balance_qty,
    sl.balance_value
from public.stock_ledger sl
join public.items i on i.id = sl.item_id
left join public.batches b on b.id = sl.batch_id
left join public.voucher_items vi on vi.id = sl.voucher_item_id
left join public.vouchers v on v.id = vi.voucher_id;

create or replace function public.fn_ledger_statement(
    p_company uuid,
    p_ledger uuid,
    p_from date,
    p_to date
)
returns table (
    voucher_date date,
    voucher_number text,
    voucher_type public.voucher_type,
    narration text,
    debit numeric,
    credit numeric,
    running_balance numeric
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
    v_open numeric;
begin
    if not public.fn_has_access(p_company) then
        raise exception 'Not authorized for this company';
    end if;

    v_open := public.fn_ledger_balance(p_company, p_ledger, p_from - 1);

    return query
    with base as (
        select
            v.voucher_date,
            v.voucher_number,
            v.voucher_type,
            v.narration,
            ve.debit,
            ve.credit,
            ve.id as sort_id
        from public.voucher_entries ve
        join public.vouchers v on v.id = ve.voucher_id
        where ve.ledger_id = p_ledger
          and v.company_id = p_company
          and v.status = 'posted'
          and v.voucher_date between p_from and p_to
    )
    select
        base.voucher_date,
        base.voucher_number,
        base.voucher_type,
        base.narration,
        base.debit,
        base.credit,
        round(v_open + sum(base.debit - base.credit) over (
            order by base.voucher_date, base.voucher_number, base.sort_id
        ), 2) as running_balance
    from base
    order by base.voucher_date, base.voucher_number, base.sort_id;
end;
$$;