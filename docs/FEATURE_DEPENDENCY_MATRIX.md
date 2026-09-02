# Feature Dependency Matrix

> BizKhata Cloud Accounting SaaS — Complete Dependency Registry
> Maps every feature's prerequisites ("Depends On") and dependents ("Required By").

## Legend

| Symbol | Meaning |
|--------|---------|
| → | Leads to (dependency direction) |
| BLOCKER | Feature is a critical-path prerequisite |
| PARALLEL | Features can be built in parallel |
| CIRCULAR | Circular dependency detected (must break) |
| system | Auto-triggered, no human invocation |

---

## Module Dependencies (High-Level)

```
AUTH → ORG → CMP → BRN → USR → ROL → CUS → SUP → PRD → INV → WHS → STK
                                                                    ↓
AUTH → SUB                                              PUR → SAL → ACC
                                                          ↓       ↓
                                              PAY → REC → PYB → GST
                                                  ↓           ↓
                                              EINV ← ← ← EWAY
                                                              ↓
AUTH → AUD ← SEC ← ← ← ← ← ← ← ← ← ← ← ← ← RPT
                    ↓               ↓
              DOC → PDF        WA ← ← SET ← ← ← ← EML
                                          ↓
                              NTF ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←
                                          ↓
                      ADM ← ← ← ← ← ← SUB ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←
```

### Linear Critical Path (Minimum Build Order)

```
AUTH-001 → ORG-001 → CMP-001 → BRN-001 → USR-001 → ROL-001 → CUS-001
→ SUP-001 → PRD-001 → INV-001 → WHS-001 → STK-001 → PUR-001 → SAL-001
→ ACC-001 → PAY-001 → REC-001 → PYB-001 → GST-001 → EINV-001 → EWAY-001
→ RPT-001 → DOC-001 → PDF-001 → WA-001 → EML-001 → NTF-001 → SUB-001
→ ADM-001
```

**Total steps: 30 | Estimated minimum build time: 30 sprints**

---

## Complete Feature Dependency Registry

### Authentication Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| AUTH-001 User Registration | none | AUTH-002, AUTH-003, AUTH-004, AUTH-005, AUTH-009, ORG-001, USR-001, ROL-001, SUB-001, SUB-008, AUD-001, SRH-001, DBS-001, NTF-001, NTF-002, NTF-006, MOB-001, API-001, BGJ-001, SYS-001, SYS-002, SYS-003, SEC-001, SEC-002, SEC-004, SEC-005, SEC-008, SEC-010 |
| AUTH-002 Email/Password Login | AUTH-001 | AUTH-003, AUTH-006 |
| AUTH-003 OTP Verification | AUTH-001, AUTH-002 | — |
| AUTH-004 Password Reset | AUTH-001 | — |
| AUTH-005 Google OAuth Login | AUTH-001 | — |
| AUTH-006 Session Management | AUTH-002 | AUTH-007, AUTH-008, AUTH-010, AUTH-011 |
| AUTH-007 Multi-Device Login Tracking | AUTH-006 | — |
| AUTH-008 Session Revocation | AUTH-006 | — |
| AUTH-009 Mobile OTP Login | AUTH-001 | — |
| AUTH-010 Refresh Token Rotation | AUTH-006 | — |
| AUTH-011 Login History | AUTH-006 | — |

### Organization Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| ORG-001 Create Organization | AUTH-001 | ORG-002, ORG-003, ORG-004, ORG-005, CMP-001, BRN-001, USR-001, ROL-001, CUS-001, SUP-001, PRD-001, WHS-001, SAL-001, PUR-001, ACC-001, PAY-001, PAY-002, GST-001, DOC-001, SET-001, ADM-002, IMP-001, IMP-002, IMP-003, IMP-004, IMP-005, IMP-006, IMP-007, IMP-008, IMP-009 |
| ORG-002 Organization Profile | ORG-001 | ORG-003 |
| ORG-003 Update Organization Settings | ORG-001, ORG-002 | — |
| ORG-004 Organization Archive | ORG-001 | — |
| ORG-005 Organization Subscription Plan | ORG-001 | — |

### Company Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| CMP-001 Create Company | ORG-001 | CMP-002, CMP-003, CMP-004, BRN-001, CUS-001, SUP-001, PRD-001, WHS-001, SAL-001, PUR-001, ACC-001, PAY-001, PAY-002, GST-001 |
| CMP-002 Company Profile & Details | CMP-001 | — |
| CMP-003 Financial Year Settings | CMP-001 | ACC-013, ACC-014 |
| CMP-004 Company GST Registration | CMP-001 | GST-001, GST-002 |

### Branch Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| BRN-001 Create Branch | ORG-001, CMP-001 | BRN-002, BRN-003, BRN-004, BRN-005, USR-006, INV-010, WHS-001, WHS-002, WHS-003, WHS-004, STK-001, SAL-001, PUR-001, PAY-001, PAY-002, ACC-001 |
| BRN-002 Branch Profile & Address | BRN-001 | — |
| BRN-003 Branch Activation/Deactivation | BRN-001 | — |
| BRN-004 Branch-Level Inventory Settings | BRN-001 | INV-006, INV-007, INV-008, INV-009 |
| BRN-005 Branch User Assignment | BRN-001 | USR-006 |

