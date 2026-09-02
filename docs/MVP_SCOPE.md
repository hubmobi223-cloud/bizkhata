# MVP Scope — BizKhata

## Overview

MVP delivers the core accounting + billing + inventory foundation for Indian businesses. It targets sole proprietors, small retailers, and service providers who need basic invoicing, GST compliance, ledger accounting, and inventory tracking — nothing more. The goal is a production-deployable product within the first release, with every feature fully functional end-to-end.

---

## MVP Features

### Authentication & Organization

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| AUTH-001 | User Registration | Email + password signup with email verification OTP | Public |
| AUTH-002 | User Login | Email/password login with JWT session tokens | Public |
| AUTH-003 | Password Reset | Email-based password reset flow | Public |
| AUTH-004 | Logout | Token invalidation, session cleanup | All authenticated |
| AUTH-005 | Profile Management | View/update name, email, phone | All authenticated |

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| ORG-001 | Create Organization | First user becomes owner; sets org name, GSTIN, PAN, address, state, financial year | Public (becomes owner) |
| ORG-002 | Organization Settings | View/update org profile, fiscal year, currency, tax settings | owner, admin |
| ORG-003 | Subscription Foundation | Free tier limits enforced (1 user, 50 invoices/month); plan display only — no payment gateway | owner, admin |

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| USER-001 | Invite User | Send email invite with role assignment | owner, admin |
| USER-002 | List Users | View all users in organization | owner, admin |
| USER-003 | Update User Role | Change role of existing user | owner |
| USER-004 | Remove User | Deactivate user from organization | owner |
| USER-005 | Accept Invite | Complete registration via invite link | Public (invite link) |

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| ROLE-001 | Built-in Roles | Predefined roles: owner, admin, accountant, sales_user, purchase_manager, inventory_manager, viewer | System |
| ROLE-002 | Role Assignment | Assign one of the built-in roles to each user | owner, admin |
| ROLE-003 | Permission Checking | Server-side fn_has_access for every protected endpoint | System |

### Core Business

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| CUST-001 | Create Customer | Name, GSTIN, PAN, address, state, email, phone, opening balance | All except viewer |
| CUST-002 | List/Search Customers | Paginated list with search by name/GSTIN/phone | All except viewer |
| CUST-003 | Customer Details | View profile, outstanding balance, transaction history | All except viewer |
| CUST-004 | Edit Customer | Update customer details | All except viewer |
| CUST-005 | Customer Ledger | View all transactions for a customer | All except viewer |

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| SUPP-001 | Create Supplier | Name, GSTIN, PAN, address, state, email, phone, opening balance | All except viewer |
| SUPP-002 | List/Search Suppliers | Paginated list with search by name/GSTIN/phone | All except viewer |
| SUPP-003 | Supplier Details | View profile, outstanding balance, transaction history | All except viewer |
| SUPP-004 | Edit Supplier | Update supplier details | All except viewer |
| SUPP-005 | Supplier Ledger | View all transactions for a supplier | All except viewer |

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| PROD-001 | Create Product | Name, SKU, HSN/SAC, unit, GST rate, sale price, purchase price, opening stock | All except viewer |
| PROD-002 | List/Search Products | Paginated list with search by name/SKU/HSN | All except viewer |
| PROD-003 | Product Details | View profile, stock levels, transaction history | All except viewer |
| PROD-004 | Edit Product | Update product details (price changes do not affect posted invoices) | All except viewer |
| PROD-005 | Product Categories | Basic category assignment (flat, no hierarchy) | All except viewer |

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| WH-001 | Default Warehouse | Auto-created on org setup; single warehouse in MVP | System |
| WH-002 | Create Warehouse | Name, address, is_active flag | owner, admin, inventory_manager |
| WH-003 | List Warehouses | View all warehouses | All except viewer |
| WH-004 | Stock Balances | View current stock per product per warehouse | All except viewer |
| WH-005 | Stock Adjustments | Manual stock adjustment with reason (positive/negative) | owner, admin, inventory_manager |

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| STK-001 | Stock Ledger | Append-only log of all stock movements | System |
| STK-002 | Stock Balances Table | Current stock per product per warehouse (materialized) | System |
| STK-003 | Resync Stock | fn_resync_stock recalculate from ledger | System (admin trigger) |
| STK-004 | Negative Stock Control | Org setting to allow/prevent negative stock | owner, admin |

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| INV-001 | Create Sales Invoice | Customer, items, quantities, rates, discounts, GST, totals; auto-calculate | All except viewer, inventory_manager |
| INV-002 | List Sales Invoices | Paginated, filterable by date/status/customer | All except viewer |
| INV-003 | View Sales Invoice | Full invoice detail with line items, tax breakdown | All except viewer |
| INV-004 | Edit Draft Invoice | Modify draft invoices only | Creator, admin, accountant |
| INV-005 | Post Sales Invoice | Finalize invoice; creates ledger entries + stock movement | Creator, admin, accountant |
| INV-006 | Cancel Sales Invoice | Cancel posted invoice; reverse ledger entries + stock | Creator, admin, accountant |
| INV-007 | Sales Invoice PDF | Generate PDF with GST breakdown, terms, org branding | All except viewer |
| INV-008 | Create Purchase Invoice | Supplier, items, quantities, rates, discounts, GST, totals | All except viewer, sales_user |
| INV-009 | List Purchase Invoices | Paginated, filterable by date/status/supplier | All except viewer |
| INV-010 | View Purchase Invoice | Full invoice detail with line items, tax breakdown | All except viewer |
| INV-011 | Edit Draft Purchase Invoice | Modify draft invoices only | Creator, admin, accountant |
| INV-012 | Post Purchase Invoice | Finalize invoice; creates ledger entries + stock movement | Creator, admin, accountant |
| INV-013 | Cancel Purchase Invoice | Cancel posted invoice; reverse ledger entries + stock | Creator, admin, accountant |
| INV-014 | Purchase Invoice PDF | Generate PDF with GST breakdown, terms, org branding | All except viewer |

