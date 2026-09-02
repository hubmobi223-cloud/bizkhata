# Role × Feature Permission Matrix

> BizKhata Cloud Accounting SaaS — Complete Permission Registry
> All permissions apply at organization scope unless noted.

## Permission Model

### Role Hierarchy (Descending Privilege)

```
platform_super_admin  ←  Platform-wide access (cross-organization)
  └── owner           ←  Full org access (org creator)
       └── admin      ←  Same as owner minus org-level mutations
            └── branch_manager  ←  Admin-scoped to single branch
                 ├── accountant       ←  Accounting, invoices, reports, payments
                 ├── sales_manager    ←  Sales domain + products + customers
                 │    └── sales_user  ←  Create sales invoices, view data
                 ├── purchase_manager ←  Purchase domain + suppliers + products
                 └── inventory_manager ← Products, inventory, stock, warehouses
                      └── viewer      ←  Read-only across all modules
```

### Role Descriptions

| Role | Scope | Description |
|------|-------|-------------|
| owner | Organization | Full access to all organization features. Can archive/delete org. |
| admin | Organization | Same as owner. Cannot archive/delete organization itself. |
| accountant | Organization | Full accounting, invoices, payments, receivables, payables, GST, reports, documents. |
| sales_manager | Organization | Sales invoices, customers, products, sales reports, quotations, delivery challans. |
| sales_user | Organization | Create/view sales invoices, view customers/products. Cannot delete or modify master data. |
| purchase_manager | Organization | Purchase invoices, suppliers, products, purchase reports, purchase orders. |
| inventory_manager | Organization | Products, inventory, stock adjustments, warehouses, stock transfers. |
| branch_manager | Branch | Same as admin but scoped to assigned branch(es) only. |
| viewer | Organization | Read-only access across all modules. No create/edit/delete. |
| platform_super_admin | Platform | Platform-wide cross-organization access. Manages all orgs, users, subscriptions. |

### Column Legend

| Symbol | Meaning |
|--------|---------|
| ✓ | Full CRUD access |
| R | Read-only access |
| ✗ | No access |

---

## Complete Permission Matrix

### Authentication

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| AUTH-001 User Registration | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| AUTH-002 Email/Password Login | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| AUTH-003 OTP Verification | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| AUTH-004 Password Reset | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| AUTH-005 Google OAuth Login | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| AUTH-006 Session Management | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| AUTH-007 Multi-Device Login Tracking | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| AUTH-008 Session Revocation | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| AUTH-009 Mobile OTP Login | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| AUTH-010 Refresh Token Rotation | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| AUTH-011 Login History | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

### Organization

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| ORG-001 Create Organization | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| ORG-002 Organization Profile | ✓ | ✓ | R | R | R | R | R | R | R | ✓ |
| ORG-003 Update Organization Settings | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| ORG-004 Organization Archive | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| ORG-005 Organization Subscription Plan | ✓ | R | R | R | R | R | R | R | R | ✓ |

### Company

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| CMP-001 Create Company | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| CMP-002 Company Profile & Details | ✓ | ✓ | R | R | R | R | R | R | R | ✓ |
| CMP-003 Financial Year Settings | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | R | ✓ |
| CMP-004 Company GST Registration | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | R | ✓ |

### Branch

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| BRN-001 Create Branch | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| BRN-002 Branch Profile & Address | ✓ | ✓ | R | R | R | R | R | R | R | ✓ |
| BRN-003 Branch Activation/Deactivation | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| BRN-004 Branch-Level Inventory Settings | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | R | R | ✓ |
| BRN-005 Branch User Assignment | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | R | ✓ |

### Users

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| USR-001 Invite User | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ |
| USR-002 User Profile Management | ✓ | ✓ | R | R | R | R | R | R | R | ✓ |
| USR-003 Assign Role to User | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ |
| USR-004 Deactivate User | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ |
| USR-005 User Activity Log | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | R | ✗ | ✓ |
| USR-006 Branch Assignment to User | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ |

### Roles & Permissions

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| ROL-001 View Roles | ✓ | ✓ | R | R | R | R | R | R | R | ✓ |
| ROL-002 Create Custom Role | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| ROL-003 Edit Role Permissions | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| ROL-004 Delete Custom Role | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| ROL-005 Default Role Templates | ✓ | ✓ | R | R | R | R | R | R | R | ✓ |

### Customers

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| CUS-001 Create Customer | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ |
| CUS-002 Edit Customer | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ |
| CUS-003 Delete Customer | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| CUS-004 Customer List with Search | ✓ | ✓ | R | R | R | R | R | R | R | ✓ |
| CUS-005 Customer Ledger View | ✓ | ✓ | ✓ | ✓ | R | ✗ | ✗ | ✓ | R | ✓ |
| CUS-006 Customer Opening Balance | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | R | ✓ |
| CUS-007 Customer GSTIN Validation | ✓ | ✓ | ✓ | ✓ | R | ✗ | ✗ | ✓ | R | ✓ |
| CUS-008 Customer Credit Limit | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | R | ✓ |
| CUS-009 Customer Group/Category | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | R | ✓ |
| CUS-010 Customer Address Management | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | R | ✓ |

### Suppliers

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| SUP-001 Create Supplier | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ | ✗ | ✓ |
| SUP-002 Edit Supplier | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ | ✗ | ✓ |
| SUP-003 Delete Supplier | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| SUP-004 Supplier List with Search | ✓ | ✓ | R | R | R | R | R | R | R | ✓ |
| SUP-005 Supplier Ledger View | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ | R | ✓ |
| SUP-006 Supplier Opening Balance | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | R | ✓ |
| SUP-007 Supplier GSTIN Validation | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ | R | ✓ |

### Products

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| PRD-001 Create Product | ✓ | ✓ | ✗ | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ | ✓ |
| PRD-002 Edit Product | ✓ | ✓ | ✗ | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ | ✓ |
| PRD-003 Delete Product | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✓ |
| PRD-004 Product List with Search/Filter | ✓ | ✓ | R | R | R | R | R | R | R | ✓ |
| PRD-005 Product Categories & Hierarchy | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | R | ✓ |
| PRD-006 Product Units of Measure | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | R | ✓ |
| PRD-007 Product HSN/SAC Code Mapping | ✓ | ✓ | ✓ | ✓ | R | ✓ | ✓ | ✓ | R | ✓ |
| PRD-008 Product Pricing (MRP, Sale, Purchase) | ✓ | ✓ | ✗ | ✓ | R | ✓ | ✓ | ✓ | R | ✓ |
| PRD-009 Product Image Upload | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | R | ✓ |
| PRD-010 Product Barcode/QR Generation | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | R | ✓ |
| PRD-011 Product Tax Configuration | ✓ | ✓ | ✓ | ✓ | R | ✓ | ✓ | ✓ | R | ✓ |

### Inventory

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| INV-001 Current Stock View | ✓ | ✓ | R | R | R | R | R | R | R | ✓ |
| INV-002 Stock Adjustment (Add) | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ | ✓ |
| INV-003 Stock Adjustment (Subtract) | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ | ✓ |
| INV-004 Stock Valuation Report | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✓ | R | ✓ |
| INV-005 Stock Movement History | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | R | ✓ |
| INV-006 Low Stock Alerts | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | R | ✓ |
| INV-007 Minimum Stock Level Setup | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | R | ✓ |
| INV-008 Batch/Serial Number Tracking | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | R | ✓ |
| INV-009 Inventory Expiry Tracking | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | R | ✓ |
| INV-010 Multi-Warehouse Stock View | ✓ | ✓ | R | ✗ | ✗ | ✗ | ✓ | ✓ | R | ✓ |

### Warehouses

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| WHS-001 Create Warehouse | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ | ✓ |
| WHS-002 Edit Warehouse | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ | ✓ |
| WHS-003 Warehouse Stock Overview | ✓ | ✓ | R | ✗ | ✗ | R | ✓ | R | R | ✓ |
| WHS-004 Delete/Deactivate Warehouse | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