### Users Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| USR-001 Invite User | ORG-001 | USR-002, USR-003, USR-004, USR-005, USR-006, ADM-003, SEC-006 |
| USR-002 User Profile Management | USR-001 | — |
| USR-003 Assign Role to User | USR-001, ROL-001 | — |
| USR-004 Deactivate User | USR-001 | — |
| USR-005 User Activity Log | USR-001 | AUD-001, AUD-002, AUD-003 |
| USR-006 Branch Assignment to User | USR-001, BRN-001 | — |

### Roles & Permissions Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| ROL-001 View Roles | ORG-001 | ROL-002, ROL-003, ROL-004, ROL-005, USR-003, SEC-006 |
| ROL-002 Create Custom Role | ROL-001 | ROL-003, ROL-004 |
| ROL-003 Edit Role Permissions | ROL-001, ROL-002 | — |
| ROL-004 Delete Custom Role | ROL-002 | — |
| ROL-005 Default Role Templates | ORG-001 | — |

### Customers Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| CUS-001 Create Customer | ORG-001, CMP-001 | CUS-002, CUS-003, CUS-004, CUS-005, CUS-006, CUS-007, CUS-008, CUS-009, CUS-010, SAL-001, SAL-007, SAL-009, PAY-001, PAY-003, PAY-004, REC-001, REC-002, REC-003, REC-004, RPT-005, EXP-001, IMP-001 |
| CUS-002 Edit Customer | CUS-001 | — |
| CUS-003 Delete Customer | CUS-001 | — |
| CUS-004 Customer List with Search | CUS-001 | — |
| CUS-005 Customer Ledger View | CUS-001 | — |
| CUS-006 Customer Opening Balance | CUS-001 | — |
| CUS-007 Customer GSTIN Validation | CUS-001 | — |
| CUS-008 Customer Credit Limit | CUS-001 | — |
| CUS-009 Customer Group/Category | CUS-001 | — |
| CUS-010 Customer Address Management | CUS-001 | — |

### Suppliers Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| SUP-001 Create Supplier | ORG-001, CMP-001 | SUP-002, SUP-003, SUP-004, SUP-005, SUP-006, SUP-007, PUR-001, PUR-006, PAY-002, PAY-003, PYB-001, PYB-002, PYB-003, RPT-006, EXP-002, IMP-002 |
| SUP-002 Edit Supplier | SUP-001 | — |
| SUP-003 Delete Supplier | SUP-001 | — |
| SUP-004 Supplier List with Search | SUP-001 | — |
| SUP-005 Supplier Ledger View | SUP-001 | — |
| SUP-006 Supplier Opening Balance | SUP-001 | — |
| SUP-007 Supplier GSTIN Validation | SUP-001 | — |

### Products Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| PRD-001 Create Product | ORG-001, CMP-001 | PRD-002, PRD-003, PRD-004, PRD-005, PRD-006, PRD-007, PRD-008, PRD-009, PRD-010, PRD-011, INV-001, SAL-001, SAL-014, PUR-001, PUR-008, RPT-007, EXP-003, IMP-003, DBS-002 |
| PRD-002 Edit Product | PRD-001 | — |
| PRD-003 Delete Product | PRD-001 | — |
| PRD-004 Product List with Search/Filter | PRD-001 | — |
| PRD-005 Product Categories & Hierarchy | PRD-001 | — |
| PRD-006 Product Units of Measure | PRD-001 | — |
| PRD-007 Product HSN/SAC Code Mapping | PRD-001 | GST-001, EINV-001 |
| PRD-008 Product Pricing (MRP, Sale, Purchase) | PRD-001 | SAL-001, PUR-001 |
| PRD-009 Product Image Upload | PRD-001 | — |
| PRD-010 Product Barcode/QR Generation | PRD-001 | — |
| PRD-011 Product Tax Configuration | PRD-001 | GST-001, SAL-013, PUR-008 |

### Inventory Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| INV-001 Current Stock View | PRD-001 | INV-002, INV-003, INV-004, INV-005, INV-006, INV-007, INV-008, INV-009, INV-010, WHS-003, STK-001, SAL-010, RPT-007, EXP-007 |
| INV-002 Stock Adjustment (Add) | INV-001, PRD-001 | — |
| INV-003 Stock Adjustment (Subtract) | INV-001, PRD-001 | — |
| INV-004 Stock Valuation Report | INV-001 | — |
| INV-005 Stock Movement History | INV-001 | RPT-008 |
| INV-006 Low Stock Alerts | INV-001 | NTF-004 |
| INV-007 Minimum Stock Level Setup | INV-001 | INV-006 |
| INV-008 Batch/Serial Number Tracking | INV-001, PRD-001 | — |
| INV-009 Inventory Expiry Tracking | INV-001, PRD-001 | — |
| INV-010 Multi-Warehouse Stock View | INV-001, WHS-001 | — |

