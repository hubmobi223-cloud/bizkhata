create extension if not exists pgcrypto;

create type public.account_group_type as enum (
    'assets',
    'liabilities',
    'income',
    'expense'
);

create type public.voucher_type as enum (
    'receipt',
    'payment',
    'journal',
    'contra',
    'sales',
    'purchase',
    'credit_note',
    'debit_note',
    'opening_balance'
);

create type public.voucher_status as enum (
    'draft',
    'posted',
    'cancelled'
);

create type public.item_type as enum (
    'goods',
    'service'
);

create type public.valuation_method as enum (
    'fifo',
    'weighted_average'
);

create type public.company_member_role as enum (
    'owner',
    'admin',
    'accountant',
    'viewer'
);

create type public.batch_status as enum (
    'open',
    'closed'
);