### Accounting & Payments

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| ACC-001 | Chart of Accounts | Predefined Indian chart (assets, liabilities, equity, income, expense) with GST heads | System |
| ACC-002 | Ledger Entries | Double-entry bookkeeping — every transaction posts debits + credits | System |
| ACC-003 | General Ledger | View all ledger entries with date, account, debit, credit, balance | All except viewer |
| ACC-004 | Trial Balance | Period-wise trial balance report | All except viewer |
| ACC-005 | Account Groups | Group accounts by type (Current Assets, Fixed Assets, etc.) | System |
| ACC-006 | Balance Sheet | Period-wise balance sheet | All except viewer |
| ACC-007 | Profit & Loss | Period-wise P&L statement | All except viewer |

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| PAY-001 | Record Payment Received | From customer against invoice(s) | All except viewer |
| PAY-002 | Record Payment Made | To supplier against invoice(s) | All except viewer |
| PAY-003 | List Payments | Paginated, filterable by date/type/party | All except viewer |
| PAY-004 | Payment Details | View payment record with linked invoices | All except viewer |
| PAY-005 | Outstanding Summary | Customer/supplier outstanding balances | All except viewer |
| PAY-006 | Outstanding Aging | 30/60/90/120+ day aging buckets | All except viewer |

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| GST-001 | GST Rate Setup | Configure GST rates per product (0%, 5%, 12%, 18%, 28%) | All except viewer |
| GST-002 | Intra/Inter State Detection | Auto-detect CGST+SGST vs IGST based on supplier/customer states | System |
| GST-003 | GST Summary Report | Period-wise GST collected (output) and GST paid (input) | All except viewer |
| GST-004 | GSTR-1 Data | Sales invoice data formatted for GSTR-1 filing | All except viewer |
| GST-005 | GSTR-3B Data | Summary data formatted for GSTR-3B filing | All except viewer |

