# V1 Scope — BizKhata

## Overview

V1 is the full-featured release that builds on the MVP foundation. It adds the compliance automation (E-Invoice, E-Way Bill), communication integrations (WhatsApp, Email), operational efficiency tools (Import/Export, Approval Workflows), and multi-branch support that Indian businesses expect from a production accounting system. V1 is targeted at growing businesses with 5-50 employees across multiple locations.

---

## V1 Features (New in V1 — building on MVP)

### E-Invoice Integration

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| EI-001 | IRP Connection | Connect to Invoice Registration Portal (IRP) via adapter pattern | owner, admin, accountant |
| EI-002 | IRN Generation | Auto-generate IRN on invoice posting | System |
| EI-003 | QR Code on Invoice | Embed IRP-issued QR code in invoice PDF | System |
| EI-004 | E-Invoice Status Tracking | Track IRN status (generated, cancelled, failed) | All except viewer |
| EI-005 | E-Invoice Cancellation | Cancel IRN within 24 hours of generation | owner, admin, accountant |
| EI-006 | E-Invoice Retry | Retry failed IRN generation with exponential backoff | System |
| EI-007 | E-Invoice Cancel Invoice | Cancel E-Invoice and regenerate for corrections | owner, admin, accountant |
| EI-008 | E-Invoice Bulk Generation | Generate IRNs for multiple invoices in batch | owner, admin, accountant |
| EI-009 | E-Invoice Validation | Validate invoice data before IRP submission | System |

### E-Way Bill Integration

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| EWB-001 | E-Way Bill Generation | Generate E-Way Bill for goods movement > ₹50,000 | owner, admin, accountant |
| EWB-002 | Transport Details | Vehicle number, transporter ID, distance | owner, admin, accountant, inventory_manager |
| EWB-003 | E-Way Bill Status | Track E-Way Bill status (active, expired, cancelled) | All except viewer |
| EWB-004 | Multi-Vehicle E-Way Bill | Split consignment across multiple vehicles | owner, admin, accountant |
| EWB-005 | E-Way Bill Update | Update vehicle details for in-transit goods | owner, admin, accountant |
| EWB-006 | Auto E-Way Bill | Auto-generate E-Way Bill on sales invoice posting (if threshold exceeded) | System |
| EWB-007 | E-Way Bill Expiry Alert | Alert before E-Way Bill expiry (24 hours) | System |

### WhatsApp Integration

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| WA-001 | WhatsApp Business Setup | Connect WhatsApp Business API account | owner, admin |
| WA-002 | Send Invoice via WhatsApp | Share invoice PDF link via WhatsApp to customer | All except viewer |
| WA-003 | Send Payment Reminder | Automated payment reminder via WhatsApp | System (triggered by scheduler) |
| WA-004 | Send Payment Receipt | Share payment receipt via WhatsApp | All except viewer |
| WA-005 | WhatsApp Templates | Manage message templates for different scenarios | owner, admin |
| WA-006 | WhatsApp Delivery Status | Track message delivery and read status | All except viewer |
| WA-007 | WhatsApp Opt-out Management | Respect customer opt-out preferences | System |

### Email Automation

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| EML-001 | Email Templates | Pre-built templates for invoices, receipts, reminders | owner, admin |
| EML-002 | Send Invoice via Email | Auto-send invoice PDF on posting (configurable) | All except viewer |
| EML-003 | Send Payment Receipt via Email | Auto-send receipt on payment recording | All except viewer |
| EML-004 | Payment Reminder Emails | Scheduled payment reminder emails | System |
| EML-005 | Email Campaigns | Bulk email to customer/supplier segments | owner, admin, accountant |
| EML-006 | Email Analytics | Open rate, click rate tracking | All except viewer |
| EML-007 | Email Scheduling | Schedule emails for future delivery | All except viewer |