### Warehouses Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| WHS-001 Create Warehouse | ORG-001, CMP-001 | WHS-002, WHS-003, WHS-004, INV-010, STK-001, STK-002, STK-003, STK-004 |
| WHS-002 Edit Warehouse | WHS-001 | — |
| WHS-003 Warehouse Stock Overview | WHS-001, INV-001 | — |
| WHS-004 Delete/Deactivate Warehouse | WHS-001 | — |

### Stock Transfers Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| STK-001 Create Stock Transfer | INV-001, WHS-001 | STK-002, STK-003, STK-004 |
| STK-002 Approve Stock Transfer | STK-001 | — |
| STK-003 Transfer History | STK-001 | — |
| STK-004 Transfer Status Tracking | STK-001 | — |

### Sales Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| SAL-001 Create Sales Invoice | ORG-001, CMP-001, CUS-001, PRD-001 | SAL-002, SAL-003, SAL-004, SAL-005, SAL-006, SAL-008, SAL-011, SAL-012, SAL-013, SAL-014, SAL-015, SAL-016, SAL-017, ACC-004, EINV-001, EWAY-001, PAY-001, RPT-001, RPT-015, RPT-018, PDF-001, WA-001, EML-001, DBS-002, EXP-004 |
| SAL-002 Edit Sales Invoice (Draft) | SAL-001 | — |
| SAL-003 Delete Sales Invoice (Draft) | SAL-001 | — |
| SAL-004 Sales Invoice List with Filter | SAL-001 | — |
| SAL-005 Sales Invoice PDF Generation | SAL-001 | — |
| SAL-006 Sales Return/Credit Note | SAL-001 | REC-001 |
| SAL-007 Sales Quotation/Estimate | ORG-001, CMP-001, CUS-001 | SAL-008, PDF-003, WA-003 |
| SAL-008 Quotation to Invoice Conversion | SAL-007, SAL-001 | — |
| SAL-009 Sales Order (Pre-invoice) | ORG-001, CMP-001, CUS-001 | SAL-010 |
| SAL-010 Sales Order Fulfillment | SAL-009, INV-001 | — |
| SAL-011 Delivery Challan | SAL-001 | PDF-005 |
| SAL-012 Sales Discount Management | SAL-001 | — |
| SAL-013 Sales Tax/GST Calculation | SAL-001, GST-001 | — |
| SAL-014 Multi-Item Invoice | SAL-001, PRD-001 | — |
| SAL-015 Invoice Duplicate/Split | SAL-001 | — |
| SAL-016 Recurring Sales Invoice | SAL-001 | — |
| SAL-017 Sales Invoice Due Date Tracking | SAL-001 | NTF-003, REC-002 |

### Purchase Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| PUR-001 Create Purchase Invoice | ORG-001, CMP-001, SUP-001, PRD-001 | PUR-002, PUR-003, PUR-004, PUR-005, PUR-007, PUR-008, ACC-005, EWAY-001, PAY-002, PYB-001, RPT-002, RPT-015, PDF-002, EML-007, EXP-005 |
| PUR-002 Edit Purchase Invoice (Draft) | PUR-001 | — |
| PUR-003 Delete Purchase Invoice (Draft) | PUR-001 | — |
| PUR-004 Purchase Invoice List with Filter | PUR-001 | — |
| PUR-005 Purchase Return/Debit Note | PUR-001 | PYB-001 |
| PUR-006 Purchase Order | ORG-001, CMP-001, SUP-001, PRD-001 | — |
| PUR-007 Purchase Invoice PDF Generation | PUR-001 | — |
| PUR-008 Purchase Tax/GST Calculation | PUR-001, GST-001 | — |

### Accounting Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| ACC-001 Chart of Accounts | ORG-001, CMP-001 | ACC-002, ACC-004, ACC-005, ACC-006, ACC-007, ACC-008, ACC-009, ACC-010, ACC-011, ACC-012, ACC-013, ACC-014, ACC-015, ACC-016, PAY-001, PAY-002, REC-001, PYB-001, GST-004, RPT-003, RPT-005, RPT-006, RPT-014, RPT-017, RPT-020, DBS-003, IMP-004, IMP-005, IMP-006, IMP-007 |
| ACC-002 Create Journal Entry | ACC-001 | ACC-003, RPT-003 |
| ACC-003 Edit Journal Entry (Draft) | ACC-002 | — |
| ACC-004 Auto Journal from Sales | ACC-001, SAL-001 | — |
| ACC-005 Auto Journal from Purchase | ACC-001, PUR-001 | — |
| ACC-006 Auto Journal from Payments | ACC-001, PAY-001 | — |
| ACC-007 Ledger Account View | ACC-001 | RPT-004 |
| ACC-008 Trial Balance | ACC-001 | — |
| ACC-009 Profit & Loss Statement | ACC-001 | RPT-011, RPT-016 |
| ACC-010 Balance Sheet | ACC-001 | RPT-012, RPT-016 |
| ACC-011 Cash Flow Statement | ACC-001 | RPT-013 |
| ACC-012 Account Group Management | ACC-001 | — |
| ACC-013 Account Opening Balance | ACC-001, CMP-003 | — |
| ACC-014 Financial Period Close/Year End | ACC-001, CMP-003 | — |
| ACC-015 Multi-Currency Support | ACC-001 | — |
| ACC-016 Cost Center Tracking | ACC-001 | — |