### Reports & Audit

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| RPT-001 | Sales Register | Period-wise sales invoices with tax breakup | All except viewer |
| RPT-002 | Purchase Register | Period-wise purchase invoices with tax breakup | All except viewer |
| RPT-003 | Day Book | All transactions for a given date | All except viewer |
| RPT-004 | Cash Book | Cash transactions only | All except viewer |
| RPT-005 | Customer Outstanding Report | Outstanding balances by customer | All except viewer |
| RPT-006 | Supplier Outstanding Report | Outstanding balances by supplier | All except viewer |
| RPT-007 | Stock Summary Report | Current stock levels across warehouses | All except viewer |
| RPT-008 | Stock Movement Report | Stock in/out history per product | All except viewer |
| RPT-009 | GST Report | GST liability for a period | All except viewer |
| RPT-010 | Profit & Loss Report | Revenue, expenses, net profit for a period | All except viewer |

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| AUD-001 | Audit Log | Every write operation logged with user, timestamp, before/after | System |
| AUD-002 | Audit Log Viewer | View audit trail for any entity | owner, admin, accountant |
| AUD-003 | Financial Audit Trail | Linked entries: invoice → ledger → payment chain | All except viewer |

### Documents & PDF

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| DOC-001 | Invoice PDF Generation | Server-side PDF with org details, GST, line items, totals | All except viewer |
| DOC-002 | Org Branding on PDF | Logo, name, address, GSTIN on every PDF | System |
| DOC-003 | Download PDF | Download generated PDF to local machine | All except viewer |
| DOC-004 | PDF Template | Standard Indian invoice template (B2B format) | System |

### Security

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| SEC-001 | JWT Authentication | Short-lived access tokens, refresh token rotation | System |
| SEC-002 | Password Hashing | bcrypt with salt rounds | System |
| SEC-003 | Rate Limiting | Login attempts, API rate limits per org | System |
| SEC-004 | CSRF Protection | CSRF tokens for form submissions | System |
| SEC-005 | Input Sanitization | XSS prevention on all inputs | System |

### Dashboard

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| DASH-001 | Overview Dashboard | Revenue, expenses, receivables, payables, top products, recent activity | All authenticated |
| DASH-002 | Sales Summary | Today, this week, this month sales | All except viewer |
| DASH-003 | Purchase Summary | Today, this week, this month purchases | All except viewer |
| DASH-004 | Outstanding Summary | Total receivables and payables | All except viewer |
| DASH-005 | Stock Alerts | Low stock products | All except viewer |

---

## MVP Database Entities

### Authentication & Users
```
organizations
├── id (uuid, PK)
├── name (text)
├── gstin (text, nullable)
├── pan (text, nullable)
├── address (jsonb)
├── state_code (text)
├── financial_year_start (date)
├── financial_year_end (date)
├── subscription_plan (text, default 'free')
├── subscription_status (text, default 'active')
├── settings (jsonb)
├── created_at (timestamptz)
└── updated_at (timestamptz)

users
├── id (uuid, PK)
├── email (text, unique)
├── password_hash (text)
├── name (text)
├── phone (text, nullable)
├── email_verified (boolean)
├── created_at (timestamptz)
└── updated_at (timestamptz)

organization_members
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── user_id (uuid, FK → users)
├── role (text: owner|admin|accountant|sales_user|purchase_manager|inventory_manager|viewer)
├── status (text: active|inactive)
├── invited_at (timestamptz)
├── joined_at (timestamptz)
└── created_at (timestamptz)

invitations
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── email (text)
├── role (text)
├── token (text, unique)
├── expires_at (timestamptz)
├── accepted_at (timestamptz, nullable)
└── created_at (timestamptz)

password_resets
├── id (uuid, PK)
├── user_id (uuid, FK → users)
├── token (text, unique)
├── expires_at (timestamptz)
├── used_at (timestamptz, nullable)
└── created_at (timestamptz)
```

### Parties (Customers & Suppliers)
```
parties
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── party_type (text: customer|supplier|both)
├── name (text)
├── gstin (text, nullable)
├── pan (text, nullable)
├── address (jsonb)
├── state_code (text)
├── email (text, nullable)
├── phone (text, nullable)
├── opening_balance (numeric, default 0)
├── opening_balance_type (text: debit|credit)
├── is_active (boolean, default true)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

### Products & Inventory
```
products
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── name (text)
├── sku (text)
├── hsn_sac_code (text)
├── unit (text: pcs|kg|ltr|mtr|box|doz|nos|other)
├── gst_rate (numeric: 0|5|12|18|28)
├── sale_price (numeric)
├── purchase_price (numeric)
├── opening_stock (numeric, default 0)
├── opening_stock_value (numeric, default 0)
├── category (text, nullable)
├── is_active (boolean, default true)
├── created_at (timestamptz)
└── updated_at (timestamptz)