### Import/Export

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| IMP-001 | Import Customers | CSV/Excel import with validation and duplicate detection | owner, admin |
| IMP-002 | Import Suppliers | CSV/Excel import with validation and duplicate detection | owner, admin |
| IMP-003 | Import Products | CSV/Excel import with validation and HSN mapping | owner, admin |
| IMP-004 | Import Opening Balances | Import opening balances for parties and stock | owner, admin |
| IMP-005 | Import Bank Statements | Import bank statement CSV for reconciliation | owner, admin, accountant |
| EXP-001 | Export Customers | Export customer list to CSV/Excel | owner, admin |
| EXP-002 | Export Suppliers | Export supplier list to CSV/Excel | owner, admin |
| EXP-003 | Export Products | Export product list to CSV/Excel | owner, admin |
| EXP-004 | Export Sales Register | Export sales register to Excel | owner, admin, accountant |
| EXP-005 | Export Purchase Register | Export purchase register to Excel | owner, admin, accountant |
| EXP-006 | Export Ledger | Export general ledger to Excel | owner, admin, accountant |
| EXP-007 | Export Stock | Export stock balances to Excel | owner, admin, accountant |
| EXP-008 | Export Trial Balance | Export trial balance to Excel | owner, admin, accountant |

### Advanced Inventory

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| ADV-INV-001 | Batch Tracking | Track inventory by batch/lot number | owner, admin, inventory_manager |
| ADV-INV-002 | Expiry Tracking | Track product expiry dates, FEFO allocation | owner, admin, inventory_manager |
| ADV-INV-003 | FIFO Stock Allocation | First-In-First-Out stock allocation on sales | System |
| ADV-INV-004 | Stock Transfer | Transfer stock between warehouses with ledger entry | owner, admin, inventory_manager |
| ADV-INV-005 | Stock Transfer Approval | Multi-step approval for inter-warehouse transfers | owner, admin, inventory_manager |
| ADV-INV-006 | Minimum Stock Level | Set minimum stock levels per product per warehouse | owner, admin, inventory_manager |
| ADV-INV-007 | Stock Reorder Alert | Alert when stock falls below minimum level | System |
| ADV-INV-008 | Stock Valuation Report | FIFO/weighted average valuation report | All except viewer |
| ADV-INV-009 | Physical Stock Count | Physical count entry with variance analysis | owner, admin, inventory_manager |
| ADV-INV-010 | Stock Adjustment Approval | Approval workflow for manual stock adjustments | owner, admin |

### Approval Workflows

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| AWF-001 | Invoice Approval | Multi-level approval before invoice posting | owner, admin, accountant |
| AWF-002 | Payment Approval | Multi-level approval for payments above threshold | owner, admin, accountant |
| AWF-003 | Expense Approval | Multi-level approval for expense entries | owner, admin, accountant |
| AWF-004 | Approval Dashboard | View pending approvals, approve/reject with comments | owner, admin, accountant |
| AWF-005 | Approval History | Track approval chain with timestamps | All except viewer |
| AWF-006 | Auto-approve Rules | Auto-approve below threshold amounts | owner, admin |

### Multiple Branches

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| BR-001 | Branch Management | Create, edit, activate/deactivate branches | owner, admin |
| BR-002 | Branch Users | Assign users to specific branches | owner, admin |
| BR-003 | Branch-Specific Inventory | Stock tracking per branch/warehouse | System |
| BR-004 | Inter-Branch Transfer | Transfer stock between branches | owner, admin, inventory_manager |
| BR-005 | Consolidated Reports | Reports across all branches | owner, admin, accountant |
| BR-006 | Branch-wise Reports | Reports filtered by branch | owner, admin, accountant, branch_manager |
| BR-007 | Branch-wise Sales | Sales tracking per branch | owner, admin, accountant, branch_manager |
| BR-008 | Branch-wise Purchase | Purchase tracking per branch | owner, admin, accountant, branch_manager |
| BR-009 | Branch-wise P&L | Profit & loss per branch | owner, admin, accountant |
| BR-010 | Branch Settings | Branch-specific invoice prefixes, terms | owner, admin |

### Advanced Permissions

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| PERM-001 | Custom Roles | Create custom roles with granular permissions | owner |
| PERM-002 | Permission Matrix | Fine-grained permissions per module per action | owner |
| PERM-003 | Data Scope | Control data visibility (own branch, all branches, specific) | owner |
| PERM-004 | Feature Toggles | Enable/disable features per role | owner |
| PERM-005 | Permission Templates | Pre-built permission templates for common roles | System |
| PERM-006 | Permission Audit | Track permission changes with audit log | System |