### Stock Transfers

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| STK-001 Create Stock Transfer | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ | ✓ |
| STK-002 Approve Stock Transfer | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✓ |
| STK-003 Transfer History | ✓ | ✓ | R | R | R | R | R | R | R | ✓ |
| STK-004 Transfer Status Tracking | ✓ | ✓ | R | R | R | R | R | R | R | ✓ |

### Sales

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| SAL-001 Create Sales Invoice | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ |
| SAL-002 Edit Sales Invoice (Draft) | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ |
| SAL-003 Delete Sales Invoice (Draft) | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| SAL-004 Sales Invoice List with Filter | ✓ | ✓ | R | R | R | R | R | R | R | ✓ |
| SAL-005 Sales Invoice PDF Generation | ✓ | ✓ | ✓ | ✓ | R | R | R | ✓ | R | ✓ |
| SAL-006 Sales Return/Credit Note | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ |
| SAL-007 Sales Quotation/Estimate | ✓ | ✓ | R | ✓ | ✓ | ✗ | ✗ | ✓ | R | ✓ |
| SAL-008 Quotation to Invoice Conversion | ✓ | ✓ | R | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ |
| SAL-009 Sales Order (Pre-invoice) | ✓ | ✓ | R | ✓ | ✓ | ✗ | R | ✓ | R | ✓ |
| SAL-010 Sales Order Fulfillment | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ | ✓ | ✓ | ✗ | ✓ |
| SAL-011 Delivery Challan | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ | R | ✓ | R | ✓ |
| SAL-012 Sales Discount Management | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ |
| SAL-013 Sales Tax/GST Calculation | ✓ | ✓ | ✓ | ✓ | R | ✗ | ✗ | ✓ | R | ✓ |
| SAL-014 Multi-Item Invoice | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | R | ✓ | R | ✓ |
| SAL-015 Invoice Duplicate/Split | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ |
| SAL-016 Recurring Sales Invoice | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | R | ✓ |
| SAL-017 Sales Invoice Due Date Tracking | ✓ | ✓ | R | R | R | R | R | R | R | ✓ |

### Purchase

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| PUR-001 Create Purchase Invoice | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ | ✗ | ✓ |
| PUR-002 Edit Purchase Invoice (Draft) | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ | ✗ | ✓ |
| PUR-003 Delete Purchase Invoice (Draft) | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✓ |
| PUR-004 Purchase Invoice List with Filter | ✓ | ✓ | R | R | R | R | R | R | R | ✓ |
| PUR-005 Purchase Return/Debit Note | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ | ✗ | ✓ |
| PUR-006 Purchase Order | ✓ | ✓ | R | ✗ | ✗ | ✓ | ✗ | ✓ | R | ✓ |
| PUR-007 Purchase Invoice PDF Generation | ✓ | ✓ | ✓ | R | R | ✓ | R | ✓ | R | ✓ |
| PUR-008 Purchase Tax/GST Calculation | ✓ | ✓ | ✓ | R | R | ✓ | R | ✓ | R | ✓ |

### Accounting

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| ACC-001 Chart of Accounts | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | R | ✓ |
| ACC-002 Create Journal Entry | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ |
| ACC-003 Edit Journal Entry (Draft) | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ |
| ACC-004 Auto Journal from Sales | system | system | system | system | system | system | system | system | system | system |
| ACC-005 Auto Journal from Purchase | system | system | system | system | system | system | system | system | system | system |
| ACC-006 Auto Journal from Payments | system | system | system | system | system | system | system | system | system | system |
| ACC-007 Ledger Account View | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | R | ✓ |
| ACC-008 Trial Balance | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | R | ✓ |
| ACC-009 Profit & Loss Statement | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | R | ✓ |
| ACC-010 Balance Sheet | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | R | ✓ |
| ACC-011 Cash Flow Statement | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | R | ✓ |
| ACC-012 Account Group Management | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | R | ✓ |
| ACC-013 Account Opening Balance | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | R | ✓ |
| ACC-014 Financial Period Close/Year End | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| ACC-015 Multi-Currency Support | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | R | ✓ |
| ACC-016 Cost Center Tracking | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | R | ✓ |

