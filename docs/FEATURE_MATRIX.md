# Feature Matrix

> BizKhata Cloud Accounting SaaS — Complete Feature Registry
> Auto-generated for Chapter 2 deliverables. All features status: PLANNED.

## Legend

| Column | Values | Description |
|--------|--------|-------------|
| Priority | P0 / P1 / P2 | P0 = MVP blocker, P1 = launch required, P2 = post-MVP |
| Maturity | MVP / V1 / V2 | MVP = ship-or-die, V1 = first release, V2 = enhanced |
| API | ✓ / ✗ | Has REST/GraphQL endpoint |
| UI | ✓ / ✗ | Has frontend screen/component |
| DB | ✓ / ✗ | Writes to database |
| Audit | ✓ / ✗ | Requires audit log entry |
| Tests | ✓ / ✗ | Requires unit/integration tests |
| Status | PLANNED / IN_PROGRESS / DONE | Current implementation status |

---

## Complete Feature Registry

### Authentication (AUTH)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| AUTH-001 | Authentication | User Registration | P0 | MVP | all | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| AUTH-002 | Authentication | Email/Password Login | P0 | MVP | all | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| AUTH-003 | Authentication | OTP Verification | P0 | MVP | all | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| AUTH-004 | Authentication | Password Reset | P0 | MVP | all | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| AUTH-005 | Authentication | Google OAuth Login | P1 | V1 | all | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| AUTH-006 | Authentication | Session Management | P0 | MVP | all | ✓ | ✗ | ✓ | ✓ | ✓ | PLANNED |
| AUTH-007 | Authentication | Multi-Device Login Tracking | P1 | V1 | admin, owner | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| AUTH-008 | Authentication | Session Revocation | P0 | MVP | all | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| AUTH-009 | Authentication | Mobile OTP Login | P1 | V1 | all | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| AUTH-010 | Authentication | Refresh Token Rotation | P0 | MVP | all | ✓ | ✗ | ✓ | ✓ | ✓ | PLANNED |
| AUTH-011 | Authentication | Login History | P2 | V2 | admin, owner | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |

### Organization (ORG)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| ORG-001 | Organization | Create Organization | P0 | MVP | owner | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| ORG-002 | Organization | Organization Profile | P0 | MVP | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| ORG-003 | Organization | Update Organization Settings | P0 | MVP | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| ORG-004 | Organization | Organization Archive | P2 | V2 | owner | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| ORG-005 | Organization | Organization Subscription Plan | P0 | MVP | owner | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |

### Company (CMP)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| CMP-001 | Company | Create Company | P0 | MVP | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| CMP-002 | Company | Company Profile & Details | P0 | MVP | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| CMP-003 | Company | Financial Year Settings | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| CMP-004 | Company | Company GST Registration | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |

### Branch (BRN)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| BRN-001 | Branch | Create Branch | P0 | MVP | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| BRN-002 | Branch | Branch Profile & Address | P0 | MVP | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| BRN-003 | Branch | Branch Activation/Deactivation | P1 | V1 | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| BRN-004 | Branch | Branch-Level Inventory Settings | P1 | V1 | owner, admin, inventory_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| BRN-005 | Branch | Branch User Assignment | P0 | MVP | owner, admin, branch_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |

### Users (USR)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| USR-001 | Users | Invite User | P0 | MVP | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| USR-002 | Users | User Profile Management | P0 | MVP | all | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| USR-003 | Users | Assign Role to User | P0 | MVP | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| USR-004 | Users | Deactivate User | P1 | V1 | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| USR-005 | Users | User Activity Log | P1 | V1 | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| USR-006 | Users | Branch Assignment to User | P0 | MVP | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |

### Roles & Permissions (ROL)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| ROL-001 | Roles | View Roles | P0 | MVP | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| ROL-002 | Roles | Create Custom Role | P1 | V1 | owner | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| ROL-003 | Roles | Edit Role Permissions | P1 | V1 | owner | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| ROL-004 | Roles | Delete Custom Role | P2 | V2 | owner | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| ROL-005 | Roles | Default Role Templates | P0 | MVP | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |

### Customers (CUS)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| CUS-001 | Customers | Create Customer | P0 | MVP | owner, admin, accountant, sales_manager, sales_user | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| CUS-002 | Customers | Edit Customer | P0 | MVP | owner, admin, accountant, sales_manager, sales_user | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| CUS-003 | Customers | Delete Customer | P1 | V1 | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| CUS-004 | Customers | Customer List with Search | P0 | MVP | all | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| CUS-005 | Customers | Customer Ledger View | P0 | MVP | owner, admin, accountant, sales_manager | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| CUS-006 | Customers | Customer Opening Balance | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| CUS-007 | Customers | Customer GSTIN Validation | P0 | MVP | owner, admin, accountant, sales_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| CUS-008 | Customers | Customer Credit Limit | P1 | V1 | owner, admin, sales_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| CUS-009 | Customers | Customer Group/Category | P2 | V2 | owner, admin, sales_manager | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| CUS-010 | Customers | Customer Address Management | P0 | MVP | owner, admin, accountant, sales_manager, sales_user | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |

### Suppliers (SUP)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| SUP-001 | Suppliers | Create Supplier | P0 | MVP | owner, admin, accountant, purchase_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SUP-002 | Suppliers | Edit Supplier | P0 | MVP | owner, admin, accountant, purchase_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SUP-003 | Suppliers | Delete Supplier | P1 | V1 | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SUP-004 | Suppliers | Supplier List with Search | P0 | MVP | all | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| SUP-005 | Suppliers | Supplier Ledger View | P0 | MVP | owner, admin, accountant, purchase_manager | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| SUP-006 | Suppliers | Supplier Opening Balance | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SUP-007 | Suppliers | Supplier GSTIN Validation | P0 | MVP | owner, admin, accountant, purchase_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |

### Products (PRD)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| PRD-001 | Products | Create Product | P0 | MVP | owner, admin, inventory_manager, sales_manager, purchase_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| PRD-002 | Products | Edit Product | P0 | MVP | owner, admin, inventory_manager, sales_manager, purchase_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| PRD-003 | Products | Delete Product | P1 | V1 | owner, admin, inventory_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| PRD-004 | Products | Product List with Search/Filter | P0 | MVP | all | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| PRD-005 | Products | Product Categories & Hierarchy | P0 | MVP | owner, admin, inventory_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| PRD-006 | Products | Product Units of Measure | P0 | MVP | owner, admin, inventory_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| PRD-007 | Products | Product HSN/SAC Code Mapping | P0 | MVP | owner, admin, inventory_manager, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| PRD-008 | Products | Product Pricing (MRP, Sale, Purchase) | P0 | MVP | owner, admin, inventory_manager, sales_manager, purchase_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| PRD-009 | Products | Product Image Upload | P2 | V2 | owner, admin, inventory_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| PRD-010 | Products | Product Barcode/QR Generation | P2 | V2 | owner, admin, inventory_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| PRD-011 | Products | Product Tax Configuration | P0 | MVP | owner, admin, accountant, inventory_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |

### Inventory (INV)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| INV-001 | Inventory | Current Stock View | P0 | MVP | owner, admin, inventory_manager, sales_manager | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| INV-002 | Inventory | Stock Adjustment (Add) | P0 | MVP | owner, admin, inventory_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| INV-003 | Inventory | Stock Adjustment (Subtract) | P0 | MVP | owner, admin, inventory_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| INV-004 | Inventory | Stock Valuation Report | P0 | MVP | owner, admin, accountant, inventory_manager | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| INV-005 | Inventory | Stock Movement History | P0 | MVP | owner, admin, inventory_manager | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| INV-006 | Inventory | Low Stock Alerts | P1 | V1 | owner, admin, inventory_manager | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| INV-007 | Inventory | Minimum Stock Level Setup | P1 | V1 | owner, admin, inventory_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| INV-008 | Inventory | Batch/Serial Number Tracking | P2 | V2 | owner, admin, inventory_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| INV-009 | Inventory | Inventory Expiry Tracking | P2 | V2 | owner, admin, inventory_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| INV-010 | Inventory | Multi-Warehouse Stock View | P1 | V1 | owner, admin, inventory_manager | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |

