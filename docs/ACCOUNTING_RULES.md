# Accounting Rules

Authoritative rules for the accounting engine. Financial integrity outranks UI convenience
(see `BUSINESS_RULES.md` → Financial safety).

## 1. Double-entry invariant

Every posted transaction obeys **total debit == total credit**.

- DB trigger `trg_voucher_entries_balance` rejects unbalanced insert/update/delete on
  `voucher_entries`.
- `sp_post_voucher` re-validates balance and wraps voucher + entries + items in one transaction.

Example (payment ₹10,000):
```
Debit   Cash/Bank              ₹10,000
Credit  Customer Receivable    ₹10,000
```

## 2. Chart of accounts

Root groups (enum `account_group_type`): assets, liabilities, income, expense (+ equity — group
only, roadmap). Defaults seeded by `sp_seed_defaults`:

Assets → Cash in Hand, Bank Account, Sundry Debtors; Liabilities → Sundry Creditors, GST
Liabilities (CGST/SGST/IGST Output); Income → Sales A/c; Expenses → Purchase A/c, CGST/SGST/IGST
Input; Equity → Capital.

Users may create groups/ledgers; system integrity (balance checks, posting rules) is not
negotiable.

## 3. Voucher lifecycle

`voucher_status` enum: `draft`, `posted`, `cancelled`.

- Posting: `sp_post_voucher` (also carries sales/purchase + GST items and stock effects).
- Cancellation: `sp_cancel_voucher` sets status `cancelled` (entries retained), re-runs stock
  resync for affected items.
- Posted records are **not freely editable**. Changes use cancel/reverse/credit/debit note
  mechanisms (credit/debit notes exist as voucher types).

## 4. Delete rule

- **Never hard-delete posted financial history.**
- No normal DELETE path exists for posted vouchers; `trg_vouchers_stock_cleanup` handles only
  the draft (never-posted) case.
- Soft-delete/archive preferred for master data (customers, suppliers, ledgers), preserving
  auditability.

## 5. Sequencing / numbering

- Numbers are allocated by DB with advisory locking (`fn_next_voucher_number`), stored via
  `trg_vouchers_number`. No client-supplied "next number" is ever authoritative.
- Generalized per-branch/per-series prefixes are a later-phase migration; uniqueness and
  concurrency-safety must remain at DB level.

## 6. Financial years

- Every transaction belongs to an FY (`vouchers.fy_id`). Active FY resolved via `fn_current_fy`.
- Posting outside the active period is blocked by policy; controlled admin unlock is roadmap.
- FY `locked` flag exists in `financial_years` for future lock workflows.

## 7. Money & tax

- Money stored `NUMERIC(18,2)`; rounding at 2 dp via shared `round2` (web `src/lib/gst.ts`,
  mobile `mobile/lib/src/gst.dart` — mirrored, same unit tests).
- GST engine is an independent module (`src/lib/gst.ts`, `tax_masters`, GSTR views); intra →
  CGST+SGST, inter → IGST, rate set {0, 0.25, 3, 5, 12, 18, 28}, HSN/SAC support.
- Tax ledger mapping (output/input) at master level, resolved by name convention in
  `fetchBillingLedgers`; move to explicit `tax_masters` ledger links as GST chapter lands.

## 8. Outstanding & balances

- Balances/outstanding are server-computed (`fn_ledger_balance`, list views, report functions).
  Client-side totals are display-only and never authoritative.
- Outstanding model (roadmap): invoice total − payments − credit notes / purchase total −
  payments − debit notes; overpayments → customer advance/credit.

## 9. Stock interplay

- Stock movement records underpin balances (`stock_ledger` with running balance; `stock_balances`
  as fast current-state). Direct writes to `stock_balances` are bypassed by design; resync
  (`fn_resync_stock`) rebuilds both consistently.
- Posting a sales/purchase voucher adjusts stock and accounting in the same transaction.

## 10. Financial test obligations

See `DEVELOPMENT_RULES.md` — tests must cover: balancing, tax rounding, outstanding, stock
movement, invoice totals, cancel semantics (entries retained, totals unchanged).