### Subscription & Billing

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| SUB-001 | Plan Management | Create/manage subscription plans (Free, Starter, Pro, Enterprise) | platform_super_admin |
| SUB-002 | Feature Limits | Enforce plan-based limits (users, invoices, storage) | System |
| SUB-003 | Usage Tracking | Track feature usage against plan limits | System |
| SUB-004 | Plan Upgrade | Upgrade plan with prorated billing | owner |
| SUB-005 | Plan Downgrade | Downgrade plan with grace period | owner |
| SUB-006 | Plan Expiry | Handle plan expiry with data retention policy | System |
| SUB-007 | Billing History | View payment history and invoices | owner |
| SUB-008 | Payment Gateway | Stripe integration for subscription payments | owner, admin |
| SUB-009 | Invoice Generation | Auto-generate subscription invoices | System |
| SUB-010 | Webhook Handling | Handle payment success/failure webhooks | System |

### Advanced Reports

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| ARPT-001 | Custom Report Builder | Build custom reports with drag-and-drop | owner, admin, accountant |
| ARPT-002 | Scheduled Reports | Auto-generate and email reports on schedule | owner, admin |
| ARPT-003 | Report Favorites | Save frequently used report configurations | All authenticated |
| ARPT-004 | Comparative Reports | Period-over-period comparison reports | All except viewer |
| ARPT-005 | Cash Flow Statement | Period-wise cash flow report | All except viewer |
| ARPT-006 | Ratio Analysis | Key financial ratios (current ratio, quick ratio, etc.) | All except viewer |
| ARPT-007 | Tax Summary Report | Comprehensive GST report with ITC details | All except viewer |
| ARPT-008 | Vendor Analysis | Supplier performance and spending analysis | All except viewer |
| ARPT-009 | Customer Analysis | Customer buying patterns and outstanding analysis | All except viewer |
| ARPT-010 | Inventory Turnover | Stock turnover ratio and analysis | All except viewer |

### Search

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| SRCH-001 | Global Search | Search across all entities (customers, suppliers, products, invoices) | All authenticated |
| SRCH-002 | Advanced Filters | Complex filter combinations for any list view | All authenticated |
| SRCH-003 | Recent Searches | Save and recall recent search queries | All authenticated |
| SRCH-004 | Search Suggestions | Auto-suggest as user types | All authenticated |

### Settings

| ID | Feature | Description | Roles |
|----|---------|-------------|-------|
| SET-001 | Company Profile | Full company details with logo, branding | owner, admin |
| SET-002 | Financial Year | Set and manage financial years | owner, admin |
| SET-003 | Numbering Sequences | Configure document numbering (invoices, payments, etc.) | owner, admin |
| SET-004 | Email Configuration | SMTP settings, sender details | owner, admin |
| SET-005 | WhatsApp Configuration | WhatsApp Business API setup | owner, admin |
| SET-006 | E-Invoice Configuration | IRP credentials and settings | owner, admin |
| SET-007 | E-Way Bill Configuration | E-Way Bill portal credentials | owner, admin |
| SET-008 | Notification Preferences | Configure notification channels per user | All authenticated |
| SET-009 | Tax Configuration | GST registration details, tax rates | owner, admin |
| SET-010 | Invoice Templates | Customize invoice layout and fields | owner, admin |

---

## V1 Database Entities (New tables added on top of MVP)