### Payments Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| PAY-001 Record Payment Received | ORG-001, CMP-001, CUS-001 | PAY-003, PAY-004, PAY-005, PAY-006, PAY-007, ACC-006, REC-004, RPT-020, PDF-004, WA-004, EML-001, NTF-003 |
| PAY-002 Record Payment Made | ORG-001, CMP-001, SUP-001 | PAY-003, PAY-004, PAY-005, PAY-006, PAY-007, PYB-003, RPT-020, PDF-004 |
| PAY-003 Payment List & History | PAY-001, PAY-002 | — |
| PAY-004 Payment Receipt PDF | PAY-001, PAY-002 | — |
| PAY-005 Bank Account Management | PAY-001, PAY-002 | — |
| PAY-006 UPI/NEFT/RTGS Reference Tracking | PAY-001, PAY-002 | — |
| PAY-007 Petty Cash Management | PAY-001, PAY-002 | — |

### Receivables Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| REC-001 Accounts Receivable Aging Report | CUS-001, ACC-001 | — |
| REC-002 Send Payment Reminder | CUS-001 | WA-002, EML-002, NTF-003 |
| REC-003 Customer Outstanding Summary | CUS-001 | — |
| REC-004 Bulk Payment Allocation | PAY-001, CUS-001 | — |

### Payables Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| PYB-001 Accounts Payable Aging Report | SUP-001, ACC-001 | — |
| PYB-002 Supplier Outstanding Summary | SUP-001 | — |
| PYB-003 Schedule Supplier Payments | PYB-001 | — |

### GST Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| GST-001 GST Tax Slab Setup | ORG-001, CMP-001 | GST-002, GST-003, GST-004, GST-005, GST-006, GST-007, GST-008, GST-009, GST-010, SAL-013, PUR-008, EINV-001, EWAY-001, RPT-014 |
| GST-002 GSTIN Verification (API) | GST-001, CMP-004 | — |
| GST-003 GSTR-1 Return Data | GST-001, SAL-001 | GST-006, GST-009, RPT-009, EXP-006, NTF-007 |
| GST-004 GSTR-3B Return Data | GST-001, ACC-001 | RPT-010 |
| GST-005 GST Input Tax Credit (ITC) | GST-001 | — |
| GST-006 GST Reconciliation | GST-001, GST-003 | — |
| GST-007 TDS/TCS Management | GST-001 | — |
| GST-008 GST State-Wise Report | GST-001 | — |
| GST-009 GST Summary Dashboard | GST-001, GST-003 | — |
| GST-010 Reverse Charge Mechanism | GST-001 | — |

### E-Invoice Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| EINV-001 Generate E-Invoice (IRN) | SAL-001, GST-001 | EINV-002, EINV-003, EINV-004, EINV-005, EINV-006, EINV-007, RPT-018 |
| EINV-002 Cancel E-Invoice | EINV-001 | — |
| EINV-003 E-Invoice QR Code | EINV-001 | — |
| EINV-004 E-Invoice Status Check | EINV-001 | — |
| EINV-005 Bulk E-Invoice Generation | EINV-001 | — |
| EINV-006 E-Invoice Error Handling | EINV-001 | — |
| EINV-007 E-Invoice Print with QR | EINV-001 | — |

### E-Way Bill Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| EWAY-001 Generate E-Way Bill | SAL-001, GST-001 | EWAY-002, EWAY-003, EWAY-004, EWAY-005, EWAY-006, RPT-019 |
| EWAY-002 Cancel E-Way Bill | EWAY-001 | — |
| EWAY-003 E-Way Bill List & Status | EWAY-001 | — |
| EWAY-004 Multi-Vehicle E-Way Bill | EWAY-001 | — |
| EWAY-005 E-Way Bill Extension | EWAY-001 | — |
| EWAY-006 E-Way Bill Print/Download | EWAY-001 | — |

### Reports Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| RPT-001 Sales Register | SAL-001 | — |
| RPT-002 Purchase Register | PUR-001 | — |
| RPT-003 Day Book | ACC-002 | — |
| RPT-004 Ledger Report (Account-wise) | ACC-007 | — |
| RPT-005 Customer Outstanding Report | CUS-001, ACC-001 | — |
| RPT-006 Supplier Outstanding Report | SUP-001, ACC-001 | — |
| RPT-007 Stock Summary Report | INV-001 | — |
| RPT-008 Stock Movement Report | INV-005 | — |
| RPT-009 GST Summary Report (GSTR-1) | GST-003 | — |
| RPT-010 GST Summary Report (GSTR-3B) | GST-004 | — |
| RPT-011 Profit & Loss Report | ACC-009 | — |
| RPT-012 Balance Sheet Report | ACC-010 | — |
| RPT-013 Cash Flow Report | ACC-011 | — |
| RPT-014 Tax Audit Report | ACC-001, GST-001 | — |
| RPT-015 Sales vs Purchase Comparison | SAL-001, PUR-001 | — |
| RPT-016 Monthly/Quarterly Summary | ACC-009, ACC-010 | — |
| RPT-017 Custom Report Builder | ACC-001 | — |
| RPT-018 E-Invoice Report | EINV-001 | — |
| RPT-019 E-Way Bill Report | EWAY-001 | — |
| RPT-020 Expense Report | ACC-001, PAY-001 | — |

