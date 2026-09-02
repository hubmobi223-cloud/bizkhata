# Architecture Principles

This document is the architectural source of truth. It describes the current (Chapter 1)
architecture, structural decisions, and the seams required by later chapters.

## 1. Current architecture

- **Web**: Next.js 16 (App Router, server components, Turbopack) + React 19 + Tailwind 4 +
  shadcn/ui. TypeScript strict. Package manager: npm. No `app/api/` routes today — all data
  access uses Supabase (browser `createClient` or SSR `createClient`).
- **Auth**: Supabase Auth (email/password + Google OAuth); SSR cookie sessions via
  `@supabase/ssr`; route protection in `src/proxy.ts` → `src/lib/supabase/middleware.ts` +
  server-side guard in `src/app/(app)/layout.tsx`.
- **Domain logic**: PostgreSQL 17. Functions invoked via PostgREST RPC:
  - AuthN/authZ helpers: `fn_has_access`, `fn_can_admin`
  - Company/FY: `sp_create_company`, `fn_current_fy`
  - Posting: `sp_post_voucher`, `sp_cancel_voucher` (both transactional, balance-checked)
  - Reports: `fn_ledger_balance`, `fn_ledger_statement`, `fn_profit_loss`, `fn_balance_sheet`,
    plus views `v_trial_balance`, `v_day_book`, `v_ledger_postings`, `v_gstr1`, `v_gstr3b`,
    `v_stock_book`.
- **Mobile**: Flutter (`../mobile/`) consumes the same Supabase backend through `BizApi`.

## 2. API-first

- Business rules are server-side and authoritative. UI components call functions/views; they
  never own financial truth.
- Mobile must never re-implement business logic (GST math is mirrored deterministically only
  for responsive UX and covered by identical unit tests on both sides).
- Future public API: `api/v1/…` (PostgREST contract), breaking changes → `api/v2/…`.

## 3. Module boundaries

| Domain | Owns | Interfaces |
|---|---|---|
| Identity & auth | users, sessions, OAuth | supabase auth streams (`src/lib/supabase/*`) |
| Tenancy & org | companies, members, FY, branches (future) | `company_members`, `fn_has_access` |
| Chart of accounts | `account_groups`, `ledgers` | api/ledgers.ts |
| Accounting | `vouchers`, `voucher_entries` | `sp_post_voucher`, `sp_cancel_voucher` |
| Inventory | `items`, `batches`, `stock_ledger`, `stock_balances` | api/inventory.ts, resync functions |
| Tax/GST | `tax_masters`, `src/lib/gst.ts` | `round2`, `splitTax`, GSTR views |
| Billing | sales/purchase invoice flows | `sp_post_voucher` + items, api/billing.ts |
| Reporting | report views/functions | `v_*`, `fn_*` |
| Notifications (future) | WhatsApp/e-mail jobs | async queue, adapter (below) |

## 4. External integrations — adapter pattern (roadmap)

- **GST/E-Invoice**: `GSTIntegrationProvider` interface; provider adapters (A/B/C) behind it.
  Sales invoice → eligibility → adapter → provider → IRP → IRN → QR data. No provider coupling
  in accounting.
- **E-Way Bill**: invoice → eligibility → transport details → provider → EWB number.
- **WhatsApp**: official Business Platform API only; async jobs; statuses
  PENDING/PROCESSING/SENT/DELIVERED/READ/FAILED with retry.
- Provider credentials live in server secrets only and are never exposed to frontends.

## 5. Failure-isolation rule

A notification/provider failure must never roll back a valid financial transaction. Example:
invoice posted + WhatsApp send fails → invoice valid, message FAILED/RETRY_PENDING. Adapters
return errors to a job layer, not to the accounting transaction.

## 6. Money and correctness

- DB `NUMERIC(18,2)` for money; `round2` shared util for 2-dp rounding with float safety.
- Critical workflows are single Postgres transactions (concurrency-safe advisory-locked
  numbering, balance trigger checks, stock resync) — no distributed partial-state windows.

## 7. File storage (roadmap)

Object storage for logos, invoice PDFs, attachments, import/export blobs; DB keeps metadata +
storage references. Never base-64 bloat columns.

## 8. Feature flags & configuration

- Feature flags (see `product.config.json`) gate incomplete/beta features; they must not
  surface as production functionality.
- Env-driven config: `.env.local.example` (placeholders only). Secrets never committed
  (`DATABASE_URL`, JWT/AUTH secrets, provider creds, storage creds).
- Supabase anon key is intentionally `NEXT_PUBLIC_` (public by design; RLS is the security
  boundary).

## 9. Testing architecture

Unit (vitest) + integration/API (supertest against a running server via `E2E_BASE_URL`) +
financial/security tests. See [DEVELOPMENT_RULES.md](DEVELOPMENT_RULES.md) and
[DEFINITION_OF_DONE.md](DEFINITION_OF_DONE.md).

## 10. Migration notes for later phases

- Customers/Suppliers: introduce first-class tables that reference existing party ledgers;
  preserve ledger continuity.
- Roles: extend `company_members.role` model to a role + permission catalog without breaking
  existing owner/admin/accountant/viewer semantics.
- Warehouses: stock_balances gains warehouse scope; stock movement records remain the source.
- Numbering: generalize `fn_next_voucher_number` to configurable prefixes/scopes (branch/FY).