### Payments

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| PAY-001 Record Payment Received | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ |
| PAY-002 Record Payment Made | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ | ✗ | ✓ |
| PAY-003 Payment List & History | ✓ | ✓ | R | R | R | R | R | R | R | ✓ |
| PAY-004 Payment Receipt PDF | ✓ | ✓ | ✓ | R | R | R | R | ✓ | R | ✓ |
| PAY-005 Bank Account Management | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | R | ✓ |
| PAY-006 UPI/NEFT/RTGS Reference Tracking | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | R | ✓ |
| PAY-007 Petty Cash Management | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | R | ✓ |

### Receivables

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| REC-001 Accounts Receivable Aging Report | ✓ | ✓ | ✓ | ✓ | R | ✗ | ✗ | ✓ | R | ✓ |
| REC-002 Send Payment Reminder | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ |
| REC-003 Customer Outstanding Summary | ✓ | ✓ | ✓ | ✓ | R | ✗ | ✗ | ✓ | R | ✓ |
| REC-004 Bulk Payment Allocation | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

### Payables

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| PYB-001 Accounts Payable Aging Report | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ | R | ✓ |
| PYB-002 Supplier Outstanding Summary | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ | R | ✓ |
| PYB-003 Schedule Supplier Payments | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ | ✗ | ✓ |

### GST

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| GST-001 GST Tax Slab Setup | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | R | ✓ |
| GST-002 GSTIN Verification (API) | ✓ | ✓ | ✓ | R | R | R | R | ✓ | R | ✓ |
| GST-003 GSTR-1 Return Data | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | R | ✓ |
| GST-004 GSTR-3B Return Data | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | R | ✓ |
| GST-005 GST Input Tax Credit (ITC) | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | R | ✓ |
| GST-006 GST Reconciliation | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | R | ✓ |
| GST-007 TDS/TCS Management | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | R | ✓ |
| GST-008 GST State-Wise Report | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | R | ✓ |
| GST-009 GST Summary Dashboard | ✓ | ✓ | ✓ | R | R | R | R | ✓ | R | ✓ |
| GST-010 Reverse Charge Mechanism | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | R | ✓ |

### E-Invoice

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| EINV-001 Generate E-Invoice (IRN) | ✓ | ✓ | ✓ | R | R | R | R | ✓ | ✗ | ✓ |
| EINV-002 Cancel E-Invoice | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| EINV-003 E-Invoice QR Code | ✓ | ✓ | ✓ | R | R | R | R | ✓ | R | ✓ |
| EINV-004 E-Invoice Status Check | ✓ | ✓ | R | R | R | R | R | R | R | ✓ |
| EINV-005 Bulk E-Invoice Generation | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| EINV-006 E-Invoice Error Handling | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| EINV-007 E-Invoice Print with QR | ✓ | ✓ | ✓ | R | R | R | R | ✓ | R | ✓ |

### E-Way Bill

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| EWAY-001 Generate E-Way Bill | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ |
| EWAY-002 Cancel E-Way Bill | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| EWAY-003 E-Way Bill List & Status | ✓ | ✓ | R | R | R | R | R | R | R | ✓ |
| EWAY-004 Multi-Vehicle E-Way Bill | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| EWAY-005 E-Way Bill Extension | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| EWAY-006 E-Way Bill Print/Download | ✓ | ✓ | ✓ | ✓ | R | R | R | ✓ | R | ✓ |