```
-- E-Invoice
e_invoices
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── invoice_id (uuid, FK → invoices)
├── irn (text, nullable)
├── ack_no (text, nullable)
├── ack_date (timestamptz, nullable)
├── qr_code (text, nullable) — base64 encoded
├── status (text: pending|generated|cancelled|failed)
├── error_message (text, nullable)
├── retry_count (integer, default 0)
├── cancelled_at (timestamptz, nullable)
├── created_at (timestamptz)
└── updated_at (timestamptz)

-- E-Way Bill
e_way_bills
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── invoice_id (uuid, FK → invoices)
├── ewb_number (text, nullable)
├── ewb_date (date, nullable)
├── valid_upto (timestamptz, nullable)
├── transporter_id (text, nullable)
├── transporter_name (text, nullable)
├── vehicle_number (text, nullable)
├── distance_km (integer, nullable)
├── status (text: pending|generated|active|expired|cancelled)
├── mode (text: regular|multi_vehicle)
├── parent_ewb_id (uuid, FK → e_way_bills, nullable)
├── error_message (text, nullable)
├── created_at (timestamptz)
└── updated_at (timestamptz)

-- WhatsApp Messages
whatsapp_messages
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── party_id (uuid, FK → parties)
├── message_type (text: invoice|receipt|reminder|custom)
├── entity_type (text, nullable)
├── entity_id (uuid, nullable)
├── template_name (text)
├── message_content (text)
├── media_url (text, nullable)
├── status (text: pending|sent|delivered|read|failed)
├── whatsapp_message_id (text, nullable)
├── error_message (text, nullable)
├── sent_at (timestamptz, nullable)
├── delivered_at (timestamptz, nullable)
├── read_at (timestamptz, nullable)
├── created_by (uuid, FK → users)
└── created_at (timestamptz)

-- Email Campaigns
email_campaigns
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── name (text)
├── subject (text)
├── body (text) — HTML
├── recipient_type (text: customers|suppliers|all|custom)
├── recipient_ids (uuid[], nullable) — specific recipients
├── status (text: draft|scheduled|sending|sent|failed)
├── scheduled_at (timestamptz, nullable)
├── sent_at (timestamptz, nullable)
├── total_recipients (integer, default 0)
├── total_sent (integer, default 0)
├── total_opened (integer, default 0)
├── total_clicked (integer, default 0)
├── created_by (uuid, FK → users)
├── created_at (timestamptz)
└── updated_at (timestamptz)

email_logs
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── campaign_id (uuid, FK → email_campaigns, nullable)
├── party_id (uuid, FK → parties, nullable)
├── email (text)
├── subject (text)
├── status (text: sent|delivered|opened|clicked|bounced|failed)
├── entity_type (text, nullable)
├── entity_id (uuid, nullable)
├── error_message (text, nullable)
├── sent_at (timestamptz)
├── delivered_at (timestamptz, nullable)
├── opened_at (timestamptz, nullable)
├── clicked_at (timestamptz, nullable)
└── created_at (timestamptz)

-- Branches
branches
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── name (text)
├── code (text)
├── address (jsonb)
├── state_code (text)
├── phone (text, nullable)
├── email (text, nullable)
├── manager_id (uuid, FK → users, nullable)
├── is_active (boolean, default true)
├── created_at (timestamptz)
└── updated_at (timestamptz)
├── UNIQUE(organization_id, code)

branch_members
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── branch_id (uuid, FK → branches)
├── user_id (uuid, FK → users)
├── role (text)
├── created_at (timestamptz)
└── UNIQUE(organization_id, branch_id, user_id)

-- Stock Transfers
stock_transfers
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── transfer_number (text)
├── from_warehouse_id (uuid, FK → warehouses)
├── to_warehouse_id (uuid, FK → warehouses)
├── from_branch_id (uuid, FK → branches, nullable)
├── to_branch_id (uuid, FK → branches, nullable)
├── status (text: draft|pending_approval|approved|in_transit|received|cancelled)
├── transfer_date (date)
├── expected_date (date, nullable)
├── actual_date (date, nullable)
├── notes (text, nullable)
├── approved_by (uuid, FK → users, nullable)
├── approved_at (timestamptz, nullable)
├── received_by (uuid, FK → users, nullable)
├── received_at (timestamptz, nullable)
├── created_by (uuid, FK → users)
├── created_at (timestamptz)
└── updated_at (timestamptz)
├── UNIQUE(organization_id, transfer_number)

stock_transfer_items
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── transfer_id (uuid, FK → stock_transfers)
├── product_id (uuid, FK → products)
├── quantity_sent (numeric)
├── quantity_received (numeric, nullable)
├── batch_number (text, nullable)
├── expiry_date (date, nullable)
├── notes (text, nullable)
└── created_at (timestamptz)

-- Approval Workflows
approval_workflows
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── name (text)
├── entity_type (text: invoice|payment|expense|stock_transfer)
├── is_active (boolean, default true)
├── steps (jsonb) — array of {level, approver_role, threshold_amount}
├── created_by (uuid, FK → users)
├── created_at (timestamptz)
└── updated_at (timestamptz)

approval_requests
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── workflow_id (uuid, FK → approval_workflows)
├── entity_type (text)
├── entity_id (uuid)
├── current_step (integer)
├── status (text: pending|approved|rejected|cancelled)
├── requested_by (uuid, FK → users)
├── requested_at (timestamptz)
├── resolved_at (timestamptz, nullable)
├── created_at (timestamptz)
└── updated_at (timestamptz)

approval_actions
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── request_id (uuid, FK → approval_requests)
├── step (integer)
├── action (text: approve|reject)
├── comments (text, nullable)
├── acted_by (uuid, FK → users)
├── acted_at (timestamptz)
└── created_at (timestamptz)

-- Custom Roles
custom_roles
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── name (text)
├── description (text, nullable)
├── permissions (jsonb) — matrix of module:actions
├── is_system (boolean, default false)
├── created_by (uuid, FK → users)
├── created_at (timestamptz)
└── updated_at (timestamptz)
├── UNIQUE(organization_id, name)

-- Subscription Plans
subscription_plans
├── id (uuid, PK)
├── name (text)
├── code (text, unique)
├── description (text)
├── price_monthly (numeric)
├── price_yearly (numeric)
├── currency (text, default 'INR')
├── limits (jsonb) — {max_users, max_invoices, max_storage_mb, features[]}
├── is_active (boolean, default true)
├── sort_order (integer)
├── created_at (timestamptz)
└── updated_at (timestamptz)

subscriptions
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── plan_id (uuid, FK → subscription_plans)
├── status (text: active|trialing|past_due|cancelled|expired)
├── billing_cycle (text: monthly|yearly)
├── current_period_start (date)
├── current_period_end (date)
├── trial_end (date, nullable)
├── cancel_at (date, nullable)
├── cancelled_at (timestamptz, nullable)
├── stripe_subscription_id (text, nullable)
├── created_at (timestamptz)
└── updated_at (timestamptz)

invoices (subscription)
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── subscription_id (uuid, FK → subscriptions)
├── amount (numeric)
├── status (text: draft|sent|paid|overdue|cancelled)
├── due_date (date)
├── paid_at (timestamptz, nullable)
├── stripe_invoice_id (text, nullable)
├── created_at (timestamptz)
└── updated_at (timestamptz)

-- Notification Preferences
notification_preferences
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── user_id (uuid, FK → users)
├── event_type (text)
├── channel_in_app (boolean, default true)
├── channel_email (boolean, default true)
├── channel_whatsapp (boolean, default false)
├── created_at (timestamptz)
└── updated_at (timestamptz)
├── UNIQUE(organization_id, user_id, event_type)

-- Import Jobs
import_jobs
├── id (uuid, PK)
├── organization_id (uuid, FK → organizations)
├── entity_type (text: customers|suppliers|products|opening_balances|bank_statements)
├── file_name (text)
├── file_path (text)
├── status (text: pending|processing|completed|failed)
├── total_rows (integer, default 0)
├── success_rows (integer, default 0)
├── error_rows (integer, default 0)
├── error_log (jsonb, nullable)
├── processed_by (uuid, FK → users)
├── created_at (timestamptz)
└── completed_at (timestamptz, nullable)
```