warehouses
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── name (text)
├── address (jsonb, nullable)
├── is_default (boolean, default false)
├── is_active (boolean, default true)
├── created_at (timestamptz)
└── updated_at (timestamptz)

stock_ledger
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── product_id (uuid, FK → products)
├── warehouse_id (uuid, FK → warehouses)
├── reference_type (text: opening|purchase|sale|adjustment|transfer)
├── reference_id (uuid, nullable)
├── quantity (numeric) — positive for IN, negative for OUT
├── rate (numeric)
├── value (numeric)
├── balance_after (numeric)
├── created_at (timestamptz)
└── created_by (uuid, FK → users)

stock_balances
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── product_id (uuid, FK → products)
├── warehouse_id (uuid, FK → warehouses)
├── quantity (numeric, default 0)
├── value (numeric, default 0)
├── updated_at (timestamptz)
├── UNIQUE(organization_id, product_id, warehouse_id)
```

### Invoices
```
invoices
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── invoice_type (text: sale|purchase)
├── invoice_number (text)
├── party_id (uuid, FK → parties)
├── warehouse_id (uuid, FK → warehouses)
├── invoice_date (date)
├── due_date (date, nullable)
├── status (text: draft|posted|cancelled)
├── subtotal (numeric)
├── discount_amount (numeric, default 0)
├── taxable_amount (numeric)
├── cgst_amount (numeric, default 0)
├── sgst_amount (numeric, default 0)
├── igst_amount (numeric, default 0)
├── total_tax (numeric, default 0)
├── round_off (numeric, default 0)
├── total_amount (numeric)
├── amount_paid (numeric, default 0)
├── balance_amount (numeric)
├── notes (text, nullable)
├── terms (text, nullable)
├── posted_at (timestamptz, nullable)
├── cancelled_at (timestamptz, nullable)
├── cancel_reason (text, nullable)
├── created_by (uuid, FK → users)
├── created_at (timestamptz)
└── updated_at (timestamptz)
├── UNIQUE(organization_id, invoice_type, invoice_number)

invoice_items
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── invoice_id (uuid, FK → invoices)
├── product_id (uuid, FK → products)
├── description (text, nullable)
├── quantity (numeric)
├── unit (text)
├── rate (numeric)
├── discount_percent (numeric, default 0)
├── discount_amount (numeric, default 0)
├── taxable_amount (numeric)
├── gst_rate (numeric)
├── cgst_amount (numeric, default 0)
├── sgst_amount (numeric, default 0)
├── igst_amount (numeric, default 0)
├── total_amount (numeric)
├── stock_quantity (numeric) — quantity at time of posting
└── created_at (timestamptz)
```

### Accounting
```
accounts
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── account_code (text)
├── name (text)
├── account_type (text: asset|liability|equity|income|expense)
├── account_group (text)
├── parent_id (uuid, FK → accounts, nullable)
├── is_system (boolean, default false)
├── opening_balance (numeric, default 0)
├── is_active (boolean, default true)
├── created_at (timestamptz)
└── updated_at (timestamptz)
├── UNIQUE(organization_id, account_code)

ledger_entries
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── entry_date (date)
├── account_id (uuid, FK → accounts)
├── debit (numeric, default 0)
├── credit (numeric, default 0)
├── balance (numeric) — running balance
├── reference_type (text: invoice|payment|journal|opening)
├── reference_id (uuid, nullable)
├── description (text)
├── created_at (timestamptz)
└── created_by (uuid, FK → users)
```

### Payments
```
payments
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── payment_type (text: receipt|payment) — receipt = received from customer, payment = paid to supplier
├── payment_number (text)
├── party_id (uuid, FK → parties)
├── payment_date (date)
├── amount (numeric)
├── payment_mode (text: cash|bank|upi|cheque|other)
├── reference_number (text, nullable) — cheque number, UPI ref, etc.
├── bank_account_id (uuid, FK → accounts, nullable)
├── notes (text, nullable)
├── status (text: completed|cancelled)
├── created_by (uuid, FK → users)
├── created_at (timestamptz)
└── updated_at (timestamptz)
├── UNIQUE(organization_id, payment_type, payment_number)