### Reports

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| RPT-001 Sales Register | ✓ | ✓ | ✓ | ✓ | R | ✗ | ✗ | ✓ | R | ✓ |
| RPT-002 Purchase Register | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ | R | ✓ |
| RPT-003 Day Book | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | R | ✓ |
| RPT-004 Ledger Report (Account-wise) | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | R | ✓ |
| RPT-005 Customer Outstanding Report | ✓ | ✓ | ✓ | ✓ | R | ✗ | ✗ | ✓ | R | ✓ |
| RPT-006 Supplier Outstanding Report | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ | R | ✓ |
| RPT-007 Stock Summary Report | ✓ | ✓ | R | R | R | R | ✓ | ✓ | R | ✓ |
| RPT-008 Stock Movement Report | ✓ | ✓ | R | ✗ | ✗ | R | ✓ | ✓ | R | ✓ |
| RPT-009 GST Summary Report (GSTR-1) | ✓ | ✓ | ✓ | R | R | R | R | ✓ | R | ✓ |
| RPT-010 GST Summary Report (GSTR-3B) | ✓ | ✓ | ✓ | R | R | R | R | ✓ | R | ✓ |
| RPT-011 Profit & Loss Report | ✓ | ✓ | ✓ | R | R | R | R | ✓ | R | ✓ |
| RPT-012 Balance Sheet Report | ✓ | ✓ | ✓ | R | R | R | R | ✓ | R | ✓ |
| RPT-013 Cash Flow Report | ✓ | ✓ | ✓ | R | R | R | R | ✓ | R | ✓ |
| RPT-014 Tax Audit Report | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | R | ✓ |
| RPT-015 Sales vs Purchase Comparison | ✓ | ✓ | ✓ | ✓ | R | ✓ | R | ✓ | R | ✓ |
| RPT-016 Monthly/Quarterly Summary | ✓ | ✓ | ✓ | R | R | R | R | ✓ | R | ✓ |
| RPT-017 Custom Report Builder | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | R | ✓ |
| RPT-018 E-Invoice Report | ✓ | ✓ | ✓ | R | R | R | R | ✓ | R | ✓ |
| RPT-019 E-Way Bill Report | ✓ | ✓ | ✓ | R | R | R | R | ✓ | R | ✓ |
| RPT-020 Expense Report | ✓ | ✓ | ✓ | R | R | R | R | ✓ | R | ✓ |

### Documents

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| DOC-001 Upload Document | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ |
| DOC-002 Attach to Invoice | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ |
| DOC-003 Document Gallery View | ✓ | ✓ | R | R | R | R | R | R | R | ✓ |
| DOC-004 Document Search | ✓ | ✓ | R | R | R | R | R | R | R | ✓ |
| DOC-005 Document Versioning | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| DOC-006 Share Document Link | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| DOC-007 Delete Document | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

### PDF Generation

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| PDF-001 Sales Invoice PDF | ✓ | ✓ | ✓ | ✓ | R | R | R | ✓ | R | ✓ |
| PDF-002 Purchase Invoice PDF | ✓ | ✓ | ✓ | R | R | ✓ | R | ✓ | R | ✓ |
| PDF-003 Quotation/Estimate PDF | ✓ | ✓ | R | ✓ | R | R | R | ✓ | R | ✓ |
| PDF-004 Payment Receipt PDF | ✓ | ✓ | ✓ | R | R | R | R | ✓ | R | ✓ |
| PDF-005 Delivery Challan PDF | ✓ | ✓ | R | ✓ | R | R | R | ✓ | R | ✓ |
| PDF-006 PDF Template Customization | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| PDF-007 Bulk PDF Export | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

### WhatsApp

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| WA-001 Send Invoice via WhatsApp | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ |
| WA-002 Send Payment Reminder via WhatsApp | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ |
| WA-003 Send Quotation via WhatsApp | ✓ | ✓ | R | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ |
| WA-004 Send Payment Receipt via WhatsApp | ✓ | ✓ | ✓ | R | R | R | R | ✓ | ✗ | ✓ |
| WA-005 WhatsApp Business API Config | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| WA-006 WhatsApp Message Templates | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| WA-007 Bulk WhatsApp (Invoice Batch) | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| WA-008 WhatsApp Chat History | ✓ | ✓ | R | R | R | R | R | R | R | ✓ |
| WA-009 WhatsApp Delivery Status | ✓ | ✓ | R | R | R | R | R | R | R | ✓ |