### Documents Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| DOC-001 Upload Document | ORG-001 | DOC-002, DOC-003, DOC-004, DOC-005, DOC-006, DOC-007, AUD-001 |
| DOC-002 Attach to Invoice | DOC-001, SAL-001 | — |
| DOC-003 Document Gallery View | DOC-001 | — |
| DOC-004 Document Search | DOC-001 | — |
| DOC-005 Document Versioning | DOC-001 | — |
| DOC-006 Share Document Link | DOC-001 | — |
| DOC-007 Delete Document | DOC-001 | — |

### PDF Generation Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| PDF-001 Sales Invoice PDF | SAL-001 | PDF-006, PDF-007 |
| PDF-002 Purchase Invoice PDF | PUR-001 | PDF-006, PDF-007 |
| PDF-003 Quotation/Estimate PDF | SAL-007 | — |
| PDF-004 Payment Receipt PDF | PAY-001, PAY-002 | — |
| PDF-005 Delivery Challan PDF | SAL-011 | — |
| PDF-006 PDF Template Customization | PDF-001, PDF-002 | — |
| PDF-007 Bulk PDF Export | PDF-001, PDF-002 | — |

### WhatsApp Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| WA-001 Send Invoice via WhatsApp | SAL-001, SET-005 | WA-007, WA-009 |
| WA-002 Send Payment Reminder via WhatsApp | REC-002, SET-005 | — |
| WA-003 Send Quotation via WhatsApp | SAL-007, SET-005 | — |
| WA-004 Send Payment Receipt via WhatsApp | PAY-001, SET-005 | — |
| WA-005 WhatsApp Business API Config | SET-005 | WA-006, WA-007, WA-008, WA-009 |
| WA-006 WhatsApp Message Templates | WA-005 | — |
| WA-007 Bulk WhatsApp (Invoice Batch) | WA-005, WA-001 | — |
| WA-008 WhatsApp Chat History | WA-005 | — |
| WA-009 WhatsApp Delivery Status | WA-005, WA-001 | — |

### Email Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| EML-001 Send Invoice via Email | SAL-001, SET-005 | EML-005, EML-006, EML-007 |
| EML-002 Send Payment Reminder via Email | REC-002, SET-005 | — |
| EML-003 Email Template Management | SET-005 | — |
| EML-004 SMTP/Email Service Config | SET-005 | — |
| EML-005 Email Scheduling | EML-001 | — |
| EML-006 Email Delivery Tracking | EML-001 | — |
| EML-007 Bulk Email (Invoice Batch) | EML-001 | — |

### Notifications Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| NTF-001 In-App Notification Center | AUTH-001 | — |
| NTF-002 Email Notifications | AUTH-001 | — |
| NTF-003 Payment Due Notifications | PAY-001, PAY-002, SAL-017 | — |
| NTF-004 Low Stock Notifications | INV-006 | — |
| NTF-005 Subscription Expiry Notifications | SUB-001 | — |
| NTF-006 Notification Preferences | AUTH-001 | — |
| NTF-007 GST Return Filing Reminder | GST-003 | — |

### Import Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| IMP-001 Import Customers (CSV/Excel) | ORG-001 | IMP-006, IMP-008, IMP-009 |
| IMP-002 Import Suppliers (CSV/Excel) | ORG-001 | IMP-007, IMP-008 |
| IMP-003 Import Products (CSV/Excel) | ORG-001 | IMP-006, IMP-007, IMP-008 |
| IMP-004 Import Opening Balances | ORG-001, ACC-001 | — |
| IMP-005 Import Chart of Accounts | ORG-001, ACC-001 | — |
| IMP-006 Import Sales Invoices | IMP-001, IMP-003 | — |
| IMP-007 Import Purchase Invoices | IMP-002, IMP-003 | — |
| IMP-008 Import Validation & Error Preview | IMP-001, IMP-002, IMP-003 | — |
| IMP-009 Import Template Download | IMP-001 | — |

### Export Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| EXP-001 Export Customers (CSV/Excel) | CUS-001 | — |
| EXP-002 Export Suppliers (CSV/Excel) | SUP-001 | — |
| EXP-003 Export Products (CSV/Excel) | PRD-001 | — |
| EXP-004 Export Sales Register (CSV/Excel) | SAL-001 | — |
| EXP-005 Export Purchase Register (CSV/Excel) | PUR-001 | — |
| EXP-006 Export GST Returns (JSON/CSV) | GST-003 | — |
| EXP-007 Export Stock Report (CSV/Excel) | INV-001 | — |