**Total V1 Tables: 28 new tables (47 total including MVP)**

---

## V1 API Endpoints (New endpoints added on top of MVP)

### E-Invoice
```
POST   /api/organizations/:orgId/e-invoices/generate
GET    /api/organizations/:orgId/e-invoices/:id
POST   /api/organizations/:orgId/e-invoices/:id/cancel
POST   /api/organizations/:orgId/e-invoices/:id/retry
GET    /api/organizations/:orgId/e-invoices/status
POST   /api/organizations/:orgId/e-invoices/bulk-generate
```

### E-Way Bill
```
POST   /api/organizations/:orgId/e-way-bills/generate
GET    /api/organizations/:orgId/e-way-bills/:id
POST   /api/organizations/:orgId/e-way-bills/:id/update-vehicle
POST   /api/organizations/:orgId/e-way-bills/:id/cancel
GET    /api/organizations/:orgId/e-way-bills/active
```

### WhatsApp
```
POST   /api/organizations/:orgId/whatsapp/send-invoice
POST   /api/organizations/:orgId/whatsapp/send-receipt
POST   /api/organizations/:orgId/whatsapp/send-reminder
POST   /api/organizations/:orgId/whatsapp/send-custom
GET    /api/organizations/:orgId/whatsapp/messages
GET    /api/organizations/:orgId/whatsapp/status/:messageId
GET    /api/organizations/:orgId/whatsapp/templates
POST   /api/organizations/:orgId/whatsapp/templates
PUT    /api/organizations/:orgId/whatsapp/templates/:id
DELETE /api/organizations/:orgId/whatsapp/templates/:id
```