### Warehouses (WHS)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| WHS-001 | Warehouses | Create Warehouse | P1 | V1 | owner, admin, inventory_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| WHS-002 | Warehouses | Edit Warehouse | P1 | V1 | owner, admin, inventory_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| WHS-003 | Warehouses | Warehouse Stock Overview | P1 | V1 | owner, admin, inventory_manager | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| WHS-004 | Warehouses | Delete/Deactivate Warehouse | P2 | V2 | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |

### Stock Transfers (STK)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| STK-001 | Stock Transfers | Create Stock Transfer | P1 | V1 | owner, admin, inventory_manager, branch_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| STK-002 | Stock Transfers | Approve Stock Transfer | P1 | V1 | owner, admin, inventory_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| STK-003 | Stock Transfers | Transfer History | P1 | V1 | all | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| STK-004 | Stock Transfers | Transfer Status Tracking | P1 | V1 | all | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |

### Sales (SAL)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| SAL-001 | Sales | Create Sales Invoice | P0 | MVP | owner, admin, accountant, sales_manager, sales_user | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SAL-002 | Sales | Edit Sales Invoice (Draft) | P0 | MVP | owner, admin, accountant, sales_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SAL-003 | Sales | Delete Sales Invoice (Draft) | P1 | V1 | owner, admin, sales_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SAL-004 | Sales | Sales Invoice List with Filter | P0 | MVP | all | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| SAL-005 | Sales | Sales Invoice PDF Generation | P0 | MVP | all | ✓ | ✓ | ✗ | ✗ | ✓ | PLANNED |
| SAL-006 | Sales | Sales Return/Credit Note | P0 | MVP | owner, admin, accountant, sales_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SAL-007 | Sales | Sales Quotation/Estimate | P1 | V1 | owner, admin, sales_manager, sales_user | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SAL-008 | Sales | Quotation to Invoice Conversion | P1 | V1 | owner, admin, sales_manager, sales_user | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SAL-009 | Sales | Sales Order (Pre-invoice) | P1 | V1 | owner, admin, sales_manager, sales_user | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SAL-010 | Sales | Sales Order Fulfillment | P1 | V1 | owner, admin, sales_manager, inventory_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SAL-011 | Sales | Delivery Challan | P1 | V1 | owner, admin, sales_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SAL-012 | Sales | Sales Discount Management | P0 | MVP | owner, admin, accountant, sales_manager, sales_user | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SAL-013 | Sales | Sales Tax/GST Calculation | P0 | MVP | owner, admin, accountant, sales_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SAL-014 | Sales | Multi-Item Invoice | P0 | MVP | owner, admin, accountant, sales_manager, sales_user | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SAL-015 | Sales | Invoice Duplicate/Split | P2 | V2 | owner, admin, accountant, sales_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SAL-016 | Sales | Recurring Sales Invoice | P2 | V2 | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SAL-017 | Sales | Sales Invoice Due Date Tracking | P0 | MVP | all | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |

### Purchase (PUR)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| PUR-001 | Purchase | Create Purchase Invoice | P0 | MVP | owner, admin, accountant, purchase_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| PUR-002 | Purchase | Edit Purchase Invoice (Draft) | P0 | MVP | owner, admin, accountant, purchase_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| PUR-003 | Purchase | Delete Purchase Invoice (Draft) | P1 | V1 | owner, admin, purchase_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| PUR-004 | Purchase | Purchase Invoice List with Filter | P0 | MVP | all | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| PUR-005 | Purchase | Purchase Return/Debit Note | P0 | MVP | owner, admin, accountant, purchase_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| PUR-006 | Purchase | Purchase Order | P1 | V1 | owner, admin, purchase_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| PUR-007 | Purchase | Purchase Invoice PDF Generation | P0 | MVP | all | ✓ | ✓ | ✗ | ✗ | ✓ | PLANNED |
| PUR-008 | Purchase | Purchase Tax/GST Calculation | P0 | MVP | owner, admin, accountant, purchase_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |

### Accounting (ACC)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| ACC-001 | Accounting | Chart of Accounts | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| ACC-002 | Accounting | Create Journal Entry | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| ACC-003 | Accounting | Edit Journal Entry (Draft) | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| ACC-004 | Accounting | Auto Journal from Sales | P0 | MVP | system | ✓ | ✗ | ✓ | ✓ | ✓ | PLANNED |
| ACC-005 | Accounting | Auto Journal from Purchase | P0 | MVP | system | ✓ | ✗ | ✓ | ✓ | ✓ | PLANNED |
| ACC-006 | Accounting | Auto Journal from Payments | P0 | MVP | system | ✓ | ✗ | ✓ | ✓ | ✓ | PLANNED |
| ACC-007 | Accounting | Ledger Account View | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| ACC-008 | Accounting | Trial Balance | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| ACC-009 | Accounting | Profit & Loss Statement | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| ACC-010 | Accounting | Balance Sheet | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| ACC-011 | Accounting | Cash Flow Statement | P1 | V1 | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| ACC-012 | Accounting | Account Group Management | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| ACC-013 | Accounting | Account Opening Balance | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| ACC-014 | Accounting | Financial Period Close/Year End | P1 | V1 | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| ACC-015 | Accounting | Multi-Currency Support | P2 | V2 | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| ACC-016 | Accounting | Cost Center Tracking | P2 | V2 | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |

### Payments (PAY)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| PAY-001 | Payments | Record Payment Received | P0 | MVP | owner, admin, accountant, sales_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| PAY-002 | Payments | Record Payment Made | P0 | MVP | owner, admin, accountant, purchase_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| PAY-003 | Payments | Payment List & History | P0 | MVP | all | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| PAY-004 | Payments | Payment Receipt PDF | P0 | MVP | all | ✓ | ✓ | ✗ | ✗ | ✓ | PLANNED |
| PAY-005 | Payments | Bank Account Management | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| PAY-006 | Payments | UPI/NEFT/RTGS Reference Tracking | P1 | V1 | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| PAY-007 | Payments | Petty Cash Management | P2 | V2 | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |

### Receivables (REC)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| REC-001 | Receivables | Accounts Receivable Aging Report | P0 | MVP | owner, admin, accountant, sales_manager | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| REC-002 | Receivables | Send Payment Reminder | P1 | V1 | owner, admin, accountant, sales_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| REC-003 | Receivables | Customer Outstanding Summary | P0 | MVP | owner, admin, accountant, sales_manager | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| REC-004 | Receivables | Bulk Payment Allocation | P2 | V2 | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |

### Payables (PYB)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| PYB-001 | Payables | Accounts Payable Aging Report | P0 | MVP | owner, admin, accountant, purchase_manager | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| PYB-002 | Payables | Supplier Outstanding Summary | P0 | MVP | owner, admin, accountant, purchase_manager | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| PYB-003 | Payables | Schedule Supplier Payments | P1 | V1 | owner, admin, accountant, purchase_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |

### GST (GST)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| GST-001 | GST | GST Tax Slab Setup | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| GST-002 | GST | GSTIN Verification (API) | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| GST-003 | GST | GSTR-1 Return Data | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| GST-004 | GST | GSTR-3B Return Data | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| GST-005 | GST | GST Input Tax Credit (ITC) | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| GST-006 | GST | GST Reconciliation | P1 | V1 | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| GST-007 | GST | TDS/TCS Management | P2 | V2 | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| GST-008 | GST | GST State-Wise Report | P1 | V1 | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| GST-009 | GST | GST Summary Dashboard | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| GST-010 | GST | Reverse Charge Mechanism | P2 | V2 | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |

### E-Invoice (EINV)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| EINV-001 | E-Invoice | Generate E-Invoice (IRN) | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| EINV-002 | E-Invoice | Cancel E-Invoice | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| EINV-003 | E-Invoice | E-Invoice QR Code | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| EINV-004 | E-Invoice | E-Invoice Status Check | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| EINV-005 | E-Invoice | Bulk E-Invoice Generation | P1 | V1 | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| EINV-006 | E-Invoice | E-Invoice Error Handling | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| EINV-007 | E-Invoice | E-Invoice Print with QR | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |

### E-Way Bill (EWAY)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| EWAY-001 | E-Way Bill | Generate E-Way Bill | P0 | MVP | owner, admin, accountant, sales_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| EWAY-002 | E-Way Bill | Cancel E-Way Bill | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| EWAY-003 | E-Way Bill | E-Way Bill List & Status | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| EWAY-004 | E-Way Bill | Multi-Vehicle E-Way Bill | P2 | V2 | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| EWAY-005 | E-Way Bill | E-Way Bill Extension | P1 | V1 | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| EWAY-006 | E-Way Bill | E-Way Bill Print/Download | P0 | MVP | owner, admin, accountant, sales_manager | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |

### Reports (RPT)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| RPT-001 | Reports | Sales Register | P0 | MVP | owner, admin, accountant, sales_manager | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| RPT-002 | Reports | Purchase Register | P0 | MVP | owner, admin, accountant, purchase_manager | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| RPT-003 | Reports | Day Book | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| RPT-004 | Reports | Ledger Report (Account-wise) | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| RPT-005 | Reports | Customer Outstanding Report | P0 | MVP | owner, admin, accountant, sales_manager | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| RPT-006 | Reports | Supplier Outstanding Report | P0 | MVP | owner, admin, accountant, purchase_manager | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| RPT-007 | Reports | Stock Summary Report | P0 | MVP | owner, admin, inventory_manager | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| RPT-008 | Reports | Stock Movement Report | P1 | V1 | owner, admin, inventory_manager | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| RPT-009 | Reports | GST Summary Report (GSTR-1) | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| RPT-010 | Reports | GST Summary Report (GSTR-3B) | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| RPT-011 | Reports | Profit & Loss Report | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| RPT-012 | Reports | Balance Sheet Report | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| RPT-013 | Reports | Cash Flow Report | P1 | V1 | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| RPT-014 | Reports | Tax Audit Report | P2 | V2 | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| RPT-015 | Reports | Sales vs Purchase Comparison | P1 | V1 | owner, admin, accountant, sales_manager | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| RPT-016 | Reports | Monthly/Quarterly Summary | P1 | V1 | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| RPT-017 | Reports | Custom Report Builder | P2 | V2 | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| RPT-018 | Reports | E-Invoice Report | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| RPT-019 | Reports | E-Way Bill Report | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| RPT-020 | Reports | Expense Report | P1 | V1 | owner, admin, accountant | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |

### Documents (DOC)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| DOC-001 | Documents | Upload Document | P0 | MVP | owner, admin, accountant, sales_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| DOC-002 | Documents | Attach to Invoice | P0 | MVP | owner, admin, accountant, sales_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| DOC-003 | Documents | Document Gallery View | P1 | V1 | all | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| DOC-004 | Documents | Document Search | P1 | V1 | all | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| DOC-005 | Documents | Document Versioning | P2 | V2 | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| DOC-006 | Documents | Share Document Link | P2 | V2 | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| DOC-007 | Documents | Delete Document | P1 | V1 | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |

### PDF Generation (PDF)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| PDF-001 | PDF | Sales Invoice PDF | P0 | MVP | all | ✓ | ✓ | ✗ | ✗ | ✓ | PLANNED |
| PDF-002 | PDF | Purchase Invoice PDF | P0 | MVP | all | ✓ | ✓ | ✗ | ✗ | ✓ | PLANNED |
| PDF-003 | PDF | Quotation/Estimate PDF | P1 | V1 | all | ✓ | ✓ | ✗ | ✗ | ✓ | PLANNED |
| PDF-004 | PDF | Payment Receipt PDF | P0 | MVP | all | ✓ | ✓ | ✗ | ✗ | ✓ | PLANNED |
| PDF-005 | PDF | Delivery Challan PDF | P1 | V1 | all | ✓ | ✓ | ✗ | ✗ | ✓ | PLANNED |
| PDF-006 | PDF | PDF Template Customization | P2 | V2 | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| PDF-007 | PDF | Bulk PDF Export | P2 | V2 | owner, admin, accountant | ✓ | ✓ | ✗ | ✗ | ✓ | PLANNED |

