# Product Definition

> Source of truth: **[Chapter 1 — Product Definition & Business Rules]**.
> Machine-readable mirror: [`../product.config.json`](../product.config.json).

## 1. Identity

| Field | Value |
|---|---|
| Product name | **BizKhata** |
| Internal codename | CloudLedger (working name used by the original brief) |
| Category | Cloud-based Accounting + Billing + GST + Inventory + Business Management SaaS for India |
| Currency | INR / ₹ |
| Default timezone | Asia/Kolkata |
| Default financial year | 1 April – 31 March |
| Primary platform | Responsive Web Application (Next.js) |
| Companion platform | Android / iOS (Flutter — `../mobile/`) |
| Future platforms | Public API |

Target market: Indian retailers, wholesalers, distributors, service businesses, small and
medium businesses, accountants, CA firms, multi-branch businesses, and future manufacturers.

## 2. Product objective

A cloud-first SaaS where a business can ultimately:

1. Register
2. Create an organization (company)
3. Configure company details
4. Configure GST and financial year
5. Add customers · suppliers · products · warehouses
6. Create purchase and sales invoices
7. Manage inventory · record payments · maintain ledgers
8. Generate accounting, GST, and ledger reports
9. Generate invoice PDFs and send invoices via WhatsApp
10. Manage users/permissions and subscription & billing

Future architecture must support: E-Invoice, E-Way Bill, GSTR workflows, GSTR-2B
reconciliation, multi-company/multi-branch/multi-GSTIN, manufacturing, payroll, mobile app,
public API, and AI features.

## 3. Non-negotiable architecture principles

- **Multi-tenant** — every organization-owned record carries an organization scope; every query enforces it (see [`TENANT_SECURITY_RULES.md`](TENANT_SECURITY_RULES.md)).
- **API-first** — business rules live in the backend (PostgreSQL functions / RPC + PostgREST), never duplicated in UI. Mobile consumes the same backend.
- **Modular** — accounting, inventory, GST, and notifications are distinct domains with seam boundaries.
- **Secure / scalable / testable / maintainable / cloud-ready / mobile-ready / audit-friendly.**

Never build the application as a collection of disconnected CRUD screens. All modules
integrate with the accounting, inventory, permissions, and audit systems.

## 4. Configuration source of truth

`product.config.json` is the machine-readable product specification:

- Modules and their build status
- The 21-phase implementation roadmap
- Role model + permission catalog
- Feature flags
- Subscription plans and states
- GST configuration
- Error contract
- Audit actions and idempotent operations

Do not add features to code without updating `product.config.json` and the relevant docs.

## 5. Current module state (Chapter 1 baseline)

| Module | Status | Where |
|---|---|---|
| Authentication (email/password, Google OAuth, SSR sessions) | Done | `src/lib/supabase/`, `src/app/auth/` |
| Organizations/companies + owner/admin/accountant/viewer members | Done | `companies`, `company_members`, `sp_create_company` |
| Financial years | Done | `financial_years`, `fn_current_fy` |
| Chart of Accounts (groups + ledgers) | Done | `account_groups`, `ledgers` |
| Double-entry vouchers (receipt/payment/journal/contra/sales/purchase/credit_note/debit_note/opening_balance) | Done | `vouchers`, `voucher_entries`, `sp_post_voucher`, `sp_cancel_voucher` |
| Items & Inventory (units, categories, batches, stock ledger/balances) | Partial (products roadmap later) | `items`, `batches`, `stock_ledger`, `stock_balances` |
| Sales/Purchase GST billing (CGST/SGST/IGST) | Done | `billing/*`, `src/lib/gst.ts`, `tax_masters` |
| Reports (trial balance, day book, ledger statement, P&L, balance sheet, GSTR-1, GSTR-3B, stock book) | Done (web exports/PDFs later) | `v_*` views, report functions |
| Customers/Suppliers as first-class entities | Planned | Future chapter |
| Branches / Warehouses | Planned | Future chapter |
| Granular users/roles/permissions | Partial (4 roles) | `company_members.role` |
| Subscriptions / usage limits | Planned | Future chapter |
| Platform admin panel | Planned | Future chapter |
| E-Invoice / E-Way Bill / WhatsApp integrations | Planned (adapter contracts) | `ARCHITECTURE_PRINCIPLES.md` |
| Audit log | Planned | `BUSINESS_RULES.md` §Audit |

## 6. Phased roadmap

The canonical roadmap lives in `product.config.json` `phases[]` (§50 of the brief):

0. Repository analysis — **Chapter 1 (this)**
1. Project foundation — **Chapter 1**
2. Database foundation · 3. Authentication · 4. Organizations · 5. Users/Roles/Permissions ·
6. Customers/Suppliers · 7. Products/Inventory · 8. Sales · 9. Purchase · 10. Accounting ·
11. Reports · 12. GST · 13. E-Invoice · 14. E-Way Bill · 15. WhatsApp · 16. Payments ·
17. Subscriptions · 18. Admin · 19. Security audit · 20. Performance · 21. Production deployment.

Each phase ships against a complete [Definition of Done](DEFINITION_OF_DONE.md). Nothing is
"done" when it is only mocked, stubbed, or TODO-only.

## 7. Non-goals (for now)

- Manufacturing / payroll modules (roadmap only)
- Public API beyond PostgREST (roadmap only)
- Provider integrations before their adapter contracts and permission model exist