payment_allocations
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── payment_id (uuid, FK → payments)
├── invoice_id (uuid, FK → invoices)
├── amount_allocated (numeric)
└── created_at (timestamptz)
```

### Documents & Audit
```
documents
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── entity_type (text: invoice|payment|party|product)
├── entity_id (uuid)
├── document_type (text: pdf|attachment)
├── file_path (text)
├── file_name (text)
├── file_size (integer)
├── mime_type (text)
├── created_by (uuid, FK → users)
└── created_at (timestamptz)

audit_logs
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── user_id (uuid, FK → users)
├── action (text: create|update|delete)
├── entity_type (text)
├── entity_id (uuid)
├── before_data (jsonb, nullable)
├── after_data (jsonb, nullable)
├── ip_address (text, nullable)
├── user_agent (text, nullable)
└── created_at (timestamptz)
```

### Settings
```
org_settings
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations, unique)
├── default_warehouse_id (uuid, FK → warehouses)
├── allow_negative_stock (boolean, default false)
├── default_payment_terms_days (integer, default 30)
├── invoice_prefix_sale (text, default 'INV-')
├── invoice_prefix_purchase (text, default 'PINV-')
├── next_invoice_number_sale (integer, default 1)
├── next_invoice_number_purchase (integer, default 1)
├── next_payment_number_receipt (integer, default 1)
├── next_payment_number_payment (integer, default 1)
├── gst_state_code (text)
├── default_gst_rate (numeric, default 18)
├── financial_year_start (date)
├── financial_year_end (date)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

**Total MVP Tables: 19**

---

