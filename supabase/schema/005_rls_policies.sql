alter table public.companies enable row level security;
alter table public.financial_years enable row level security;
alter table public.company_members enable row level security;
alter table public.account_groups enable row level security;
alter table public.ledgers enable row level security;
alter table public.tax_masters enable row level security;
alter table public.units enable row level security;
alter table public.item_categories enable row level security;
alter table public.items enable row level security;
alter table public.batches enable row level security;
alter table public.vouchers enable row level security;
alter table public.voucher_entries enable row level security;
alter table public.voucher_items enable row level security;
alter table public.stock_ledger enable row level security;
alter table public.stock_balances enable row level security;

create policy "companies_select" on public.companies
    for select using (public.fn_has_access(id));

create policy "companies_insert" on public.companies
    for insert with check (auth.uid() is not null);

create policy "companies_update" on public.companies
    for update using (public.fn_can_admin(id)) with check (public.fn_can_admin(id));

create policy "companies_delete" on public.companies
    for delete using (public.fn_can_admin(id));

create policy "financial_years_select" on public.financial_years
    for select using (public.fn_has_access(company_id));

create policy "financial_years_insert" on public.financial_years
    for insert with check (public.fn_can_admin(company_id));

create policy "financial_years_update" on public.financial_years
    for update using (public.fn_can_admin(company_id)) with check (public.fn_can_admin(company_id));

create policy "financial_years_delete" on public.financial_years
    for delete using (public.fn_can_admin(company_id));

create policy "company_members_select" on public.company_members
    for select using (user_id = auth.uid());

create policy "company_members_insert" on public.company_members
    for insert with check (
        exists (
            select 1 from public.company_members cm
            where cm.company_id = company_id
              and cm.user_id = auth.uid()
              and cm.role in ('owner', 'admin')
        )
        or user_id = auth.uid()
    );

create policy "company_members_update" on public.company_members
    for update using (
        exists (
            select 1 from public.company_members cm
            where cm.company_id = company_id
              and cm.user_id = auth.uid()
              and cm.role in ('owner', 'admin')
        )
    ) with check (
        exists (
            select 1 from public.company_members cm
            where cm.company_id = company_id
              and cm.user_id = auth.uid()
              and cm.role = 'owner'
        )
    );

create policy "company_members_delete" on public.company_members
    for delete using (
        exists (
            select 1 from public.company_members cm
            where cm.company_id = company_id
              and cm.user_id = auth.uid()
              and cm.role = 'owner'
        )
    );

create policy "account_groups_select" on public.account_groups
    for select using (public.fn_has_access(company_id));

create policy "account_groups_insert" on public.account_groups
    for insert with check (public.fn_has_access(company_id));

create policy "account_groups_update" on public.account_groups
    for update using (public.fn_has_access(company_id)) with check (public.fn_has_access(company_id));

create policy "account_groups_delete" on public.account_groups
    for delete using (public.fn_has_access(company_id));

create policy "ledgers_select" on public.ledgers
    for select using (public.fn_has_access(company_id));

create policy "ledgers_insert" on public.ledgers
    for insert with check (public.fn_has_access(company_id));

create policy "ledgers_update" on public.ledgers
    for update using (public.fn_has_access(company_id)) with check (public.fn_has_access(company_id));

create policy "ledgers_delete" on public.ledgers
    for delete using (public.fn_has_access(company_id));

create policy "tax_masters_select" on public.tax_masters
    for select using (public.fn_has_access(company_id));

create policy "tax_masters_insert" on public.tax_masters
    for insert with check (public.fn_has_access(company_id));

create policy "tax_masters_update" on public.tax_masters
    for update using (public.fn_has_access(company_id)) with check (public.fn_has_access(company_id));

create policy "tax_masters_delete" on public.tax_masters
    for delete using (public.fn_has_access(company_id));

create policy "units_select" on public.units
    for select using (public.fn_has_access(company_id));

create policy "units_insert" on public.units
    for insert with check (public.fn_has_access(company_id));

create policy "units_update" on public.units
    for update using (public.fn_has_access(company_id)) with check (public.fn_has_access(company_id));

create policy "units_delete" on public.units
    for delete using (public.fn_has_access(company_id));

create policy "item_categories_select" on public.item_categories
    for select using (public.fn_has_access(company_id));

create policy "item_categories_insert" on public.item_categories
    for insert with check (public.fn_has_access(company_id));

create policy "item_categories_update" on public.item_categories
    for update using (public.fn_has_access(company_id)) with check (public.fn_has_access(company_id));

create policy "item_categories_delete" on public.item_categories
    for delete using (public.fn_has_access(company_id));

create policy "items_select" on public.items
    for select using (public.fn_has_access(company_id));