### Subscription Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| SUB-001 View Current Plan | AUTH-001 | SUB-002, SUB-003, SUB-004, SUB-005, SUB-006, SUB-007, SUB-009, SUB-009, ADM-001, ADM-004, ADM-007, NTF-005 |
| SUB-002 Upgrade Plan | SUB-001 | ADM-007 |
| SUB-003 Downgrade Plan | SUB-001 | — |
| SUB-004 Payment History | SUB-001 | — |
| SUB-005 Invoice for Subscription | SUB-001 | — |
| SUB-006 Feature Gate Enforcement | SUB-001 | — |
| SUB-007 Usage Metering | SUB-001 | — |
| SUB-008 Trial Period Management | AUTH-001 | SUB-001 |
| SUB-009 Auto-Renewal Toggle | SUB-001 | — |

### Platform Admin Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| ADM-001 Platform Dashboard | SUB-001 | — |
| ADM-002 Organization List & Management | ORG-001 | — |
| ADM-003 User List & Management | USR-001 | — |
| ADM-004 Subscription Plan Management | SUB-001 | — |
| ADM-005 Platform Audit Log | AUD-001 | — |
| ADM-006 System Health Monitoring | AUTH-001 | — |
| ADM-007 Force Subscription Override | SUB-002 | — |

### Audit Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| AUD-001 Audit Trail Viewer | AUTH-001, USR-005, DOC-001 | AUD-002, AUD-003, ADM-005, SEC-009 |
| AUD-002 Activity Log Export | AUD-001 | — |
| AUD-003 Critical Action Alert Log | AUD-001 | — |

### Search Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| SRH-001 Global Search | AUTH-001 | SRH-002, SRH-003 |
| SRH-002 Search Suggestions/Autocomplete | SRH-001 | — |
| SRH-003 Search History | SRH-001 | — |

### Dashboard Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| DBS-001 Main Dashboard | AUTH-001 | DBS-002, DBS-003 |
| DBS-002 Sales Dashboard Widgets | DBS-001, SAL-001 | — |
| DBS-003 Financial Summary Widgets | DBS-001, ACC-001 | — |

### Settings Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| SET-001 Company Profile Settings | ORG-001 | SET-002, SET-003, SET-004, SET-005, SET-006, SET-007, SET-008, WA-001, WA-002, WA-003, WA-004, WA-005, EML-001, EML-002, EML-003, EML-004 |
| SET-002 Tax Rate Settings (GST) | SET-001 | GST-001 |
| SET-003 Invoice Number Format Settings | SET-001 | SAL-001, PUR-001 |
| SET-004 Currency & Locale Settings | SET-001 | ACC-015 |
| SET-005 Email/WhatsApp Integration Settings | SET-001 | WA-001, WA-002, WA-003, WA-004, WA-005, EML-001, EML-002, EML-003, EML-004 |
| SET-006 E-Invoice/E-Way Bill API Config | SET-001 | EINV-001, EWAY-001 |
| SET-007 Payment Gateway Config | SET-001 | PAY-001, PAY-002 |
| SET-008 Branding & Logo Settings | SET-001 | PDF-001, PDF-002 |

### Security Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| SEC-001 Change Password | AUTH-001 | SEC-003 |
| SEC-002 Two-Factor Authentication (2FA) | AUTH-001 | — |
| SEC-003 IP Whitelisting | SEC-001 | — |
| SEC-004 Login Attempt Throttling | AUTH-001 | — |
| SEC-005 Data Encryption at Rest | AUTH-001 | — |
| SEC-006 Role-Based Access Enforcement | ROL-001 | — |
| SEC-007 API Rate Limiting | API-001 | — |
| SEC-008 SSO/SAML Configuration | AUTH-001 | — |
| SEC-009 Security Audit Log | AUD-001 | — |
| SEC-010 Session Timeout Config | AUTH-001 | — |

### Mobile Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| MOB-001 Responsive Mobile UI | AUTH-001 | — |

### API Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| API-001 RESTful API with Auth | AUTH-001 | API-002, SEC-007 |
| API-002 API Key Management | API-001 | — |

### Background Jobs Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| BGJ-001 Job Queue Processing | AUTH-001 | EML-005, EML-007, WA-007, NTF-002, NTF-003, NTF-004, NTF-005, NTF-007 |

### System Module

| Feature | Depends On | Required By |
|---------|-----------|-------------|
| SYS-001 Health Check Endpoint | AUTH-001 | ADM-006 |
| SYS-002 Database Backup & Restore | AUTH-001 | — |
| SYS-003 System Configuration | AUTH-001 | — |

---

## Circular Dependency Analysis

**Circular dependencies found: 0**

All dependencies are acyclic. The dependency graph forms a Directed Acyclic Graph (DAG) rooted at `AUTH-001`.

### Potential Near-Circular Chains (Monitored)

These chains approach circularity but do not form loops:

1. `GST-001 → SAL-013 → SAL-001 → GST-001` — **Not circular**: SAL-013 depends on GST-001 (tax config), not the reverse. GST-003 depends on SAL-001 (invoice data), SAL-013 depends on GST-001 (tax rates). **Safe**.