## MVP API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/verify-email
GET    /api/auth/me
```

### Organizations
```
POST   /api/organizations
GET    /api/organizations/:id
PUT    /api/organizations/:id
GET    /api/organizations/:id/settings
PUT    /api/organizations/:id/settings
```

### Users
```
POST   /api/organizations/:orgId/users/invite
GET    /api/organizations/:orgId/users
PUT    /api/organizations/:orgId/users/:userId/role
DELETE /api/organizations/:orgId/users/:userId
POST   /api/invitations/:token/accept
GET    /api/users/me
PUT    /api/users/me
```

### Parties (Customers & Suppliers)
```
POST   /api/organizations/:orgId/parties
GET    /api/organizations/:orgId/parties
GET    /api/organizations/:orgId/parties/:id
PUT    /api/organizations/:orgId/parties/:id
DELETE /api/organizations/:orgId/parties/:id (soft delete)
GET    /api/organizations/:orgId/parties/:id/ledger
GET    /api/organizations/:orgId/parties/:id/outstanding
```

### Products
```
POST   /api/organizations/:orgId/products
GET    /api/organizations/:orgId/products
GET    /api/organizations/:orgId/products/:id
PUT    /api/organizations/:orgId/products/:id
DELETE /api/organizations/:orgId/products/:id (soft delete)
```

### Warehouses & Stock
```
POST   /api/organizations/:orgId/warehouses
GET    /api/organizations/:orgId/warehouses
PUT    /api/organizations/:orgId/warehouses/:id
GET    /api/organizations/:orgId/stock/balances
GET    /api/organizations/:orgId/stock/ledger
POST   /api/organizations/:orgId/stock/adjustments
GET    /api/organizations/:orgId/stock/summary
```

### Invoices
```
POST   /api/organizations/:orgId/invoices
GET    /api/organizations/:orgId/invoices
GET    /api/organizations/:orgId/invoices/:id
PUT    /api/organizations/:orgId/invoices/:id
POST   /api/organizations/:orgId/invoices/:id/post
POST   /api/organizations/:orgId/invoices/:id/cancel
GET    /api/organizations/:orgId/invoices/:id/pdf
GET    /api/organizations/:orgId/invoices/:id/preview
```

### Payments
```
POST   /api/organizations/:orgId/payments
GET    /api/organizations/:orgId/payments
GET    /api/organizations/:orgId/payments/:id
PUT    /api/organizations/:orgId/payments/:id
POST   /api/organizations/:orgId/payments/:id/cancel
GET    /api/organizations/:orgId/payments/outstanding
```

### Accounting
```
GET    /api/organizations/:orgId/accounts
GET    /api/organizations/:orgId/ledger
GET    /api/organizations/:orgId/trial-balance
GET    /api/organizations/:orgId/balance-sheet
GET    /api/organizations/:orgId/profit-loss
```

### GST
```
GET    /api/organizations/:orgId/gst/summary
GET    /api/organizations/:orgId/gst/gstr1
GET    /api/organizations/:orgId/gst/gstr3b
```

### Reports
```
GET    /api/organizations/:orgId/reports/sales-register
GET    /api/organizations/:orgId/reports/purchase-register
GET    /api/organizations/:orgId/reports/day-book
GET    /api/organizations/:orgId/reports/cash-book
GET    /api/organizations/:orgId/reports/customer-outstanding
GET    /api/organizations/:orgId/reports/supplier-outstanding
GET    /api/organizations/:orgId/reports/stock-summary
GET    /api/organizations/:orgId/reports/stock-movement
GET    /api/organizations/:orgId/reports/profit-loss
```

### Dashboard
```
GET    /api/organizations/:orgId/dashboard/overview
GET    /api/organizations/:orgId/dashboard/sales-summary
GET    /api/organizations/:orgId/dashboard/purchase-summary
GET    /api/organizations/:orgId/dashboard/outstanding-summary
GET    /api/organizations/:orgId/dashboard/stock-alerts
```

### Audit
```
GET    /api/organizations/:orgId/audit-logs
GET    /api/organizations/:orgId/audit-logs/:entityType/:entityId
```

### Documents
```
GET    /api/organizations/:orgId/documents/:entityType/:entityId
POST   /api/organizations/:orgId/documents/:entityType/:entityId/upload
DELETE /api/organizations/:orgId/documents/:documentId
```

### Settings
```
GET    /api/organizations/:orgId/settings
PUT    /api/organizations/:orgId/settings
```

**Total MVP API Endpoints: ~65**

---

## MVP UI Screens

### Authentication & Onboarding
1. Login page
2. Register page
3. Forgot password page
4. Reset password page
5. Email verification page
6. Onboarding wizard (create org, set details, add first products)

### Dashboard
7. Main dashboard (overview cards, charts, recent activity)
8. Sales summary widget
9. Purchase summary widget
10. Outstanding summary widget
11. Stock alerts widget

### Parties
12. Customer list (searchable, filterable table)
13. Customer create/edit form
14. Customer detail view (profile, ledger, outstanding)
15. Supplier list (searchable, filterable table)
16. Supplier create/edit form
17. Supplier detail view (profile, ledger, outstanding)

### Products
18. Product list (searchable, filterable table)
19. Product create/edit form
20. Product detail view (profile, stock levels)

### Inventory
21. Stock balance view (per warehouse)
22. Stock adjustment form
23. Stock ledger view (per product)
24. Warehouse list
25. Warehouse create/edit form

### Sales
26. Sales invoice list (filterable by date/status/customer)
27. Sales invoice create/edit form (with line items, GST auto-calc)
28. Sales invoice detail view (posted invoice, read-only)
29. Sales invoice PDF preview/download

### Purchase
30. Purchase invoice list (filterable by date/status/supplier)
31. Purchase invoice create/edit form (with line items, GST auto-calc)
32. Purchase invoice detail view (posted invoice, read-only)
33. Purchase invoice PDF preview/download

### Payments
34. Payment list (receipts + payments)
35. Record payment received form (with invoice allocation)
36. Record payment made form (with invoice allocation)
37. Payment detail view
38. Outstanding aging view

### Accounting
39. Chart of accounts view
40. General ledger view (with filters)
41. Trial balance report
42. Balance sheet report
43. Profit & loss report

### GST
44. GST summary report
45. GSTR-1 data view
46. GSTR-3B data view

### Reports
47. Sales register
48. Purchase register
49. Day book
50. Cash book
51. Customer outstanding report
52. Supplier outstanding report
53. Stock summary report
54. Stock movement report

### Settings
55. Organization profile settings
56. Financial year settings
57. Invoice settings (prefixes, terms, defaults)
58. GST settings
59. User management (list, invite, roles)
60. Audit log viewer

### Navigation & Layout
61. Sidebar navigation
62. Top bar (user menu, org selector, notifications)
63. Responsive mobile navigation

**Total MVP UI Screens: 63**

---

## MVP is NOT including (Deferred to V1)

| Category | Deferred Features |
|----------|-------------------|
| E-Invoice | IRP integration, IRN generation, QR code on invoice |
| E-Way Bill | E-Way Bill generation, transport details, multi-vehicle |
| WhatsApp | WhatsApp Business API integration, message templates |
| Email Automation | Email sending, email templates, bulk email |
| Import/Export | CSV/Excel import, bulk operations, data export |
| Advanced Inventory | Batch tracking, expiry tracking, FIFO/LIFO, multi-warehouse transfers |
| Approval Workflows | Multi-level approvals for invoices, payments |
| Multiple Branches | Complex branch hierarchy, inter-branch transfers, consolidated reports |
| Advanced Permissions | Custom role creation, granular permission matrix, IP restrictions |
| Subscription Billing | Payment gateway integration, automatic billing, plan upgrades/downgrades |
| Documents | File attachments, document management beyond PDF |
| Mobile | Native mobile apps, offline support |
| API | Public API, API keys, rate limiting per key |
| Background Jobs | Async job processing, scheduled jobs, job monitoring |
| Advanced Reports | Custom report builder, export to Excel, scheduled reports |
| Search | Full-text search, advanced filters across modules |
| Security | 2FA/MFA, SSO, IP whitelisting, session management |
| Settings | Company-level customization, multi-currency, custom fields |

---

## MVP Dependencies

### External Services

| Service | Purpose | Required for MVP |
|---------|---------|------------------|
| **Supabase** | Database (PostgreSQL), Auth, Realtime, Storage | Yes |
| **Vercel** | Hosting, Edge Functions, Cron Jobs | Yes |
| **Resend** | Transactional emails (verification, password reset, invitations) | Yes |
| **React-PDF** | Server-side PDF generation | Yes |
| **Stripe** | Payment processing (NOT in MVP — deferred to V1) | No |

### Internal Dependencies

| Dependency | Purpose |
|------------|---------|
| `@bizkhata/shared` | Shared types, utilities, constants (GST rates, account codes, validation schemas) |
| `@bizkhata/ui` | Shared UI component library (shadcn/ui based) |
| `@bizkhata/db` | Database schema, migrations, RLS policies |

### Third-Party Libraries

| Library | Purpose |
|---------|---------|
| Next.js 14+ | React framework, App Router, Server Components |
| Supabase JS | Database client, auth, storage |
| Zod | Runtime validation |
| React Hook Form | Form management |
| TanStack Table | Data table rendering |
| Chart.js / Recharts | Dashboard charts |
| date-fns | Date formatting and manipulation |
| num-words | Number to words (for invoice PDF) |

---

## MVP Success Criteria

1. **Functional Completeness**: Every feature listed above works end-to-end with no TODOs or stubs
2. **Data Integrity**: All financial calculations are correct to 2 decimal places
3. **GST Compliance**: Intra-state CGST+SGST, inter-state IGST calculated correctly
4. **Audit Trail**: Every write operation is logged and viewable
5. **Performance**: Page load < 2s, API response < 500ms for p95
6. **Responsive**: Works on desktop (1280px+) and tablet (768px+)
7. **Zero Critical Bugs**: No data loss, no financial calculation errors, no security vulnerabilities
8. **Deployable**: Successfully deployed to Vercel with Supabase backend