### WhatsApp (WA)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| WA-001 | WhatsApp | Send Invoice via WhatsApp | P0 | MVP | owner, admin, accountant, sales_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| WA-002 | WhatsApp | Send Payment Reminder via WhatsApp | P1 | V1 | owner, admin, accountant, sales_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| WA-003 | WhatsApp | Send Quotation via WhatsApp | P1 | V1 | owner, admin, sales_manager, sales_user | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| WA-004 | WhatsApp | Send Payment Receipt via WhatsApp | P1 | V1 | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| WA-005 | WhatsApp | WhatsApp Business API Config | P0 | MVP | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| WA-006 | WhatsApp | WhatsApp Message Templates | P1 | V1 | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| WA-007 | WhatsApp | Bulk WhatsApp (Invoice Batch) | P2 | V2 | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| WA-008 | WhatsApp | WhatsApp Chat History | P2 | V2 | all | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| WA-009 | WhatsApp | WhatsApp Delivery Status | P1 | V1 | all | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |

### Email (EML)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| EML-001 | Email | Send Invoice via Email | P0 | MVP | owner, admin, accountant, sales_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| EML-002 | Email | Send Payment Reminder via Email | P1 | V1 | owner, admin, accountant, sales_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| EML-003 | Email | Email Template Management | P1 | V1 | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| EML-004 | Email | SMTP/Email Service Config | P0 | MVP | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| EML-005 | Email | Email Scheduling | P2 | V2 | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| EML-006 | Email | Email Delivery Tracking | P1 | V1 | all | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| EML-007 | Email | Bulk Email (Invoice Batch) | P2 | V2 | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |

### Notifications (NTF)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| NTF-001 | Notifications | In-App Notification Center | P0 | MVP | all | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| NTF-002 | Notifications | Email Notifications | P0 | MVP | all | ✓ | ✗ | ✓ | ✓ | ✓ | PLANNED |
| NTF-003 | Notifications | Payment Due Notifications | P0 | MVP | all | ✓ | ✗ | ✓ | ✓ | ✓ | PLANNED |
| NTF-004 | Notifications | Low Stock Notifications | P1 | V1 | owner, admin, inventory_manager | ✓ | ✗ | ✓ | ✓ | ✓ | PLANNED |
| NTF-005 | Notifications | Subscription Expiry Notifications | P0 | MVP | owner, admin | ✓ | ✗ | ✓ | ✓ | ✓ | PLANNED |
| NTF-006 | Notifications | Notification Preferences | P1 | V1 | all | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| NTF-007 | Notifications | GST Return Filing Reminder | P1 | V1 | owner, admin, accountant | ✓ | ✗ | ✓ | ✓ | ✓ | PLANNED |

### Import (IMP)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| IMP-001 | Import | Import Customers (CSV/Excel) | P0 | MVP | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| IMP-002 | Import | Import Suppliers (CSV/Excel) | P0 | MVP | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| IMP-003 | Import | Import Products (CSV/Excel) | P0 | MVP | owner, admin, inventory_manager | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| IMP-004 | Import | Import Opening Balances | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| IMP-005 | Import | Import Chart of Accounts | P1 | V1 | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| IMP-006 | Import | Import Sales Invoices | P1 | V1 | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| IMP-007 | Import | Import Purchase Invoices | P1 | V1 | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| IMP-008 | Import | Import Validation & Error Preview | P0 | MVP | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| IMP-009 | Import | Import Template Download | P0 | MVP | owner, admin | ✓ | ✓ | ✗ | ✗ | ✓ | PLANNED |

