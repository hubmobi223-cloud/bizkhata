# Business Rules

Authoritative business rules for BizKhata. Where a rule conflicts with UI convenience,
financial integrity wins (see [Financial safety rule](#financial-safety)). "Now" = current
state (Chapter 1); "Roadmap" = planned in later chapters.

## Tenancy

- A user may belong to multiple organizations (companies).
- The active organization must always be explicitly resolved (company switcher; never implicit).
- Every organization-owned record contains an organization scope (`company_id`).
- Every organization-owned query enforces that scope — server-side, via RLS + helper functions, never by trusting client input.
- See [TENANT_SECURITY_RULES.md](TENANT_SECURITY_RULES.md).

## Organization / Company

- Fields: legal name, display name, business type, PAN, GSTIN, address, state, district, city,
  PIN, email, phone, website, logo, financial year, currency, timezone, invoice configuration.
- Creating a company (now): `sp_create_company` creates the company, the owning member,
  the active financial year, and seeds default groups/ledgers.
- Multiple GST registrations/branches must be addable later without rewriting core architecture.

## Branches (roadmap)

- Branch: name, code, address, GST registration, contact info, invoice numbering, warehouse, users.
- Branch access is permission-controlled; a branch manager must not implicitly see another
  branch's restricted data.

## Warehouses (roadmap)

- Multiple warehouses (Main, Godown 1, Transit, …).
- Every stock movement creates a movement record; never mutate balances directly (now enforced
  via `stock_ledger` + resync in `sp_post_voucher`/`sp_cancel_voucher`).

## Financial year

- Default Indian FY: 1 April – 31 March (e.g. FY 2026-27 = 2026-04-01 → 2027-03-31).
- Transactions belong to a financial period. Posting outside the active period is blocked unless
  a controlled administrative workflow allows it (roadmap: configurable lock/unlock).

## Accounting engine

- Double-entry. Invariant: **total debit == total credit**. Unbalanced journals cannot post
  (enforced by `trg_voucher_entries_balance` + `sp_post_voucher`).

## Chart of accounts

- Root groups: Assets, Liabilities, Income, Expenses (+ Equity later).
- Users may create additional groups/ledgers while preserving system integrity. Defaults are
  seeded by `sp_seed_defaults`.

## Customers (roadmap: first-class entity; now modeled as party ledgers)

- Fields: name (mandatory), mobile, email, GSTIN, PAN, billing address, shipping address,
  state, opening balance, credit limit, credit days, notes.
- GSTIN format-validated when supplied; duplicates detected; duplicate-name warning.
- Opening balance integrates with accounting.
- Deletion restricted once financial transactions reference the customer; prefer
  soft-delete/archive.

## Suppliers (roadmap)

- Same rules as customers, incl. opening balance and credit terms; deletion restrictions apply.

## Products (roadmap; now modeled as items)

- Fields: name, SKU, barcode, category, unit, HSN/SAC, GST rate, purchase price, sales price,
  MRP, reorder level, opening stock.
- Future: variants, batches (now supported at item level), expiry, serial numbers.

## Stock integrity

- Stock is movement-based. Sales decrease; purchases increase; transfers move between
  warehouses; adjustments create an audited movement.
- Default: **no negative stock**. Organization setting `allow_negative_stock` may enable it;
  negative movements remain auditable.

## Sales invoice lifecycle

`DRAFT → CONFIRMED → POSTED → PAID / PARTIALLY_PAID / UNPAID → CANCELLED`

- Posting coordinates customer ledger, inventory, GST transaction, journal, and audit trail
  atomically (now: single `sp_post_voucher` transaction).

## Posted transactions

- Posted financial records are **not freely editable**. Use cancellation, credit/debit notes,
  reversal, or replacement — never silent edits (now: `sp_cancel_voucher` sets status
  `cancelled` and resyncs stock; entries are retained for audit).

## Financial delete rule

- **No hard delete of posted financial transactions.** No DELETE endpoint for posted history.
  Use cancel/reverse/archive. `trg_vouchers_stock_cleanup` exists only for the pre-posting
  draft edge case; audit history must always remain.

## Invoice numbering

- Configurable prefix + sequence, e.g. `INV-2026-00001`, branch-scoped `DL-INV-00001`.
- Uniqueness guaranteed under concurrency at DB level. Now: `fn_next_voucher_number` uses
  PostgreSQL advisory locks; `trg_vouchers_number` assigns on insert.

## Payments (roadmap)

- Instruments: cash, bank, UPI, card, cheque, NEFT, RTGS, IMPS, other.
- States: unpaid, partially paid, paid, overpaid. Overpayments become customer credit/advance
  via controlled logic.

## Outstanding calculation

- Customer outstanding = invoice total − payments − credit notes.
- Supplier payable = purchase total − payments − debit notes.
- Balances are computed server-side (now: `fn_ledger_balance`, view sums); never trust
  client-side totals as authoritative.

## GST engine

- Independent domain module (now: `src/lib/gst.ts` / `mobile/lib/src/gst.dart`, `tax_masters`,
  GSTR views). Supports CGST, SGST, IGST, UTGST; rates; HSN/SAC; taxable value; tax
  calculation (2-dp rounding, intra → CGST+SGST, inter → IGST) and summaries.
- Reusable by sales, purchase, credit/debit notes, reports, e-invoice. Never hard-code GST
  math inside UI components.

## GSTIN

- Validate format; extract state code; detect duplicates; store verification status separately
  from the raw identifier. Live verification only via an authorized integration layer — never
  scrape GST portals.

## E-Invoice / E-Way Bill (roadmap)

- Adapter/interface architecture (`GSTIntegrationProvider`) — never couple accounting to one
  provider. Provider credentials never reach frontend clients. E-way bill flow: invoice →
  eligibility → transport details → provider → EWB number (vehicle update, cancellation,
  extension, history, error handling later).

## WhatsApp (roadmap)

- Official WhatsApp Business Platform/API only — no unofficial automation.
- Uses async jobs (event → queue → service → provider → webhook → status).
- Statuses: PENDING, PROCESSING, SENT, DELIVERED, READ, FAILED; with retry handling.

## External API failure rule

- A provider failure must not corrupt accounting. If invoice creation succeeds but the WhatsApp
  job fails, the invoice remains valid and the message becomes FAILED/RETRY_PENDING. Never roll
  back a valid financial transaction for a notification failure.

## Idempotency

- Required for: payments, webhooks, external API requests, e-invoice/e-way bill operations,
  WhatsApp jobs. Duplicate webhooks must not create duplicate financial records.

## Audit log

- Actions: LOGIN, LOGOUT, CREATE, UPDATE, ARCHIVE, POST, CANCEL, PAYMENT, REFUND,
  GST_SUBMISSION, EINVOICE_GENERATED, EWAYBILL_GENERATED, WHATSAPP_SENT, ROLE_CHANGED,
  PASSWORD_CHANGED, SETTINGS_CHANGED.
- Fields: organization_id, actor_id, action, entity_type, entity_id, timestamp, IP, user agent,
  before/after state where appropriate.
- Never log secrets, passwords, access tokens, or credentials.

## Date/time

- Server timestamps in UTC internally; display in organization/user-local time. Default
  `Asia/Kolkata`.

## Money

- Never use JS floats for authoritative money. DB `NUMERIC(18,2)`; rounding at 2 dp via a
  shared utility (`round2`). Appropriate precision for qty/tax.

## Database transactions

- Financial workflows are atomic. Posting a sale touches invoice, customer ledger, stock
  movement, GST transaction, journal, audit — all inside one transaction (`sp_post_voucher`).

## File storage (roadmap)

- Object storage for logos, invoice PDFs, attachments, import/export files. DB stores metadata
  and storage references only.

## Import/Export (roadmap)

- Import customers/suppliers/products/opening balances/opening stock/controlled transactions.
  Workflow: UPLOAD → PARSE → VALIDATE → PREVIEW → CONFIRM → IMPORT → RESULT REPORT. Never
  import unvalidated financial records directly.

## Subscriptions (roadmap)

- Plans: FREE, STARTER, BUSINESS, PRO, ENTERPRISE. States: TRIAL, ACTIVE, PAST_DUE,
  GRACE_PERIOD, SUSPENDED, CANCELLED, EXPIRED.
- Expiry must never delete customer/business data; apply feature/usage restrictions.

## Usage limits (roadmap)

- Users, organizations, branches, invoices, products, storage, WhatsApp messages, API requests.
- Tracked server-side; never rely on frontend counters.

## Feature flags

- Support flags: enable_einvoice, enable_ewaybill, enable_whatsapp, enable_multi_branch,
  enable_manufacturing, enable_mobile_app. Beta features must not appear as production
  functionality. Current values in `product.config.json`.

## API error contract

```json
{
  "success": false,
  "error": { "code": "INVOICE_VALIDATION_FAILED", "message": "Invoice could not be created", "details": [] },
  "requestId": "request-id"
}
```

Never expose raw stack traces to customers.

## API versioning

- `api/v1/…` current; breaking changes go to `api/v2/…`. No undocumented breaking changes.

## Security baseline

HTTPS, secure auth, password hashing, session/JWT + refresh protection, RBAC, tenant
isolation, rate limiting, input validation, SQL-injection/XSS/CSRF protections, CORS, secure
cookies, secret management, webhook signature verification, audit logging, backup + restore
testing. Frontend never receives DB credentials, API secrets, JWT signing secrets, WhatsApp/GST
provider credentials, or payment secrets. See [TENANT_SECURITY_RULES.md](TENANT_SECURITY_RULES.md).

## Performance targets

- Typical API response < 500 ms; dashboard < 2 s; simple query < 100 ms; invoice creation
  ~1 s excluding external provider latency. These are engineering targets, not guarantees;
  use profiling, not guessing.

## Financial safety

Accounting integrity > security > data integrity > business rules > API consistency > UI
convenience. Never sacrifice financial correctness for a faster UI.