### Email

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| EML-001 Send Invoice via Email | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ |
| EML-002 Send Payment Reminder via Email | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ |
| EML-003 Email Template Management | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| EML-004 SMTP/Email Service Config | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| EML-005 Email Scheduling | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| EML-006 Email Delivery Tracking | ✓ | ✓ | R | R | R | R | R | R | R | ✓ |
| EML-007 Bulk Email (Invoice Batch) | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

### Notifications

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| NTF-001 In-App Notification Center | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| NTF-002 Email Notifications | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| NTF-003 Payment Due Notifications | ✓ | ✓ | ✓ | ✓ | R | ✓ | R | ✓ | R | ✓ |
| NTF-004 Low Stock Notifications | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | R | ✓ |
| NTF-005 Subscription Expiry Notifications | ✓ | ✓ | R | R | R | R | R | R | R | ✓ |
| NTF-006 Notification Preferences | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| NTF-007 GST Return Filing Reminder | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | R | ✓ |

### Import

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| IMP-001 Import Customers (CSV/Excel) | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| IMP-002 Import Suppliers (CSV/Excel) | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| IMP-003 Import Products (CSV/Excel) | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✓ |
| IMP-004 Import Opening Balances | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| IMP-005 Import Chart of Accounts | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| IMP-006 Import Sales Invoices | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| IMP-007 Import Purchase Invoices | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| IMP-008 Import Validation & Error Preview | ✓ | ✓ | R | R | R | R | R | R | R | ✓ |
| IMP-009 Import Template Download | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Export

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| EXP-001 Export Customers (CSV/Excel) | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ |
| EXP-002 Export Suppliers (CSV/Excel) | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ |
| EXP-003 Export Products (CSV/Excel) | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ | ✓ |
| EXP-004 Export Sales Register (CSV/Excel) | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ |
| EXP-005 Export Purchase Register (CSV/Excel) | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ | ✗ | ✓ |
| EXP-006 Export GST Returns (JSON/CSV) | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ |
| EXP-007 Export Stock Report (CSV/Excel) | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ | ✓ |

### Subscription

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| SUB-001 View Current Plan | ✓ | R | R | R | R | R | R | R | R | ✓ |
| SUB-002 Upgrade Plan | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| SUB-003 Downgrade Plan | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| SUB-004 Payment History | ✓ | R | R | R | R | R | R | R | R | ✓ |
| SUB-005 Invoice for Subscription | ✓ | R | R | R | R | R | R | R | R | ✓ |
| SUB-006 Feature Gate Enforcement | system | system | system | system | system | system | system | system | system | system |
| SUB-007 Usage Metering | system | system | system | system | system | system | system | system | system | system |
| SUB-008 Trial Period Management | system | system | system | system | system | system | system | system | system | system |
| SUB-009 Auto-Renewal Toggle | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

### Platform Admin

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| ADM-001 Platform Dashboard | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| ADM-002 Organization List & Management | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| ADM-003 User List & Management | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| ADM-004 Subscription Plan Management | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| ADM-005 Platform Audit Log | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| ADM-006 System Health Monitoring | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| ADM-007 Force Subscription Override | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

### Audit

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| AUD-001 Audit Trail Viewer | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | R | ✗ | ✓ |
| AUD-002 Activity Log Export | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| AUD-003 Critical Action Alert Log | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

### Search

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| SRH-001 Global Search | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SRH-002 Search Suggestions/Autocomplete | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SRH-003 Search History | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Dashboard

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| DBS-001 Main Dashboard | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | R | ✓ |
| DBS-002 Sales Dashboard Widgets | ✓ | ✓ | R | ✓ | R | R | R | R | R | ✓ |
| DBS-003 Financial Summary Widgets | ✓ | ✓ | ✓ | R | R | R | R | R | R | ✓ |