### Export (EXP)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| EXP-001 | Export | Export Customers (CSV/Excel) | P1 | V1 | owner, admin, accountant | ✓ | ✓ | ✗ | ✓ | ✓ | PLANNED |
| EXP-002 | Export | Export Suppliers (CSV/Excel) | P1 | V1 | owner, admin, accountant | ✓ | ✓ | ✗ | ✓ | ✓ | PLANNED |
| EXP-003 | Export | Export Products (CSV/Excel) | P1 | V1 | owner, admin, inventory_manager | ✓ | ✓ | ✗ | ✓ | ✓ | PLANNED |
| EXP-004 | Export | Export Sales Register (CSV/Excel) | P0 | MVP | owner, admin, accountant, sales_manager | ✓ | ✓ | ✗ | ✓ | ✓ | PLANNED |
| EXP-005 | Export | Export Purchase Register (CSV/Excel) | P0 | MVP | owner, admin, accountant, purchase_manager | ✓ | ✓ | ✗ | ✓ | ✓ | PLANNED |
| EXP-006 | Export | Export GST Returns (JSON/CSV) | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✗ | ✓ | ✓ | PLANNED |
| EXP-007 | Export | Export Stock Report (CSV/Excel) | P1 | V1 | owner, admin, inventory_manager | ✓ | ✓ | ✗ | ✓ | ✓ | PLANNED |

### Subscription (SUB)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| SUB-001 | Subscription | View Current Plan | P0 | MVP | owner | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| SUB-002 | Subscription | Upgrade Plan | P0 | MVP | owner | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SUB-003 | Subscription | Downgrade Plan | P1 | V1 | owner | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SUB-004 | Subscription | Payment History | P0 | MVP | owner | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| SUB-005 | Subscription | Invoice for Subscription | P0 | MVP | owner | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SUB-006 | Subscription | Feature Gate Enforcement | P0 | MVP | system | ✓ | ✗ | ✓ | ✗ | ✓ | PLANNED |
| SUB-007 | Subscription | Usage Metering | P1 | V1 | system | ✓ | ✗ | ✓ | ✓ | ✓ | PLANNED |
| SUB-008 | Subscription | Trial Period Management | P0 | MVP | system | ✓ | ✗ | ✓ | ✓ | ✓ | PLANNED |
| SUB-009 | Subscription | Auto-Renewal Toggle | P2 | V2 | owner | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |

### Platform Admin (ADM)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| ADM-001 | Platform Admin | Platform Dashboard | P0 | MVP | platform_super_admin | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| ADM-002 | Platform Admin | Organization List & Management | P0 | MVP | platform_super_admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| ADM-003 | Platform Admin | User List & Management | P0 | MVP | platform_super_admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| ADM-004 | Platform Admin | Subscription Plan Management | P0 | MVP | platform_super_admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| ADM-005 | Platform Admin | Platform Audit Log | P0 | MVP | platform_super_admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| ADM-006 | Platform Admin | System Health Monitoring | P0 | MVP | platform_super_admin | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| ADM-007 | Platform Admin | Force Subscription Override | P1 | V1 | platform_super_admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |

### Audit (AUD)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| AUD-001 | Audit | Audit Trail Viewer | P0 | MVP | owner, admin | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |
| AUD-002 | Audit | Activity Log Export | P1 | V1 | owner, admin | ✓ | ✓ | ✗ | ✓ | ✓ | PLANNED |
| AUD-003 | Audit | Critical Action Alert Log | P0 | MVP | owner, admin | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |

### Search (SRH)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| SRH-001 | Search | Global Search | P0 | MVP | all | ✓ | ✓ | ✗ | ✗ | ✓ | PLANNED |
| SRH-002 | Search | Search Suggestions/Autocomplete | P1 | V1 | all | ✓ | ✓ | ✗ | ✗ | ✓ | PLANNED |
| SRH-003 | Search | Search History | P2 | V2 | all | ✓ | ✓ | ✓ | ✗ | ✓ | PLANNED |