create policy "items_insert" on public.items
    for insert with check (public.fn_has_access(company_id));

create policy "items_update" on public.items
    for update using (public.fn_has_access(company_id)) with check (public.fn_has_access(company_id));

create policy "items_delete" on public.items
    for delete using (public.fn_has_access(company_id));

create policy "batches_select" on public.batches
    for select using (public.fn_has_access(company_id));

create policy "batches_insert" on public.batches
    for insert with check (public.fn_has_access(company_id));

create policy "batches_update" on public.batches
    for update using (public.fn_has_access(company_id)) with check (public.fn_has_access(company_id));

create policy "batches_delete" on public.batches
    for delete using (public.fn_has_access(company_id));

create policy "vouchers_select" on public.vouchers
    for select using (public.fn_has_access(company_id));

create policy "vouchers_insert" on public.vouchers
    for insert with check (public.fn_has_access(company_id));

create policy "vouchers_update" on public.vouchers
    for update using (public.fn_has_access(company_id)) with check (public.fn_has_access(company_id));

create policy "vouchers_delete" on public.vouchers
    for delete using (public.fn_has_access(company_id));

create policy "voucher_entries_select" on public.voucher_entries
    for select using (public.fn_has_access(company_id));

create policy "voucher_entries_insert" on public.voucher_entries
    for insert with check (public.fn_has_access(company_id));

create policy "voucher_entries_update" on public.voucher_entries
    for update using (public.fn_has_access(company_id)) with check (public.fn_has_access(company_id));

create policy "voucher_entries_delete" on public.voucher_entries
    for delete using (public.fn_has_access(company_id));

create policy "voucher_items_select" on public.voucher_items
    for select using (public.fn_has_access(company_id));

create policy "voucher_items_insert" on public.voucher_items
    for insert with check (public.fn_has_access(company_id));

create policy "voucher_items_update" on public.voucher_items
    for update using (public.fn_has_access(company_id)) with check (public.fn_has_access(company_id));

create policy "voucher_items_delete" on public.voucher_items
    for delete using (public.fn_has_access(company_id));

create policy "stock_ledger_select" on public.stock_ledger
    for select using (public.fn_has_access(company_id));

create policy "stock_ledger_insert" on public.stock_ledger
    for insert with check (public.fn_has_access(company_id));

create policy "stock_ledger_update" on public.stock_ledger
    for update using (public.fn_has_access(company_id)) with check (public.fn_has_access(company_id));

create policy "stock_ledger_delete" on public.stock_ledger
    for delete using (public.fn_has_access(company_id));

create policy "stock_balances_select" on public.stock_balances
    for select using (public.fn_has_access(company_id));

create policy "stock_balances_insert" on public.stock_balances
    for insert with check (public.fn_has_access(company_id));

create policy "stock_balances_update" on public.stock_balances
    for update using (public.fn_has_access(company_id)) with check (public.fn_has_access(company_id));

create policy "stock_balances_delete" on public.stock_balances
    for delete using (public.fn_has_access(company_id));

revoke all on function public.sp_post_voucher(uuid, uuid, public.voucher_type, date, jsonb, uuid, text, date, character, text, jsonb) from public;
revoke all on function public.sp_cancel_voucher(uuid) from public;
revoke all on function public.sp_create_company(text, date, date, text, character) from public;
revoke all on function public.sp_seed_defaults(uuid) from public;
revoke all on function public.fn_resync_stock(uuid, uuid[]) from public;
revoke all on function public.fn_has_access(uuid) from public;
revoke all on function public.fn_can_admin(uuid) from public;
revoke all on function public.fn_current_fy(uuid) from public;
revoke all on function public.fn_next_voucher_number(uuid, uuid, public.voucher_type) from public;
revoke all on function public.fn_ledger_balance(uuid, uuid, date) from public;
revoke all on function public.fn_ledger_statement(uuid, uuid, date, date) from public;

grant execute on function public.sp_post_voucher(uuid, uuid, public.voucher_type, date, jsonb, uuid, text, date, character, text, jsonb) to authenticated;
grant execute on function public.sp_cancel_voucher(uuid) to authenticated;
grant execute on function public.sp_create_company(text, date, date, text, character) to authenticated;
grant execute on function public.fn_profit_loss(uuid, date, date) to authenticated;
grant execute on function public.fn_balance_sheet(uuid, date) to authenticated;
grant execute on function public.fn_ledger_statement(uuid, uuid, date, date) to authenticated;
grant execute on function public.fn_ledger_balance(uuid, uuid, date) to authenticated;
grant execute on function public.fn_has_access(uuid) to authenticated;
grant execute on function public.fn_can_admin(uuid) to authenticated;
grant execute on function public.fn_current_fy(uuid) to authenticated;