### Settings

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| SET-001 Company Profile Settings | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | R | ✓ |
| SET-002 Tax Rate Settings (GST) | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | R | ✓ |
| SET-003 Invoice Number Format Settings | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | R | ✓ |
| SET-004 Currency & Locale Settings | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | R | ✓ |
| SET-005 Email/WhatsApp Integration Settings | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | R | ✓ |
| SET-006 E-Invoice/E-Way Bill API Config | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | R | ✓ |
| SET-007 Payment Gateway Config | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | R | ✓ |
| SET-008 Branding & Logo Settings | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | R | ✓ |

### Security

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| SEC-001 Change Password | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SEC-002 Two-Factor Authentication (2FA) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SEC-003 IP Whitelisting | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| SEC-004 Login Attempt Throttling | system | system | system | system | system | system | system | system | system | system |
| SEC-005 Data Encryption at Rest | system | system | system | system | system | system | system | system | system | system |
| SEC-006 Role-Based Access Enforcement | system | system | system | system | system | system | system | system | system | system |
| SEC-007 API Rate Limiting | system | system | system | system | system | system | system | system | system | system |
| SEC-008 SSO/SAML Configuration | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| SEC-009 Security Audit Log | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | R | ✗ | ✓ |
| SEC-010 Session Timeout Config | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | R | ✓ |

### Mobile

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| MOB-001 Responsive Mobile UI | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### API

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| API-001 RESTful API with Auth | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | R | ✓ |
| API-002 API Key Management | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

### Background Jobs

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| BGJ-001 Job Queue Processing | system | system | system | system | system | system | system | system | system | system |

### System

| Feature | Owner | Admin | Accountant | Sales Mgr | Sales User | Purchase Mgr | Inventory Mgr | Branch Mgr | Viewer | Super Admin |
|---------|-------|-------|------------|-----------|------------|--------------|---------------|------------|--------|-------------|
| SYS-001 Health Check Endpoint | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SYS-002 Database Backup & Restore | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| SYS-003 System Configuration | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

---

## Permission Summary by Role

| Role | Full (✓) | Read-Only (R) | Denied (✗) | System | Total Accessible |
|------|----------|---------------|------------|--------|-----------------|
| owner | 238 | 24 | 12 | 3 | 262/277 |
| admin | 197 | 40 | 37 | 3 | 237/277 |
| accountant | 112 | 68 | 94 | 3 | 180/277 |
| sales_manager | 63 | 61 | 150 | 3 | 124/277 |
| sales_user | 20 | 62 | 192 | 3 | 82/277 |
| purchase_manager | 56 | 58 | 160 | 3 | 114/277 |
| inventory_manager | 48 | 52 | 174 | 3 | 100/277 |
| branch_manager | 88 | 52 | 134 | 3 | 140/277 |
| viewer | 2 | 158 | 114 | 3 | 160/277 |
| platform_super_admin | 248 | 14 | 12 | 3 | 262/277 |

### Notes

1. **`system`** — These features execute automatically (auto-journals, gate enforcement, encryption, rate limiting). No role interacts with them directly.
2. **`platform_super_admin`** — Has full access to all org-scoped features **and** exclusive access to ADM-* (platform admin) features. Cannot be assigned within an organization.
3. **`viewer`** — Read-only (`R`) across all modules. The only `✓` permissions are for personal security features (SEC-001, SEC-002) and search/dashboard read access.
4. **`branch_manager`** — Permissions are identical to `admin` in structure but **data-scoped** to their assigned branch(es) at the application layer.
5. **`owner` vs `admin`** — Only difference: ORG-001 (Create), ORG-004 (Archive), and ROL-002/003/004 (Custom Role CRUD) are restricted.
6. **Sales + Purchase overlap** — `sales_manager` can view purchase register (RPT-002) as read-only; `purchase_manager` can view sales register (RPT-001) as read-only.
7. **Accountant privileged** — Has full access to all financial features (ACC-*, PAY-*, REC-*, PYB-*, GST-*, reports) and can create/edit invoices in both sales and purchase modules.