### Email
```
POST   /api/organizations/:orgId/email/send-invoice
POST   /api/organizations/:orgId/email/send-receipt
POST   /api/organizations/:orgId/email/send-reminder
POST   /api/organizations/:orgId/email/campaigns
GET    /api/organizations/:orgId/email/campaigns
GET    /api/organizations/:orgId/email/campaigns/:id
PUT    /api/organizations/:orgId/email/campaigns/:id
POST   /api/organizations/:orgId/email/campaigns/:id/send
GET    /api/organizations/:orgId/email/templates
POST   /api/organizations/:orgId/email/templates
PUT    /api/organizations/:orgId/email/templates/:id
DELETE /api/organizations/:orgId/email/templates/:id
```

### Import/Export
```
POST   /api/organizations/:orgId/import/:entityType
GET    /api/organizations/:orgId/import/jobs
GET    /api/organizations/:orgId/import/jobs/:id
POST   /api/organizations/:orgId/import/jobs/:id/retry
GET    /api/organizations/:orgId/import/template/:entityType
GET    /api/organizations/:orgId/export/:entityType
GET    /api/organizations/:orgId/export/reports/:reportType
```

### Stock Transfers
```
POST   /api/organizations/:orgId/stock-transfers
GET    /api/organizations/:orgId/stock-transfers
GET    /api/organizations/:orgId/stock-transfers/:id
PUT    /api/organizations/:orgId/stock-transfers/:id
POST   /api/organizations/:orgId/stock-transfers/:id/approve
POST   /api/organizations/:orgId/stock-transfers/:id/receive
POST   /api/organizations/:orgId/stock-transfers/:id/cancel
```

### Branches
```
POST   /api/organizations/:orgId/branches
GET    /api/organizations/:orgId/branches
GET    /api/organizations/:orgId/branches/:id
PUT    /api/organizations/:orgId/branches/:id
POST   /api/organizations/:orgId/branches/:id/members
GET    /api/organizations/:orgId/branches/:id/members
DELETE /api/organizations/:orgId/branches/:branchId/members/:userId
```

### Approval Workflows
```
POST   /api/organizations/:orgId/workflows
GET    /api/organizations/:orgId/workflows
PUT    /api/organizations/:orgId/workflows/:id
GET    /api/organizations/:orgId/approvals/pending
POST   /api/organizations/:orgId/approvals/:id/approve
POST   /api/organizations/:orgId/approvals/:id/reject
GET    /api/organizations/:orgId/approvals/:id/history
```

### Custom Roles
```
POST   /api/organizations/:orgId/roles
GET    /api/organizations/:orgId/roles
PUT    /api/organizations/:orgId/roles/:id
DELETE /api/organizations/:orgId/roles/:id
GET    /api/organizations/:orgId/roles/:id/permissions
PUT    /api/organizations/:orgId/roles/:id/permissions
```

### Subscription
```
GET    /api/platform/plans
POST   /api/organizations/:orgId/subscription/upgrade
POST   /api/organizations/:orgId/subscription/cancel
GET    /api/organizations/:orgId/subscription
GET    /api/organizations/:orgId/subscription/invoices
POST   /api/webhooks/stripe
```

### Notifications
```
GET    /api/organizations/:orgId/notifications
PUT    /api/organizations/:orgId/notifications/preferences
GET    /api/organizations/:orgId/notifications/preferences
POST   /api/organizations/:orgId/notifications/:id/read
POST   /api/organizations/:orgId/notifications/read-all
```

### Search
```
GET    /api/organizations/:orgId/search?q=term
GET    /api/organizations/:orgId/search/suggestions?q=term
```