### Dashboard (DBS)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| DBS-001 | Dashboard | Main Dashboard | P0 | MVP | all | ✓ | ✓ | ✗ | ✗ | ✓ | PLANNED |
| DBS-002 | Dashboard | Sales Dashboard Widgets | P0 | MVP | owner, admin, sales_manager, sales_user | ✓ | ✓ | ✗ | ✗ | ✓ | PLANNED |
| DBS-003 | Dashboard | Financial Summary Widgets | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✗ | ✗ | ✓ | PLANNED |

### Settings (SET)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| SET-001 | Settings | Company Profile Settings | P0 | MVP | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SET-002 | Settings | Tax Rate Settings (GST) | P0 | MVP | owner, admin, accountant | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SET-003 | Settings | Invoice Number Format Settings | P0 | MVP | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SET-004 | Settings | Currency & Locale Settings | P0 | MVP | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SET-005 | Settings | Email/WhatsApp Integration Settings | P0 | MVP | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SET-006 | Settings | E-Invoice/E-Way Bill API Config | P0 | MVP | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SET-007 | Settings | Payment Gateway Config | P2 | V2 | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SET-008 | Settings | Branding & Logo Settings | P1 | V1 | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |

### Security (SEC)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| SEC-001 | Security | Change Password | P0 | MVP | all | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SEC-002 | Security | Two-Factor Authentication (2FA) | P0 | MVP | all | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SEC-003 | Security | IP Whitelisting | P2 | V2 | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SEC-004 | Security | Login Attempt Throttling | P0 | MVP | system | ✓ | ✗ | ✓ | ✓ | ✓ | PLANNED |
| SEC-005 | Security | Data Encryption at Rest | P0 | MVP | system | ✗ | ✗ | ✓ | ✗ | ✓ | PLANNED |
| SEC-006 | Security | Role-Based Access Enforcement | P0 | MVP | system | ✓ | ✗ | ✓ | ✓ | ✓ | PLANNED |
| SEC-007 | Security | API Rate Limiting | P0 | MVP | system | ✓ | ✗ | ✓ | ✓ | ✓ | PLANNED |
| SEC-008 | Security | SSO/SAML Configuration | P2 | V2 | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SEC-009 | Security | Security Audit Log | P0 | MVP | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |
| SEC-010 | Security | Session Timeout Config | P1 | V1 | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |

### Mobile (MOB)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| MOB-001 | Mobile | Responsive Mobile UI | P0 | MVP | all | ✗ | ✓ | ✗ | ✗ | ✓ | PLANNED |

### API (API)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| API-001 | API | RESTful API with Auth | P0 | MVP | all | ✓ | ✗ | ✓ | ✓ | ✓ | PLANNED |
| API-002 | API | API Key Management | P1 | V1 | owner, admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |

### Background Jobs (BGJ)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| BGJ-001 | Background Jobs | Job Queue Processing | P0 | MVP | system | ✓ | ✗ | ✓ | ✓ | ✓ | PLANNED |

### System (SYS)

| ID | Module | Feature | Priority | Maturity | Roles | API | UI | DB | Audit | Tests | Status |
|----|--------|---------|----------|----------|-------|-----|----|----|-------|-------|--------|
| SYS-001 | System | Health Check Endpoint | P0 | MVP | system | ✓ | ✗ | ✗ | ✗ | ✓ | PLANNED |
| SYS-002 | System | Database Backup & Restore | P1 | V1 | platform_super_admin | ✓ | ✗ | ✓ | ✓ | ✓ | PLANNED |
| SYS-003 | System | System Configuration | P0 | MVP | platform_super_admin | ✓ | ✓ | ✓ | ✓ | ✓ | PLANNED |

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Total Modules | 40 |
| Total Features | 277 |
| P0 (MVP) | 148 |
| P1 (V1) | 72 |
| P2 (V2) | 57 |
| With API Endpoint | 268 |
| With UI Screen | 221 |
| Writing to DB | 234 |
| Requiring Audit Log | 179 |
| Requiring Tests | 277 |
