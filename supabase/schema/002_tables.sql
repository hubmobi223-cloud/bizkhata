-- Multi-tenancy root

create table public.companies (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    legal_name text,
    gstin text,
    pan text,
    address_line1 text,
    city text,
    state text,
    state_code char(2),
    pincode text,
    phone text,
    email text,
    logo_url text,
    currency text not null default 'INR',
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create unique index ux_companies_gstin on public.companies (gstin) where gstin is not null;

create table public.financial_years (
    id uuid primary key default gen_random_uuid(),
    company_id uuid not null references public.companies (id) on delete cascade,
    name text not null,
    start_date date not null,
    end_date date not null,
    is_active boolean not null default false,
    is_locked boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint ck_fy_range check (end_date > start_date)
);

create unique index ux_financial_years_name on public.financial_years (company_id, name);
create unique index ux_financial_years_active on public.financial_years (company_id) where is_active;

create table public.company_members (
    id uuid primary key default gen_random_uuid(),
    company_id uuid not null references public.companies (id) on delete cascade,
    user_id uuid not null references auth.users (id) on delete cascade,
    role public.company_member_role not null default 'accountant',
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint ux_company_members unique (company_id, user_id)
);

create index ix_company_members_user on public.company_members (user_id);

-- Chart of Accounts

create table public.account_groups (
    id uuid primary key default gen_random_uuid(),
    company_id uuid not null references public.companies (id) on delete cascade,
    parent_id uuid references public.account_groups (id) on delete cascade,
    name text not null,
    group_type public.account_group_type not null,
    is_summary boolean not null default false,
    sort_order int not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint ux_account_groups_name unique (company_id, name)
);

create index ix_account_groups_parent on public.account_groups (parent_id);

create table public.ledgers (
    id uuid primary key default gen_random_uuid(),
    company_id uuid not null references public.companies (id) on delete cascade,
    account_group_id uuid not null references public.account_groups (id),
    code text,
    name text not null,
    opening_debit numeric(18,2) not null default 0,
    opening_credit numeric(18,2) not null default 0,
    is_party boolean not null default false,
    is_cash_bank boolean not null default false,
    is_tax_ledger boolean not null default false,
    tax_rate numeric(5,2) not null default 0,
    gstin text,
    state_code char(2),
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint ux_ledgers_name unique (company_id, name),
    constraint ux_ledgers_code unique (company_id, code) where code is not null,
    constraint ck_ledger_opening check (
        (opening_debit = 0) or (opening_credit = 0)
    )
);

create index ix_ledgers_group on public.ledgers (company_id, account_group_id);

create table public.tax_masters (
    id uuid primary key default gen_random_uuid(),
    company_id uuid not null references public.companies (id) on delete cascade,
    name text not null,
    rate_pct numeric(5,2) not null,
    output_ledger_id uuid references public.ledgers (id) on delete set null,
    input_ledger_id uuid references public.ledgers (id) on delete set null,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint ux_tax_masters unique (company_id, name)
);

-- Inventory masters

create table public.units (
    id uuid primary key default gen_random_uuid(),
    company_id uuid not null references public.companies (id) on delete cascade,
    name text not null,
    uqc char(3),
    is_base boolean not null default false,
    created_at timestamptz not null default now(),
    constraint ux_units unique (company_id, name)
);

create table public.item_categories (
    id uuid primary key default gen_random_uuid(),
    company_id uuid not null references public.companies (id) on delete cascade,
    name text not null,
    created_at timestamptz not null default now(),
    constraint ux_item_categories unique (company_id, name)
);

create table public.items (
    id uuid primary key default gen_random_uuid(),
    company_id uuid not null references public.companies (id) on delete cascade,
    category_id uuid references public.item_categories (id) on delete set null,
    unit_id uuid not null references public.units (id),
    name text not null,
    code text,
    hsn_sac text,
    gst_rate numeric(5,2) not null default 0,
    item_type public.item_type not null default 'goods',
    batch_tracking boolean not null default false,
    expiry_tracking boolean not null default false,
    valuation_method public.valuation_method not null default 'weighted_average',
    is_sellable boolean not null default true,
    is_purchasable boolean not null default true,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint ux_items_code unique (company_id, code) where code is not null
);

create index ix_items_category on public.items (company_id, category_id);

create table public.batches (
    id uuid primary key default gen_random_uuid(),
    company_id uuid not null references public.companies (id) on delete cascade,
    item_id uuid not null references public.items (id) on delete cascade,
    batch_no text not null,
    mfg_date date,
    expiry_date date,
    status public.batch_status not null default 'open',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint ux_batches unique (company_id, item_id, batch_no)
);

-- Vouchers (double entry)

create table public.vouchers (
    id uuid primary key default gen_random_uuid(),
    company_id uuid not null references public.companies (id) on delete cascade,
    fy_id uuid not null references public.financial_years (id),
    voucher_number text not null,
    voucher_type public.voucher_type not null,
    voucher_date date not null,
    narration text,
    party_ledger_id uuid references public.ledgers (id) on delete set null,
    invoice_no text,
    invoice_date date,
    place_of_supply char(2),
    status public.voucher_status not null default 'posted',
    created_by uuid references auth.users (id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint ux_voucher_number unique (company_id, fy_id, voucher_type, voucher_number)
);

create index ix_vouchers_date on public.vouchers (company_id, fy_id, voucher_date);
create index ix_vouchers_party on public.vouchers (company_id, party_ledger_id);

create table public.voucher_entries (
    id uuid primary key default gen_random_uuid(),
    company_id uuid not null references public.companies (id) on delete cascade,
    voucher_id uuid not null references public.vouchers (id) on delete cascade,
    entry_no int not null,
    ledger_id uuid not null references public.ledgers (id),
    debit numeric(18,2) not null default 0,
    credit numeric(18,2) not null default 0,
    created_at timestamptz not null default now(),
    constraint ux_voucher_entry_no unique (voucher_id, entry_no),
    constraint ck_entry_nonnegative check (debit >= 0 and credit >= 0),
    constraint ck_entry_single_side check ((debit = 0) <> (credit = 0))
);

create index ix_voucher_entries_ledger on public.voucher_entries (company_id, ledger_id, voucher_id);
create index ix_voucher_entries_voucher on public.voucher_entries (voucher_id);

create table public.voucher_items (
    id uuid primary key default gen_random_uuid(),
    company_id uuid not null references public.companies (id) on delete cascade,
    voucher_id uuid not null references public.vouchers (id) on delete cascade,
    item_id uuid not null references public.items (id),
    unit_id uuid references public.units (id),
    batch_id uuid references public.batches (id) on delete set null,
    description text,
    qty numeric(18,3) not null check (qty > 0),
    rate numeric(18,4) not null default 0,
    discount numeric(18,2) not null default 0,
    taxable_value numeric(18,2) not null default 0,
    gst_rate numeric(5,2) not null default 0,
    cgst numeric(18,2) not null default 0,
    sgst numeric(18,2) not null default 0,
    igst numeric(18,2) not null default 0,
    cess numeric(18,2) not null default 0,
    sort_order int not null default 0,
    created_at timestamptz not null default now()
);

create index ix_voucher_items_item on public.voucher_items (company_id, item_id, voucher_id);
create index ix_voucher_items_voucher on public.voucher_items (voucher_id);

-- Stock movement: history + current balances (denormalised)

create table public.stock_ledger (
    id uuid primary key default gen_random_uuid(),
    company_id uuid not null references public.companies (id) on delete cascade,
    voucher_item_id uuid unique references public.voucher_items (id) on delete cascade,
    item_id uuid not null references public.items (id),
    batch_id uuid references public.batches (id) on delete set null,
    stock_date date not null,
    inward_qty numeric(18,3) not null default 0,
    outward_qty numeric(18,3) not null default 0,
    rate numeric(18,4) not null default 0,
    value numeric(18,2) not null default 0,
    balance_qty numeric(18,3) not null default 0,
    balance_value numeric(18,2) not null default 0
);

create index ix_stock_ledger_item on public.stock_ledger (company_id, item_id, stock_date);
create index ix_stock_ledger_batch on public.stock_ledger (company_id, batch_id);

create table public.stock_balances (
    id uuid primary key default gen_random_uuid(),
    company_id uuid not null references public.companies (id) on delete cascade,
    item_id uuid not null references public.items (id),
    batch_id uuid references public.batches (id) on delete set null,
    qty numeric(18,3) not null default 0,
    value numeric(18,2) not null default 0,
    updated_at timestamptz not null default now()
);

create unique index ux_stock_balances on public.stock_balances (
    company_id,
    item_id,
    coalesce(batch_id, '00000000-0000-0000-0000-000000000000')
);