**Total V1 API Endpoints: ~85 new endpoints (150 total including MVP)**

---

## V1 UI Screens (New screens added on top of MVP)

### E-Invoice
1. E-Invoice dashboard (pending, generated, failed counts)
2. E-Invoice detail view (IRN, QR code, status)
3. E-Invoice bulk generation page
4. E-Invoice settings/configuration page

### E-Way Bill
5. E-Way Bill dashboard (active, expired, pending counts)
6. E-Way Bill create/edit form (transport details)
7. E-Way Bill detail view (status, vehicle details)
8. E-Way Bill multi-vehicle split form
9. E-Way Bill settings/configuration page

### WhatsApp
10. WhatsApp dashboard (messages sent, delivery rates)
11. WhatsApp template manager
12. WhatsApp send invoice page
13. WhatsApp send custom message page
14. WhatsApp message history
15. WhatsApp settings/configuration page

### Email
16. Email campaign list
17. Email campaign create/edit form
18. Email campaign analytics
19. Email template manager
20. Email settings/configuration page

### Import/Export
21. Import wizard (file upload, mapping, validation, import)
22. Import job history
23. Export wizard (entity selection, filters, format)
24. Download center (pending exports)

### Stock Transfers
25. Stock transfer list
26. Stock transfer create/edit form
27. Stock transfer detail view (with approval chain)
28. Stock transfer receive form

### Branches
29. Branch list
30. Branch create/edit form
31. Branch detail view (members, inventory, stats)
32. Branch member management
33. Branch-wise dashboard view

### Approval Workflows
34. Workflow builder (drag-and-drop steps)
35. Approval inbox (pending items)
36. Approval detail view (with history)
37. My approvals (items I need to approve)

### Custom Roles
38. Role list (built-in + custom)
39. Role create/edit form (permission matrix)
40. Role detail view

### Subscription
41. Plan comparison page
42. Current subscription details
43. Upgrade/downgrade flow
44. Billing history
45. Payment method management

### Notifications
46. Notification center (in-app notifications)
47. Notification preferences page

### Advanced Reports
48. Custom report builder
49. Cash flow statement
50. Ratio analysis
51. Comparative reports
52. Scheduled reports management
53. Report favorites

### Search
54. Global search results page
55. Advanced filter panel (reusable)

**Total V1 UI Screens: 55 new screens (118 total including MVP)**

---

## V1 Dependencies (New dependencies added on top of MVP)

### External Services
| Service | Purpose | Required for V1 |
|---------|---------|-----------------|
| **IRP Sandbox** | E-Invoice testing environment | Yes (development) |
| **IRP Production** | E-Invoice production | Yes (production) |
| **E-Way Bill API** | E-Way Bill generation | Yes |
| **WhatsApp Business API** | WhatsApp messaging | Yes |
| **Resend** | Email campaigns (already in MVP) | Yes |
| **Stripe** | Subscription billing | Yes |
| **PapaParse** | CSV parsing for imports | Yes |

### Internal Libraries
| Library | Purpose |
|---------|---------|
| `@bizkhata/e-invoice` | E-Invoice adapter (IRP integration) |
| `@bizkhata/e-way-bill` | E-Way Bill adapter |
| `@bizkhata/whatsapp` | WhatsApp Business API adapter |
| `@bizkhata/email` | Email automation engine |
| `@bizkhata/import` | Import processing engine |
| `@bizkhata/export` | Export generation engine |
| `@bizkhata/workflow` | Approval workflow engine |

---

## V1 Success Criteria

1. **E-Invoice Compliance**: Successfully generate IRNs via IRP sandbox
2. **E-Way Bill Compliance**: Generate E-Way Bills for applicable invoices
3. **WhatsApp Delivery**: Messages delivered with >95% success rate
4. **Email Automation**: Campaigns sent with >98% delivery rate
5. **Import Reliability**: Import validates data, handles errors gracefully, shows progress
6. **Multi-Branch**: Correct stock isolation between branches, consolidated reporting works
7. **Subscription**: Stripe billing works end-to-end, plan limits enforced
8. **Performance**: No degradation from MVP baseline
9. **Zero Financial Bugs**: All new features maintain financial data integrity