2. `ACC-001 → PAY-001 → ACC-006 → ACC-001` — **Not circular**: ACC-006 is auto-journal (system), PAY-001 requires ACC-001 (accounts exist). **Safe**.

3. `CUS-001 → SAL-001 → ACC-004 → ACC-001` — **Linear chain**, no reverse dependency.

---

## Critical Path Analysis

### Primary Critical Path (MVP)

```
AUTH-001 ──→ ORG-001 ──→ CMP-001 ──→ SET-001
                                        │
                                        ├→ SET-003 (Invoice format)
                                        ├→ SET-005 (Integration config)
                                        ├→ SET-006 (E-Invoice config)
                                        │
USR-001 ──→ ROL-001                        │
    │              │                       │
    │         SEC-006                     │
    │                                     │
    └──→ USR-003 (Role Assignment)        │
                                          │
CUS-001 ←── ORG-001 + CMP-001 ──────→ SAL-001
SUP-001 ←── ORG-001 + CMP-001 ──────→ PUR-001
PRD-001 ←── ORG-001 + CMP-001 ──────→ INV-001
    │                                     │
    ├→ PRD-007 (HSN) ──→ GST-001 ──→ SAL-013
    │                          │     → PUR-008
    │                          │
    │                          └→ EINV-001
    │                          └→ EWAY-001
    │
    └→ WHS-001 → STK-001

ACC-001 ←── ORG-001 + CMP-001
    │
    ├→ ACC-002 → RPT-003 (Day Book)
    ├→ ACC-007 → RPT-004 (Ledger)
    ├→ ACC-008 (Trial Balance)
    ├→ ACC-009 → RPT-011 (P&L)
    ├→ ACC-010 → RPT-012 (Balance Sheet)
    │
    └→ ACC-004 ← SAL-001 (Auto-journal sales)
    └→ ACC-005 ← PUR-001 (Auto-journal purchase)

PAY-001 ← CUS-001 + ACC-001
PAY-002 ← SUP-001 + ACC-001
    │
    ├→ REC-001 (AR Aging)
    ├→ PYB-001 (AP Aging)
    ├→ PDF-004 (Payment Receipt)
    ├→ WA-004, EML-001 (Send receipts)
    └→ RPT-020 (Expense Report)

DOC-001 → DOC-002 (Attach to Invoice)
    │
    └→ PDF-001 (Sales PDF)
    └→ PDF-002 (Purchase PDF)

WA-005 + SET-005 → WA-001 (Send invoice WhatsApp)
EML-004 + SET-005 → EML-001 (Send invoice Email)

SUB-008 → SUB-001 → SUB-002 → ADM-007
                   → ADM-001

AUD-001 → SEC-009 (Security audit)
        → ADM-005 (Platform audit)
```

### Critical Path Length

| Metric | Value |
|--------|-------|
| Longest chain (by feature count) | 30 features |
| Minimum build sprints (linear) | 30 sprints |
| Parallelizable features (after core) | 192 features |
| Core blockers (must be sequential) | 85 features |
| Leaf features (no dependents) | 89 features |

### Build Phases (Parallel Tracks)

```
PHASE 1 — Foundation (Sprints 1-6)
├── Track A: AUTH-001 → ORG-001 → CMP-001 → BRN-001 → SET-001
├── Track B: USR-001 → ROL-001 → USR-003 → SEC-006
└── Track C: SUB-008 → SUB-001

PHASE 2 — Core Data (Sprints 4-10) [parallel after Phase 1]
├── Track D: CUS-001 → CUS-002..010 (customer CRUD)
├── Track E: SUP-001 → SUP-002..007 (supplier CRUD)
├── Track F: PRD-001 → PRD-002..011 (product CRUD)
├── Track G: WHS-001 → WHS-002..004 (warehouse CRUD)
└── Track H: GST-001, GST-002 (tax config)

PHASE 3 — Operations (Sprints 8-15)
├── Track I: INV-001 → INV-002..010 (inventory)
├── Track J: STK-001 → STK-002..004 (stock transfers)
├── Track K: ACC-001 → ACC-002..016 (accounting)
├── Track L: SAL-001 → SAL-002..017 (sales)
├── Track M: PUR-001 → PUR-002..008 (purchase)
└── Track N: PAY-001 → PAY-002..007 (payments)

PHASE 4 — Compliance & Delivery (Sprints 13-20)
├── Track O: GST-003..010 (GST returns)
├── Track P: EINV-001..007 (e-invoice)
├── Track Q: EWAY-001..006 (e-way bill)
├── Track R: REC-001..004, PYB-001..003 (receivables/payables)
├── Track S: DOC-001..007 (documents)
├── Track T: PDF-001..007 (PDF generation)
├── Track U: RPT-001..020 (reports)

PHASE 5 — Communication (Sprints 18-22)
├── Track V: WA-005..009, WA-001..004 (WhatsApp)
├── Track W: EML-001..007 (Email)
├── Track X: NTF-001..007 (Notifications)

PHASE 6 — Platform & Polish (Sprints 22-28)
├── Track Y: ADM-001..007 (Platform Admin)
├── Track Z: IMP-001..009, EXP-001..007 (Import/Export)
├── Track AA: AUD-001..003, SEC-001..010 (Audit/Security)
├── Track AB: SRH-001..003, DBS-001..003, MOB-001 (UI Polish)
└── Track AC: API-001..002, BGJ-001, SYS-001..003 (Infrastructure)
```

### Feature Count by Dependency Depth

Features sorted by longest dependency chain from `AUTH-001`:

| Depth | Features |
|-------|----------|
| 0 | AUTH-001 |
| 1 | AUTH-002, AUTH-004, AUTH-005, AUTH-009, ORG-001, SUB-008 |
| 2 | AUTH-003, AUTH-006, ORG-002, ORG-004, ORG-005, SUB-001, SUB-008 |
| 3 | AUTH-007, AUTH-008, AUTH-010, AUTH-011, ORG-003, CMP-001, USR-001, ROL-001, SUB-002..009 |
| 4 | BRN-001, USR-002, USR-004, USR-005, USR-006, ROL-002, ROL-005, CUS-001, SUP-001, PRD-001, WHS-001, ACC-001, SET-001, AUD-001, SEC-001, SEC-002, SEC-004, SEC-005, SEC-008, SEC-010, SRH-001, DBS-001, MOB-001, API-001, BGJ-001, SYS-001..003, ADM-001..006, NTF-001..002, NTF-006, DOC-001, IMP-001..005 |
| 5 | BRN-002..005, CUS-002..010, SUP-002..007, PRD-002..011, GST-001, INV-001, PAY-001, PAY-002, ACC-002, ACC-007..012, SET-002..008, SEC-003, SEC-006, SEC-009, ROL-003, ROL-004, SRH-002, SRH-003, DBS-002, DBS-003, API-002, ADM-007, AUD-002, AUD-003, NTF-003..005, NTF-007, DOC-002..007, IMP-006..009 |
| 6 | INV-002..010, WHS-002..004, STK-001, PAY-003..007, ACC-003, ACC-004, ACC-005, ACC-006, ACC-013..016, REC-001..003, PYB-001..002, GST-002..010, SAL-001, SAL-007, SAL-009, PUR-001, PUR-006, WA-005, EML-003, EML-004, EXP-001..003 |
| 7 | STK-002..004, SAL-002..006, SAL-008, SAL-010..017, PUR-002..005, PUR-007..008, REC-004, PYB-003, EINV-001, EWAY-001, PDF-001, PDF-002, RPT-001..007, RPT-009..015, RPT-017, RPT-020, WA-001, WA-002, WA-003, WA-004, WA-006, WA-008, WA-009, EML-001, EML-002, EML-005, EML-006, EML-007, IMP-006, IMP-007, EXP-004..007 |
| 8 | SAL-008, SAL-010, INV-006, RPT-008, RPT-016, EINV-002..007, EWAY-002..006, PDF-003..005, PDF-006, PDF-007, WA-007, RPT-018, RPT-019 |
| 9 | NTF-004, PDF-006, PDF-007 |
| 10 | — |

### Top 10 Most-Depended-On Features (High Blast Radius)

| Rank | Feature | Depended-On Count | Impact |
|------|---------|-------------------|--------|
| 1 | AUTH-001 | 28 features | Foundation of entire system |
| 2 | ORG-001 | 24 features | All org-scoped features |
| 3 | CMP-001 | 14 features | All company-scoped features |
| 4 | SAL-001 | 16 features | Sales, accounting, e-invoice, e-way, reports |
| 5 | CUS-001 | 12 features | Customers, sales, receivables |
| 6 | PRD-001 | 10 features | Products, inventory, sales, purchase |
| 7 | ACC-001 | 12 features | All accounting features |
| 8 | SET-001 | 10 features | All settings |
| 9 | GST-001 | 10 features | All GST, tax calc, e-invoice |
| 10 | SUP-001 | 7 features | Suppliers, purchase, payables |

### Top 10 Leaf Features (No Dependents — Terminal)

| Rank | Feature | Depends On | Terminal State |
|------|---------|-----------|----------------|
| 1 | AUTH-003 | AUTH-001, AUTH-002 | Standalone OTP verification |
| 2 | AUTH-007 | AUTH-006 | Standalone login tracking |
| 3 | AUTH-010 | AUTH-006 | Standalone token refresh |
| 4 | ORG-004 | ORG-001 | Terminal: org archive |
| 5 | SAL-016 | SAL-001 | Terminal: recurring invoice |
| 6 | ACC-015 | ACC-001 | Terminal: multi-currency |
| 7 | ACC-016 | ACC-001 | Terminal: cost centers |
| 8 | EINV-005 | EINV-001 | Terminal: bulk e-invoice |
| 9 | PDF-006 | PDF-001, PDF-002 | Terminal: template customization |
| 10 | SYS-002 | AUTH-001 | Terminal: backup/restore |
