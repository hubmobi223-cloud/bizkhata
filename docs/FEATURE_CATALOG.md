# BizKhata — Complete Feature Catalog

> **Version:** 1.0.0
> **Last Updated:** 2026-09-02
> **Total Features:** 254
> **Modules:** 40
> **Target Market:** India (INR, GST, TDS)

---

## Table of Contents

### 01 — Authentication (AUTH)
- AUTH-001 — Email/Password Registration
- AUTH-002 — Email/Password Login
- AUTH-003 — Google OAuth Sign-In
- AUTH-004 — Magic Link Passwordless Login
- AUTH-005 — Password Reset Flow
- AUTH-006 — Email Verification
- AUTH-007 — Session Management & Refresh Token Rotation
- AUTH-008 — Multi-Factor Authentication (TOTP)
- AUTH-009 — OAuth Provider Linking
- AUTH-010 — Account Deactivation

### 02 — Organization (ORG)
- ORG-001 — Create Organization
- ORG-002 — Update Organization Profile
- ORG-003 — List User Organizations
- ORG-004 — Switch Active Organization
- ORG-005 — Delete Organization

### 03 — Company (CMP)
- CMP-001 — Create Company
- CMP-002 — Update Company Profile
- CMP-003 — Set Active Financial Year
- CMP-004 — Company GST Registration Details

### 04 — Branch (BRN)
- BRN-001 — Create Branch
- BRN-002 — Update Branch Details
- BRN-003 — Deactivate Branch
- BRN-004 — Assign Branch Manager
- BRN-005 — Branch-Level Inventory View

### 05 — Users (USR)
- USR-001 — Invite User to Company
- USR-002 — Accept Invitation & Onboard
- USR-003 — Update User Profile
- USR-004 — Assign Role to User
- USR-005 — Remove User from Company
- USR-006 — List Company Users

### 06 — Roles & Permissions (ROL)
- ROL-001 — Create Custom Role
- ROL-002 — Assign Permissions to Role
- ROL-003 — Role-Based Access Check (fn_has_access)
- ROL-004 — Default Role Assignment on Join
- ROL-005 — Clone Existing Role

### 07 — Customers (CUS)
- CUS-001 — Create Customer
- CUS-002 — Update Customer Details
- CUS-003 — List & Filter Customers
- CUS-004 — Customer Ledger View
- CUS-005 — Customer Balance Summary
- CUS-006 — Customer GSTIN Validation
- CUS-007 — Customer Credit Limit
- CUS-008 — Deactivate Customer

### 08 — Suppliers (SUP)
- SUP-001 — Create Supplier
- SUP-002 — Update Supplier Details
- SUP-003 — List & Filter Suppliers
- SUP-004 — Supplier Ledger View
- SUP-005 — Supplier Balance Summary
- SUP-006 — Deactivate Supplier

### 09 — Products (PRD)
- PRD-001 — Create Product/Service
- PRD-002 — Update Product Details
- PRD-003 — List & Search Products
- PRD-004 — Product HSN/SAC Classification
- PRD-005 — Product Unit of Measurement (UOM)
- PRD-006 — Product Pricing & Price Lists
- PRD-007 — Product Tax Configuration (GST Rate)
- PRD-008 — Product Batch & Expiry Tracking
- PRD-009 — Product Category & Tags
- PRD-010 — Deactivate Product

### 10 — Inventory (INV)
- INV-001 — View Current Stock Levels
- INV-002 — Stock Adjustment (Manual Correction)
- INV-003 — Stock Journal Entry
- INV-004 — Batch-Level Stock Tracking
- INV-005 — Expiry Date Monitoring
- INV-006 — Minimum Stock Level Alerts
- INV-007 — Stock Ledger View
- INV-008 — Stock Resync & Recalculation
- INV-009 — Opening Stock Entry

### 11 — Warehouses (WHS)
- WHS-001 — Create Warehouse
- WHS-002 — Update Warehouse Details
- WHS-003 — Warehouse Stock Summary
- WHS-004 — Deactivate Warehouse

### 12 — Stock Transfers (STK)
- STK-001 — Create Stock Transfer
- STK-002 — Approve Stock Transfer
- STK-003 — Receive Stock Transfer
- STK-004 — Cancel Stock Transfer

### 13 — Sales (SAL)
- SAL-001 — Create Sales Invoice
- SAL-002 — Edit Draft Sales Invoice
- SAL-003 — Approve & Post Sales Invoice
- SAL-004 — Cancel Sales Invoice
- SAL-005 — List Sales Invoices
- SAL-006 — Sales Return (Credit Note)
- SAL-007 — GST Calculation on Invoice (CGST/SGST/IGST)
- SAL-008 — Sales Invoice PDF Generation
- SAL-009 — Sales Quotation/Estimate
- SAL-010 — Quotation to Invoice Conversion
- SAL-011 — Delivery Challan
- SAL-012 — Sales Order
- SAL-013 — Sales Order Fulfillment
- SAL-014 — Invoice Duplicate Check
- SAL-015 — Bulk Invoice Creation

### 14 — Purchase (PUR)
- PUR-001 — Create Purchase Invoice
- PUR-002 — Edit Draft Purchase Invoice
- PUR-003 — Approve & Post Purchase Invoice
- PUR-004 — Purchase Return (Debit Note)
- PUR-005 — List Purchase Invoices
- PUR-006 — GST Input Tax Credit Calculation
- PUR-007 — Purchase Order

### 15 — Accounting (ACC)
- ACC-001 — Create Chart of Account Group
- ACC-002 — Create Ledger Under Group
- ACC-003 — Create Voucher (Double Entry)
- ACC-004 — Post Voucher with Balance Trigger
- ACC-005 — Journal Voucher Entry
- ACC-006 — Contra Voucher Entry
- ACC-007 — Payment Voucher Entry
- ACC-008 — Receipt Voucher Entry
- ACC-009 — Opening Balance Entry
- ACC-010 — Ledger Balance Inquiry
- ACC-011 — Financial Year Close & Carry Forward
- ACC-012 — Group-wise Balance Aggregation
- ACC-013 — Recurring/Journal Templates
- ACC-014 — Voucher Number Auto-Generation

### 16 — Payments (PAY)
- PAY-001 — Record Payment Received
- PAY-002 — Record Payment Made
- PAY-003 — Payment Reconciliation
- PAY-004 — Advance Payment Handling
- PAY-005 — Payment Against Multiple Invoices
- PAY-006 — TDS Deduction on Payment
- PAY-007 — Payment Link Generation

### 17 — Receivables (REC)
- REC-001 — Accounts Receivable Aging Report
- REC-002 — Payment Reminder Notification
- REC-003 — Customer Outstanding Statement
- REC-004 — Bad Debt Write-Off

### 18 — Payables (PYB)
- PYB-001 — Accounts Payable Aging Report
- PYB-002 — Supplier Payment Due List
- PYB-003 — Supplier Outstanding Statement

### 19 — GST (GST)
- GST-001 — GSTIN Lookup & Validation
- GST-002 — GST Rate Master Setup
- GST-003 — GSTR-1 Return Preparation
- GST-004 — GSTR-3B Return Preparation
- GST-005 — GST Payment Challan Generation
- GST-006 — CGST/SGST/IGST Split Logic
- GST-007 — Reverse Charge Mechanism (RCM)
- GST-008 — HSN/SAC Summary Report
- GST-009 — GST Reconciliation with Portal

### 20 — E-Invoice (EINV)
- EINV-001 — E-Invoice Generation (IRN)
- EINV-002 — E-Invoice Cancellation
- EINV-003 — E-Invoice QR Code & Print
- EINV-004 — E-Invoice Bulk Generation
- EINV-005 — E-Invoice API Credentials Management
- EINV-006 — E-Invoice Rejection Handling
- EINV-007 — E-Invoice Status Tracking

### 21 — E-Way Bill (EWAY)
- EWAY-001 — E-Way Bill Generation
- EWAY-002 — E-Way Bill Update (Vehicle Details)
- EWAY-003 — E-Way Bill Cancellation
- EWAY-004 — Multi-Vehicle E-Way Bill
- EWAY-005 — E-Way Bill Validity Extension
- EWAY-006 — E-Way Bill API Credentials Management

### 22 — Reports (RPT)
- RPT-001 — Trial Balance
- RPT-002 — Day Book / Cash Book
- RPT-003 — Profit & Loss Statement
- RPT-004 — Balance Sheet
- RPT-005 — Stock Summary Report
- RPT-006 — Stock Book (Movement Report)
- RPT-007 — Sales Register
- RPT-008 — Purchase Register
- RPT-009 — Receivables Aging Report
- RPT-010 — Payables Aging Report
- RPT-011 — Tax Summary Report (GST)
- RPT-012 — Input Tax Credit (ITC) Report
- RPT-013 — Salesman/Branch-wise Report
- RPT-014 — Expense Report by Category
- RPT-015 — Cash Flow Statement
- RPT-016 — Ledger Statement (Account-wise)
- RPT-017 — Report Date Range & Comparison

### 23 — Documents (DOC)
- DOC-001 — Upload Document Attachment
- DOC-002 — Link Document to Transaction
- DOC-003 — View & Download Attached Document
- DOC-004 — Document Type Categorization
- DOC-005 — Remove Document Attachment
- DOC-006 — Document Version History
- DOC-007 — Bulk Document Upload

### 24 — PDF Generation (PDF)
- PDF-001 — Sales Invoice PDF
- PDF-002 — Purchase Invoice PDF
- PDF-003 — Credit Note PDF
- PDF-004 — Debit Note PDF
- PDF-005 — Delivery Challan PDF
- PDF-006 — Quotation/Estimate PDF
- PDF-007 — Payment Receipt PDF

### 25 — WhatsApp (WA)
- WA-001 — Send Invoice via WhatsApp
- WA-002 — Send Payment Reminder via WhatsApp
- WA-003 — Send Quotation via WhatsApp
- WA-004 — Send Delivery Challan via WhatsApp
- WA-005 — Send Payment Receipt via WhatsApp
- WA-006 — Send GST Return Summary via WhatsApp
- WA-007 — WhatsApp Message Template Management
- WA-008 — WhatsApp Delivery Status Tracking
- WA-009 — WhatsApp Bulk Send with Rate Limiting

### 26 — Email (EML)
- EML-001 — Send Invoice via Email
- EML-002 — Send Payment Reminder via Email
- EML-003 — Send Quotation via Email
- EML-004 — Send GST Return Summary via Email
- EML-005 — Email Template Customization
- EML-006 — Email Delivery Status Tracking
- EML-007 — Scheduled Email Reports

### 27 — Notifications (NTF)
- NTF-001 — In-App Notification Center
- NTF-002 — Email Notification Preferences
- NTF-003 — Due Date Reminder Notifications
- NTF-004 — GST Filing Deadline Reminders
- NTF-005 — Low Stock Alert Notifications
- NTF-006 — Invoice/Payment Activity Notifications

### 28 — Import (IMP)
- IMP-001 — Import Customers from CSV/Excel
- IMP-002 — Import Suppliers from CSV/Excel
- IMP-003 — Import Products from CSV/Excel
- IMP-004 — Import Opening Balances
- IMP-005 — Import Sales Invoices from CSV
- IMP-006 — Import Purchase Invoices from CSV
- IMP-007 — Import Bank Statements
- IMP-008 — Import Template Management

### 29 — Export (EXP)
- EXP-001 — Export Sales Register (CSV/Excel)
- EXP-002 — Export Purchase Register (CSV/Excel)
- EXP-003 — Export Trial Balance (CSV/Excel)
- EXP-004 — Export Stock Summary (CSV/Excel)
- EXP-005 — Export GSTR-1 Data (JSON)
- EXP-006 — Export GSTR-3B Data (JSON)
- EXP-007 — Export Customer/Supplier Master (CSV)

### 30 — Subscription (SUB)
- SUB-001 — Plan Selection & Purchase
- SUB-002 — Subscription Upgrade
- SUB-003 — Subscription Downgrade
- SUB-004 — Subscription Cancellation
- SUB-005 — Invoice History & Billing
- SUB-006 — Free Trial Management
- SUB-007 — Add-on Module Purchase
- SUB-008 — Subscription Usage Metering

### 31 — Platform Admin (ADM)
- ADM-001 — Platform Super Admin Login
- ADM-002 — Manage All Organizations
- ADM-003 — Manage All Users Across Tenants
- ADM-004 — Platform Usage Analytics Dashboard
- ADM-005 — Tenant Data Impersonation (Read-Only)
- ADM-006 — Platform Configuration Management
- ADM-007 — Tenant Suspension & Reactivation

### 32 — Audit (AUD)
- AUD-001 — Audit Log Recording
- AUD-002 — Audit Log Query & Filter
- AUD-003 — Audit Log Export

### 33 — Search (SRH)
- SRH-001 — Global Search (Customers, Products, Invoices)
- SRH-002 — Advanced Filter & Sort
- SRH-003 — Search Autocomplete & Suggestions

### 34 — Dashboard (DBS)
- DBS-001 — Company Financial Dashboard

### 35 — Settings (SET)
- SET-001 — Company Profile Settings
- SET-002 — Financial Year Management
- SET-003 — Tax Configuration (GST Rates)
- SET-004 — Invoice Template Customization
- SET-005 — Voucher Number Format Configuration
- SET-006 — Payment Terms Configuration
- SET-007 — Default Account Mappings
- SET-008 — Notification Preferences Settings

### 36 — Security (SEC)
- SEC-001 — Row-Level Security (RLS) Enforcement
- SEC-002 — Tenant Data Isolation
- SEC-003 — Password Policy Enforcement
- SEC-004 — Session Timeout & Concurrent Session Limit
- SEC-005 — IP Allowlist / Restriction
- SEC-006 — API Rate Limiting
- SEC-007 — Data Encryption at Rest & in Transit
- SEC-008 — Sensitive Field Masking
- SEC-009 — Activity Anomaly Detection

### 37 — Mobile (MOB)
- MOB-001 — Progressive Web App (PWA) Responsive UI

### 38 — API (API)
- API-001 — RESTful API with API Key Authentication

### 39 — Background Jobs (BGJ)
- BGJ-001 — Background Job Queue (BullMQ)

### 40 — System (SYS)
- SYS-001 — Health Check & System Status

---

# Feature Specifications

## Module 01 — Authentication

---

### AUTH-001 — Email/Password Registration

| Field | Detail |
|-------|--------|
| **Module** | Authentication |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | All unauthenticated users |

**Description:**
New users create a BizKhata account using email and password. A Supabase Auth user record is created and a verification email is triggered. The user is then guided to create or join an organization.

**Preconditions:**
- User does not already have an account with the provided email
- Supabase Auth is configured and operational

**Inputs:**
- Email address (valid format)
- Full name (2-100 characters)
- Password (meeting strength requirements)
- Confirm password

**Validation Rules:**
- Email must be valid RFC 5322 format
- Email must not already exist in auth.users
- Password minimum 8 characters, must contain uppercase, lowercase, number, and special character
- Confirm password must match password
- Full name 2-100 characters

**Business Rules:**
- On success, a Supabase Auth user is created
- Verification email is automatically sent
- User cannot log in until email is verified (configurable)
- Password is never stored in plaintext (bcrypt via Supabase Auth)

**Database Impact:**
- Tables: auth.users (Supabase managed), profiles (via trigger on auth.users insert)
- Indexes: unique on profiles.email

**API Requirement:**
- POST /api/auth/register
- Request: { email, password, full_name }
- Response: { user_id, message: "Verification email sent" }

**UI Requirement:**
- Loading state: Submit button disabled with spinner
- Empty state: Registration form with empty fields
- Success state: Message "Check your email for verification link"
- Error state: Inline field errors and toast for server errors

**Security:**
- Password hashed with bcrypt (Supabase Auth)
- Rate limited to 5 registration attempts per IP per hour
- CAPTCHA on registration form

**Audit:**
- Log: auth.register with email and IP address

**Dependencies:**
- AUTH-006 (Email Verification)

**Edge Cases:**
- Duplicate email returns generic message (no email enumeration)
- Network failure mid-registration leaves partial auth state
- Password contains unicode characters

**Tests:**
- Unit: Email validation, password strength check
- Integration: Full registration flow, duplicate email rejection, email delivery

---

### AUTH-002 — Email/Password Login

| Field | Detail |
|-------|--------|
| **Module** | Authentication |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | All authenticated users |

**Description:**
Registered and verified users log in using email and password. The system authenticates via Supabase Auth, issues JWT access and refresh tokens, and loads the user's organizations and default company context.

**Preconditions:**
- User has a verified account
- Supabase Auth is operational

**Inputs:**
- Email address
- Password

**Validation Rules:**
- Email must be valid format
- Password must not be empty
- Maximum 10 consecutive failed attempts triggers 30-minute lockout

**Business Rules:**
- On success, JWT tokens issued (short-lived access + long-lived refresh)
- Failed attempts tracked; 10 failures locks account for 30 minutes
- Login success loads user's organization memberships
- If user has only one organization, auto-selects it

**Database Impact:**
- Tables: auth.users (read), auth.sessions (Supabase managed)
- Indexes: lookup on auth.users.email

**API Requirement:**
- POST /api/auth/login
- Request: { email, password }
- Response: { access_token, refresh_token, user: { id, email, name }, organizations: [...] }

**UI Requirement:**
- Loading state: Submit button disabled with spinner
- Empty state: Login form with email and password fields
- Success state: Redirect to dashboard
- Error state: "Invalid email or password" (generic), account lockout message

**Security:**
- Rate limited to 10 attempts per email per 15 minutes
- IP-based rate limiting (100 requests/hour)
- JWT tokens stored in httpOnly secure cookies

**Audit:**
- Log: auth.login_success and auth.login_failure with email, IP, user agent

**Dependencies:**
- AUTH-001 (Registration must exist)
- AUTH-006 (Email verification before login)
- AUTH-007 (Session management)

**Edge Cases:**
- Login with unverified email shows verification prompt
- Login with locked account shows lockout timer
- Supabase Auth service unavailable shows maintenance message

**Tests:**
- Unit: Credential validation logic
- Integration: Successful login, failed login, lockout, session creation

---

### AUTH-003 — Google OAuth Sign-In

| Field | Detail |
|-------|--------|
| **Module** | Authentication |
| **Priority** | P1 |
| **Maturity** | MVP |
| **Roles** | All unauthenticated users |

**Description:**
Users sign in or register using their Google account via OAuth 2.0. If the Google email is not linked to an existing account, a new account is automatically created. Google profile information pre-fills the user's name.

**Preconditions:**
- Google OAuth is configured in Supabase Auth
- User has a Google account

**Inputs:**
- Google OAuth consent (no manual inputs)

**Validation Rules:**
- Google OAuth token must be valid
- Email must be from Google profile
- If email exists with password auth, link accounts

**Business Rules:**
- New users: auto-create account with Google email and name
- Existing password users: prompt to link Google account
- Existing Google users: seamless login
- Google profile photo stored as avatar

**Database Impact:**
- Tables: auth.users, auth.identities (Supabase managed), profiles (avatar_url update)
- Indexes: unique on auth.identities(provider, provider_id)

**API Requirement:**
- GET /api/auth/google (initiates OAuth flow)
- GET /api/auth/google/callback (handles callback)
- Response: JWT tokens and user info

**UI Requirement:**
- Loading state: "Connecting to Google..." spinner during OAuth flow
- Empty state: "Sign in with Google" button on login/register page
- Success state: Redirect to dashboard or organization setup
- Error state: "Could not connect to Google. Please try again."

**Security:**
- OAuth state parameter to prevent CSRF
- Tokens validated server-side
- No Google passwords stored

**Audit:**
- Log: auth.google_login with Google email and IP

**Dependencies:**
- AUTH-001 (Registration)
- AUTH-007 (Session Management)

**Edge Cases:**
- Google account email already registered with password auth
- Google OAuth timeout or cancellation
- Google profile returns no email

**Tests:**
- Unit: OAuth state validation
- Integration: New user via Google, existing user via Google, account linking

---

### AUTH-004 — Magic Link Passwordless Login

| Field | Detail |
|-------|--------|
| **Module** | Authentication |
| **Priority** | P2 |
| **Maturity** | V1 |
| **Roles** | All authenticated users |

**Description:**
Users request a magic link sent to their email for passwordless login. The link contains a one-time token exchanged for a session. Useful for quick mobile access or forgotten passwords.

**Preconditions:**
- Supabase Auth magic link is enabled
- User email exists and is verified

**Inputs:**
- Email address

**Validation Rules:**
- Email must be valid and exist in the system
- Maximum 5 magic link requests per email per hour

**Business Rules:**
- Magic link expires after 10 minutes
- One-time use only; invalidated after first use
- If email not found, still shows "Check your email" (no enumeration)

**Database Impact:**
- Tables: auth.users (lookup), auth.refresh_tokens (token management)

**API Requirement:**
- POST /api/auth/magic-link
- Request: { email }
- Response: { message: "Check your email for login link" }

**UI Requirement:**
- Loading state: "Sending magic link..." with spinner
- Empty state: Email input field with "Send Magic Link" button
- Success state: Confirmation message with email address shown
- Error state: Generic error message, rate limit exceeded

**Security:**
- Rate limited to 5 requests per email per hour
- Link expires in 10 minutes
- One-time use token

**Audit:**
- Log: auth.magic_link_requested with email, IP

**Dependencies:**
- AUTH-006 (Email must be verified)

**Edge Cases:**
- Email not in system still shows success (prevents enumeration)
- Expired magic link shows re-request option
- User clicks magic link on different device

**Tests:**
- Unit: Token generation and expiry logic
- Integration: Request magic link, click link, session creation, expired link handling

---

### AUTH-005 — Password Reset Flow

| Field | Detail |
|-------|--------|
| **Module** | Authentication |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | All authenticated users |

**Description:**
Users who forgot their password request a reset link via email. The link contains a time-limited token for setting a new password. All existing sessions are invalidated after password change.

**Preconditions:**
- User has an existing verified account
- Email service is operational

**Inputs:**
- Email address (for requesting reset)
- New password + confirm password (on reset page)
- Reset token (from email link)

**Validation Rules:**
- Email must be valid
- New password must meet strength requirements
- Reset token must be valid and not expired
- Maximum 3 reset requests per email per hour

**Business Rules:**
- Reset link sent to user's email
- Link expires after 1 hour
- After reset, all other sessions invalidated
- User redirected to login after password change

**Database Impact:**
- Tables: auth.users (password update via Supabase Auth)
- Tables: auth.refresh_tokens (all tokens revoked on reset)

**API Requirement:**
- POST /api/auth/forgot-password — { email }
- POST /api/auth/reset-password — { token, new_password }
- Response: { message: "Password reset successful" }

**UI Requirement:**
- Loading state: Spinner during email send, spinner during password update
- Empty state: "Enter your email" form, then "Set new password" form
- Success state: "Password updated. Please log in." with login link
- Error state: "Invalid or expired token", rate limit message

**Security:**
- Rate limited to 3 requests per email per hour
- Token expires after 1 hour
- All sessions invalidated post-reset

**Audit:**
- Log: auth.password_reset_requested, auth.password_reset_completed with email, IP

**Dependencies:**
- AUTH-001 (Account must exist)

**Edge Cases:**
- Reset link clicked after token expiry
- User clicks reset link multiple times
- Password reset while already logged in on another device

**Tests:**
- Unit: Token generation, expiry, validation
- Integration: Full reset flow, session invalidation, expired token rejection

---

### AUTH-006 — Email Verification

| Field | Detail |
|-------|--------|
| **Module** | Authentication |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | All authenticated users |

**Description:**
After registration, users receive a verification email with a one-time link. Clicking verifies the email and activates the account. Unverified users see only a "Verify your email" screen.

**Preconditions:**
- User has registered an account
- Email service is operational

**Inputs:**
- Verification token (from email link)

**Validation Rules:**
- Token must be valid and not expired
- Token expires after 24 hours
- Maximum 5 re-send requests per email per day

**Business Rules:**
- Verification email sent automatically on registration
- User can request re-send (max 5 per day)
- Unverified users see a dedicated verification screen
- After verification, user redirected to login or onboarding

**Database Impact:**
- Tables: auth.users (email_confirmed_at updated by Supabase)
- Tables: profiles (email_verified boolean set to true)

**API Requirement:**
- GET /api/auth/verify-email?token=... — Verify email
- POST /api/auth/resend-verification — { email }
- Response: { message: "Email verified" } or { message: "Verification email sent" }

**UI Requirement:**
- Loading state: Spinner during verification
- Empty state: "Check your email" screen with re-send button
- Success state: "Email verified! Redirecting to login..."
- Error state: "Invalid or expired verification link"

**Security:**
- Token single-use
- Rate limited re-send (5 per day)

**Audit:**
- Log: auth.email_verified, auth.verification_resent with email, IP

**Dependencies:**
- AUTH-001 (Registration)

**Edge Cases:**
- User already verified clicks verification link again
- Verification link expired — show re-send option
- Re-send limit reached

**Tests:**
- Unit: Token validation, expiry
- Integration: Registration triggers email, verification flow, re-send, limit enforcement

---

### AUTH-007 — Session Management & Refresh Token Rotation

| Field | Detail |
|-------|--------|
| **Module** | Authentication |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | All authenticated users |

**Description:**
BizKhata manages sessions using short-lived JWT access tokens (15 min) and long-lived refresh tokens (7 days). Refresh tokens are rotated on each use. Users can view and revoke active sessions across devices.

**Preconditions:**
- User is authenticated
- Supabase Auth session management is active

**Inputs:**
- Refresh token (automatic)
- Session ID (for revocation)

**Validation Rules:**
- Access token must not be expired
- Refresh token must not be revoked
- Refresh token must match a valid session

**Business Rules:**
- Access token expires in 15 minutes
- Refresh token expires in 7 days
- Refresh token rotated on each refresh (old invalidated)
- User can view all active sessions
- User can revoke individual sessions or all other sessions

**Database Impact:**
- Tables: auth.sessions (Supabase managed)
- Indexes: on user_id, on refresh_token

**API Requirement:**
- POST /api/auth/refresh — { refresh_token }
- GET /api/auth/sessions — List active sessions
- DELETE /api/auth/sessions/:id — Revoke session
- DELETE /api/auth/sessions — Revoke all other sessions

**UI Requirement:**
- Loading state: Seamless refresh (no user-visible loading)
- Empty state: Session list with current device highlighted
- Success state: Updated tokens (invisible), session removed from list
- Error state: "Session expired. Please log in again."

**Security:**
- Refresh token rotation prevents replay attacks
- Tokens stored in httpOnly secure cookies
- Session revocation is immediate

**Audit:**
- Log: auth.session_refreshed, auth.session_revoked, auth.all_sessions_revoked

**Dependencies:**
- AUTH-002 (Login creates session)

**Edge Cases:**
- Refresh token used twice (replay detection — revoke all sessions)
- Concurrent refresh from multiple devices
- Session revocation of current session (force logout)

**Tests:**
- Unit: Token expiry check, rotation logic
- Integration: Token refresh, replay detection, session listing, revocation

---

### AUTH-008 — Multi-Factor Authentication (TOTP)

| Field | Detail |
|-------|--------|
| **Module** | Authentication |
| **Priority** | P2 |
| **Maturity** | V2 |
| **Roles** | All authenticated users (mandatory for owner/admin) |

**Description:**
Users enable TOTP-based multi-factor authentication. On login, after password verification, a 6-digit code from an authenticator app is required. Owner and admin roles must enable MFA.

**Preconditions:**
- User is logged in
- Authenticator app installed

**Inputs:**
- TOTP secret (during setup — QR code scanned)
- 6-digit TOTP code (on login and setup verification)

**Validation Rules:**
- TOTP code must be 6 digits
- Code must be valid for current time window (+/- 1 window tolerance)
- Setup requires verification of first code

**Business Rules:**
- MFA optional for most roles, mandatory for owner/admin
- During setup, user scans QR code and verifies first code
- On login, after password, user enters TOTP code
- User can generate backup codes (10 single-use)
- User can disable MFA (requires current TOTP code)

**Database Impact:**
- Tables: mfa_factors (user_id, secret_encrypted, enabled, backup_codes)
- Indexes: unique on user_id

**API Requirement:**
- POST /api/auth/mfa/setup — Generate secret and QR
- POST /api/auth/mfa/verify-setup — { code }
- POST /api/auth/mfa/verify-login — { code }
- DELETE /api/auth/mfa — { code }

**UI Requirement:**
- Loading state: Spinner during setup, spinner during code verification
- Empty state: QR code display with "Scan with authenticator app"
- Success state: "MFA enabled. Save your backup codes."
- Error state: "Invalid code. Try again."

**Security:**
- TOTP secret encrypted at rest
- Backup codes hashed (single-use)
- Rate limit: 5 failed TOTP attempts per 15 minutes

**Audit:**
- Log: auth.mfa_enabled, auth.mfa_disabled, auth.mfa_login_success, auth.mfa_login_failure

**Dependencies:**
- AUTH-002 (Login flow)
- SEC-003 (Password policy)

**Edge Cases:**
- User loses authenticator device — use backup codes
- Backup codes exhausted — require admin intervention
- Clock drift causing TOTP failures

**Tests:**
- Unit: TOTP generation/validation, backup code validation
- Integration: Full MFA setup, login with MFA, disable MFA, backup codes

---

### AUTH-009 — OAuth Provider Linking

| Field | Detail |
|-------|--------|
| **Module** | Authentication |
| **Priority** | P2 |
| **Maturity** | V1 |
| **Roles** | All authenticated users |

**Description:**
Users who registered with email/password link additional OAuth providers (Google, Microsoft) for flexible login. OAuth-created users can set a password for email-based login.

**Preconditions:**
- User is logged in
- OAuth providers configured in Supabase Auth

**Inputs:**
- OAuth consent (for linking Google/Microsoft)
- Password (for setting password on OAuth accounts)

**Validation Rules:**
- OAuth provider must not already be linked
- Password must meet strength requirements
- User must authenticate before linking

**Business Rules:**
- User can link multiple OAuth providers
- Each provider linked once per account
- Linking requires re-authentication
- User sees list of linked providers and can unlink

**Database Impact:**
- Tables: auth.identities (additional identity linked)
- Constraints: unique on (provider, provider_id)

**API Requirement:**
- POST /api/auth/link/google — Initiate Google linking
- POST /api/auth/link/password — { password }
- DELETE /api/auth/link/:provider — Unlink provider
- GET /api/auth/linked-providers — List linked providers

**UI Requirement:**
- Loading state: Spinner during OAuth redirect
- Empty state: List of available providers with "Link" buttons
- Success state: Provider shown as "Linked" in account settings
- Error state: "This Google account is already linked to another user"

**Security:**
- Re-authentication required before linking/unlinking
- Cannot unlink the only login method

**Audit:**
- Log: auth.provider_linked, auth.provider_unlinked, auth.password_set

**Dependencies:**
- AUTH-001 (Account must exist)
- AUTH-003 (Google OAuth)
- AUTH-007 (Session management)

**Edge Cases:**
- OAuth email mismatch with account email
- Trying to unlink only login method
- Google account already linked to different BizKhata user

**Tests:**
- Unit: Provider linking logic
- Integration: Link Google, set password, unlink, prevent unlinking only method

---

### AUTH-010 — Account Deactivation

| Field | Detail |
|-------|--------|
| **Module** | Authentication |
| **Priority** | P1 |
| **Maturity** | V1 |
| **Roles** | All authenticated users (owner only for company-level) |

**Description:**
Users deactivate their personal account or owner deactivates a company. Personal deactivation revokes all sessions and hides the account. Company deactivation soft-deletes all company data and removes user access.

**Preconditions:**
- User is authenticated
- For company deactivation: user must be the owner

**Inputs:**
- Confirmation text ("DEACTIVATE" for account, company name for company)
- Password confirmation

**Validation Rules:**
- Confirmation text must match exactly
- Password must be correct
- Owner cannot deactivate the last active owner (company)

**Business Rules:**
- Personal deactivation: sessions revoked, account marked inactive
- Company deactivation: all users lose access, data retained 7 years
- Owner can reactivate deactivated company within 30 days
- After 30 days, company enters "archived" state

**Database Impact:**
- Tables: profiles (is_active = false), companies (status = 'deactivated')
- Tables: auth.sessions (all revoked)

**API Requirement:**
- POST /api/auth/deactivate-account — { password, confirmation }
- POST /api/auth/deactivate-company/:id — { company_id, password, confirmation }

**UI Requirement:**
- Loading state: Spinner during deactivation
- Empty state: Confirmation dialog with warning
- Success state: "Account deactivated. Contact support to reactivate."
- Error state: "Incorrect password" or "Cannot deactivate last owner"

**Security:**
- Password confirmation required
- Session invalidation on completion

**Audit:**
- Log: auth.account_deactivated, auth.company_deactivated with actor, target, IP

**Dependencies:**
- AUTH-007 (Session management)
- USR-005 (Remove user)

**Edge Cases:**
- Owner tries to deactivate but is last owner
- Company deactivation while invoices are pending
- Reactivation after 30-day window

**Tests:**
- Unit: Deactivation logic, reactivation logic
- Integration: Full deactivation flow, session revocation, company deactivation

---


## Module 02 — Organization

---

### ORG-001 — Create Organization

| Field | Detail |
|-------|--------|
| **Module** | Organization |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | All authenticated users |

**Description:**
A user creates a new organization (business entity) after registration. The creator is automatically assigned the owner role. An organization is the top-level tenant containing companies, users, and all business data.

**Preconditions:**
- User is authenticated and has verified email
- No organization is currently active (first-time flow) or user has permission

**Inputs:**
- Organization name (2-100 characters)
- Organization type (sole_proprietorship, partnership, llp, private_limited, public_limited)
- Industry type (optional)
- GSTIN (optional, validated if provided)

**Validation Rules:**
- Organization name: 2-100 characters, alphanumeric with allowed special characters
- GSTIN valid 15-character Indian format if provided
- Organization type must be from enum list

**Business Rules:**
- Creator becomes the owner
- Default 'India' country setting
- Default financial year created (current April-March)
- Unique slug generated for URL-friendly identifier

**Database Impact:**
- Tables: organizations (id, name, slug, type, industry, gstin, created_by, status)
- Tables: organization_members (user_id, organization_id, role = 'owner')
- Tables: companies (default company auto-created)
- Tables: financial_years (current FY auto-created)
- Indexes: unique on organizations.slug, index on organizations.created_by

**API Requirement:**
- POST /api/organizations
- Request: { name, type, industry?, gstin? }
- Response: { organization: {...}, company: {...}, financial_year: {...} }

**UI Requirement:**
- Loading state: Spinner on submit button
- Empty state: Organization creation form
- Success state: Redirect to company setup wizard
- Error state: Inline validation errors, duplicate slug warning

**Security:**
- Authenticated user required
- User can create multiple organizations

**Audit:**
- Log: org.created with org name, creator user_id

**Dependencies:**
- AUTH-001 (User must be registered)
- AUTH-006 (Email must be verified)

**Edge Cases:**
- User creates multiple organizations
- GSTIN already used by another organization
- Slug collision with existing organization

**Tests:**
- Unit: Slug generation, GSTIN validation
- Integration: Full creation flow, default company/FY creation, role assignment

---

### ORG-002 — Update Organization Profile

| Field | Detail |
|-------|--------|
| **Module** | Organization |
| **Priority** | P1 |
| **Maturity** | MVP |
| **Roles** | owner, admin |

**Description:**
Organization owners and admins update the organization's profile including name, type, industry, and GSTIN. GSTIN changes trigger re-validation against the GST portal.

**Preconditions:**
- User is authenticated with owner or admin role
- Organization exists and is active

**Inputs:**
- Organization name (optional)
- Organization type (optional)
- Industry type (optional)
- GSTIN (optional)
- Logo (optional, file upload)

**Validation Rules:**
- Name: 2-100 characters
- GSTIN: valid 15-character format
- Logo: max 2MB, PNG/JPG/SVG

**Business Rules:**
- Name change does not affect existing transactions
- GSTIN change logged with old and new values
- Logo stored in Supabase Storage and CDN-cached
- Slug not editable after creation

**Database Impact:**
- Tables: organizations (name, type, industry, gstin, logo_url updated)
- Indexes: re-index if name changes

**API Requirement:**
- PATCH /api/organizations/:id
- Request: { name?, type?, industry?, gstin?, logo? }
- Response: { organization: {...} }

**UI Requirement:**
- Loading state: Save button spinner
- Empty state: Form pre-filled with current values
- Success state: Toast "Organization updated"
- Error state: Inline validation errors

**Security:**
- Owner or admin role required
- Same organization only (RLS)

**Audit:**
- Log: org.updated with changed fields, old/new values

**Dependencies:**
- ORG-001 (Organization must exist)
- GST-001 (GSTIN validation)

**Edge Cases:**
- Name change to reserved/slug collision
- GSTIN change while active GST returns exist
- Logo upload fails (storage unavailable)

**Tests:**
- Unit: Field validation, GSTIN re-validation
- Integration: Profile update, GSTIN change logging, logo upload

---

### ORG-003 — List User Organizations

| Field | Detail |
|-------|--------|
| **Module** | Organization |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | All authenticated users |

**Description:**
Users belonging to multiple organizations view a list of all organizations they belong to. Each entry shows name, logo, role, and company count. Users can switch between organizations.

**Preconditions:**
- User is authenticated
- User is a member of at least one organization

**Inputs:**
- None (GET request with user context)

**Validation Rules:**
- None (read-only)

**Business Rules:**
- Only shows organizations where user has active membership
- Sorted by most recently accessed
- Shows user's role in each organization
- Shows company count per organization

**Database Impact:**
- Tables: organizations (read via join with organization_members)
- Indexes: organization_members(user_id, organization_id)

**API Requirement:**
- GET /api/organizations
- Response: [{ id, name, slug, logo_url, role, company_count, last_accessed }]

**UI Requirement:**
- Loading state: Skeleton cards
- Empty state: "No organizations yet. Create your first one."
- Success state: Grid of organization cards
- Error state: Error toast

**Security:**
- Authenticated user required
- Only returns user's own organizations (RLS)

**Audit:**
- No audit needed (read-only)

**Dependencies:**
- ORG-001 (Organizations must exist)

**Edge Cases:**
- User removed from organization while viewing list
- Organization deactivated while listed
- Zero organizations (first-time user)

**Tests:**
- Unit: Sort by last accessed
- Integration: List returns only user's organizations, handles empty list

---

### ORG-004 — Switch Active Organization

| Field | Detail |
|-------|--------|
| **Module** | Organization |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | All authenticated users |

**Description:**
Users switch their active organization context. Switching updates the session to the new organization and loads associated companies and financial year. All subsequent operations are scoped to the selected organization.

**Preconditions:**
- User is authenticated
- User is member of at least 2 organizations

**Inputs:**
- Organization ID to switch to

**Validation Rules:**
- Organization ID must exist
- User must be an active member of target organization

**Business Rules:**
- Switch clears current company/branch context
- Default company of new organization auto-selected
- Active financial year of default company loaded
- Last accessed timestamp updated

**Database Impact:**
- Tables: organizations (last_accessed_at updated)
- Session/context updated in Supabase Auth user metadata

**API Requirement:**
- POST /api/organizations/switch
- Request: { organization_id }
- Response: { organization: {...}, company: {...}, financial_year: {...} }

**UI Requirement:**
- Loading state: Full-page loader during context switch
- Empty state: Organization selector dropdown
- Success state: Dashboard reloads with new organization context
- Error state: "Cannot switch. You may not have access."

**Security:**
- User must be member of target organization
- RLS policies update with new org context

**Audit:**
- Log: org.switched with from_org, to_org, user_id

**Dependencies:**
- ORG-003 (List organizations)
- CMP-003 (Active financial year)

**Edge Cases:**
- Switch to organization where user was just removed
- Switch while unsaved changes exist on current page
- Only one organization — switch option hidden

**Tests:**
- Unit: Context switch logic
- Integration: Switch loads correct data, unauthorized switch rejected

---

### ORG-005 — Delete Organization

| Field | Detail |
|-------|--------|
| **Module** | Organization |
| **Priority** | P1 |
| **Maturity** | V1 |
| **Roles** | owner |

**Description:**
The organization owner permanently deletes the organization and all associated data. This is destructive and irreversible, requiring multiple confirmations. A 30-day grace period allows cancellation.

**Preconditions:**
- User is authenticated as the owner
- Organization has no pending financial obligations
- No active GST returns for current period

**Inputs:**
- Organization name (for confirmation)
- Password confirmation
- "DELETE" typed confirmation

**Validation Rules:**
- Must be the owner (sole owner)
- Organization name must match for confirmation
- Password must be correct
- Confirmation text must exactly match "DELETE"

**Business Rules:**
- 30-day grace period before permanent deletion
- Owner receives confirmation email
- All users notified and lose access immediately
- Data archived and retained 7 years
- Cannot delete with pending invoices or unresolved transactions

**Database Impact:**
- Tables: organizations (status = 'pending_deletion', deletion_scheduled_at)
- No immediate hard deletes

**API Requirement:**
- DELETE /api/organizations/:id
- Request: { confirmation, password }
- Response: { message: "Organization scheduled for deletion in 30 days" }

**UI Requirement:**
- Loading state: Spinner during confirmation
- Empty state: Full-page warning with red styling
- Success state: "Deletion scheduled. You have 30 days to cancel."
- Error state: "Cannot delete: pending transactions" or "Incorrect password"

**Security:**
- Owner-only operation
- Password confirmation required
- All sessions for organization revoked

**Audit:**
- Log: org.deletion_scheduled, org.deletion_cancelled, org.deleted_permanently

**Dependencies:**
- ORG-001 (Organization must exist)
- AUTH-007 (Session revocation)
- SUB-004 (Subscription cancellation)

**Edge Cases:**
- Owner cancels deletion during grace period
- Multiple owners — all must agree to delete
- Organization has active subscription

**Tests:**
- Unit: Grace period calculation, cancellation logic
- Integration: Full deletion flow, grace period, cancellation, data archival

---

## Module 03 — Company

---

### CMP-001 — Create Company

| Field | Detail |
|-------|--------|
| **Module** | Company |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | owner, admin |

**Description:**
Organization owners and admins create a company (legal entity) within an organization. A company has its own financial year, GST registration, chart of accounts, and transactions. Multiple companies can exist under one organization.

**Preconditions:**
- User is authenticated with owner or admin role
- Organization exists and is active
- Subscription allows additional company

**Inputs:**
- Company name (2-200 characters)
- Legal name
- Address (line1, line2, city, state, pincode, country)
- State code (2-digit Indian state code)
- GSTIN (optional)
- PAN (optional)
- Phone, email
- Currency (default INR)
- Financial year start month (default April)

**Validation Rules:**
- Company name: 2-200 characters, unique within organization
- GSTIN: valid 15-character format if provided
- PAN: valid 10-character Indian PAN format if provided
- State code: valid 2-digit code from master list
- Pincode: 6-digit Indian pincode

**Business Rules:**
- Creates default chart of accounts (Groups + Ledgers) for Indian business
- Creates default financial year (April-March)
- Sets up default GST configuration
- Creates default warehouse ("Main Warehouse")
- Creator becomes company admin

**Database Impact:**
- Tables: companies (id, organization_id, name, legal_name, address, state_code, gstin, pan, phone, email, currency, status)
- Tables: financial_years (auto-created for current FY)
- Tables: chart_of_accounts_groups (default Indian groups)
- Tables: ledgers (default ledgers under groups)
- Tables: warehouses (default main warehouse)
- Indexes: unique on companies(organization_id, name), index on companies.gstin

**API Requirement:**
- POST /api/companies
- Request: { name, legal_name, address, state_code, gstin?, pan?, phone, email, currency?, fy_start_month? }
- Response: { company: {...}, financial_year: {...} }

**UI Requirement:**
- Loading state: Spinner on submit
- Empty state: Company creation wizard (multi-step form)
- Success state: Redirect to company dashboard
- Error state: Inline validation errors, duplicate name warning

**Security:**
- Owner or admin role required
- Company created within user's organization

**Audit:**
- Log: company.created with company details, creator user_id

**Dependencies:**
- ORG-001 (Organization must exist)
- SUB-001 (Subscription must allow company)

**Edge Cases:**
- Company limit reached on plan
- GSTIN already used by another company in same org
- Invalid state code

**Tests:**
- Unit: GSTIN validation, PAN validation, address validation
- Integration: Full creation flow, default accounts/FY/warehouse creation

---

### CMP-002 — Update Company Profile

| Field | Detail |
|-------|--------|
| **Module** | Company |
| **Priority** | P1 |
| **Maturity** | MVP |
| **Roles** | owner, admin |

**Description:**
Company owners and admins update the company's profile including address, GST registration details, and contact information. GSTIN or state code changes are logged as they affect GST calculations.

**Preconditions:**
- User is authenticated with owner or admin role
- Company exists and is active

**Inputs:**
- Company name, legal name (optional)
- Address fields (optional)
- State code (optional)
- GSTIN (optional)
- PAN (optional)
- Phone, email (optional)
- Logo, signature image (optional)

**Validation Rules:**
- Same validation as CMP-001 for updated fields
- GSTIN change irreversible without support ticket
- State code change requires confirmation

**Business Rules:**
- Name changes reflected in future invoices
- GSTIN changes logged with effective date
- State code change triggers CGST/SGST/IGST recalculation warning
- Logo stored in Supabase Storage, max 5MB

**Database Impact:**
- Tables: companies (updated fields)
- Tables: audit_log (GSTIN/state_code change tracking)

**API Requirement:**
- PATCH /api/companies/:id
- Request: Partial company fields
- Response: { company: {...} }

**UI Requirement:**
- Loading state: Save button spinner
- Empty state: Form with current values
- Success state: Toast "Company updated"
- Error state: Validation errors

**Security:**
- Owner or admin role required
- Same company (RLS)

**Audit:**
- Log: company.updated with changed fields, old/new values

**Dependencies:**
- CMP-001 (Company must exist)

**Edge Cases:**
- GSTIN change with pending GST returns
- State code change affecting ongoing invoices
- Logo upload failure

**Tests:**
- Unit: Field validation, GSTIN change logging
- Integration: Profile update, state code change warnings

---

### CMP-003 — Set Active Financial Year

| Field | Detail |
|-------|--------|
| **Module** | Company |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | owner, admin, accountant |

**Description:**
Users switch the active financial year for the company. All reports, dashboards, and transactions are scoped to the active financial year. Indian businesses typically use April to March.

**Preconditions:**
- User is authenticated with appropriate role
- At least one financial year exists for the company

**Inputs:**
- Financial year ID to activate

**Validation Rules:**
- Financial year must belong to the current company
- Financial year must not overlap with other active FY

**Business Rules:**
- Only one financial year can be active at a time
- Switching FY updates all report date ranges
- Previous FY data remains accessible (read-only for closed FY)
- New FY can be created from FY management screen

**Database Impact:**
- Tables: financial_years (is_active flag)
- Indexes: financial_years(company_id, is_active)

**API Requirement:**
- POST /api/companies/:id/activate-fy
- Request: { financial_year_id }
- Response: { financial_year: {...} }

**UI Requirement:**
- Loading state: Spinner during switch
- Empty state: Dropdown of available FYs
- Success state: All views update to new FY context
- Error state: "Cannot switch to closed financial year"

**Security:**
- Owner, admin, or accountant role required
- Same company (RLS)

**Audit:**
- Log: company.fy_switched with from_fy, to_fy

**Dependencies:**
- CMP-001 (Company must exist)
- ACC-011 (Financial year close logic)

**Edge Cases:**
- Switching to a FY that has no opening balances
- Switching while on a page that depends on FY
- Two FYs with same year but different date ranges

**Tests:**
- Unit: Active FY logic, overlap check
- Integration: Switch FY, data scoped correctly, previous FY read-only

---

### CMP-004 — Company GST Registration Details

| Field | Detail |
|-------|--------|
| **Module** | Company |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | owner, admin |

**Description:**
Manages GST registration details for a company including GSTIN, registration date, composition scheme status, and state of registration. These details are used across all GST calculations, e-invoicing, e-way bills, and GST return preparation.

**Preconditions:**
- User is authenticated with owner or admin role
- Company exists

**Inputs:**
- GSTIN (15 characters)
- Registration date
- Composition scheme (boolean)
- GST username and password (for API integration)
- E-invoice portal credentials (optional)

**Validation Rules:**
- GSTIN valid format: 2-digit state code + 10-char PAN + 1 entity + Z + checksum
- Registration date cannot be in the future
- E-invoice credentials validated on save

**Business Rules:**
- Composition scheme status affects GST calculation (no input tax credit)
- GST portal credentials encrypted and stored
- GSTIN validation triggers portal lookup
- Details cached for performance

**Database Impact:**
- Tables: company_gst_details (id, company_id, gstin, registration_date, composition_scheme, gst_username, gst_password_encrypted, einvoice_credentials_encrypted)
- Indexes: unique on company_id, index on gstin

**API Requirement:**
- PUT /api/companies/:id/gst-details
- Request: { gstin, registration_date, composition_scheme, gst_username?, gst_password?, einvoice_credentials? }
- Response: { gst_details: {...} }

**UI Requirement:**
- Loading state: Spinner during save, spinner during GSTIN validation
- Empty state: Form with GST fields
- Success state: Toast "GST details updated", GSTIN validation badge
- Error state: "Invalid GSTIN", "Cannot connect to GST portal"

**Security:**
- Owner or admin role required
- Passwords encrypted with AES-256
- Never returned in API responses

**Audit:**
- Log: company.gst_details_updated with changed fields (excluding secrets)

**Dependencies:**
- CMP-001 (Company must exist)
- GST-001 (GSTIN validation)

**Edge Cases:**
- GSTIN validation portal unavailable
- Changing composition scheme mid-year
- Invalid GSTIN checksum

**Tests:**
- Unit: GSTIN format validation, checksum verification
- Integration: Save credentials, GSTIN portal validation, composition scheme logic

---

## Module 04 — Branch

---

### BRN-001 — Create Branch

| Field | Detail |
|-------|--------|
| **Module** | Branch |
| **Priority** | P1 |
| **Maturity** | V1 |
| **Roles** | owner, admin |

**Description:**
Organizations with multiple physical locations create branches. Each branch has its own address, contact details, and can be assigned a manager. Branches are used for location-wise inventory tracking, sales reporting, and user assignment.

**Preconditions:**
- User is authenticated with owner or admin role
- Company exists and is active
- Subscription allows multiple branches

**Inputs:**
- Branch name (2-100 characters)
- Address (line1, line2, city, state, pincode, country)
- Phone, email
- Branch code (unique, auto-generated or manual)
- GSTIN (optional, for separate GST registration)

**Validation Rules:**
- Branch name: 2-100 characters, unique within company
- Branch code: 3-10 alphanumeric characters, unique
- Address: valid Indian address format
- GSTIN: valid format if provided

**Business Rules:**
- Default branch "Main" created with company
- Branch can have separate GSTIN
- Branch-level inventory tracked via warehouses
- Users assigned to specific branches

**Database Impact:**
- Tables: branches (id, company_id, name, code, address, phone, email, gstin, is_active, manager_id)
- Indexes: unique on branches(company_id, name), unique on branches(company_id, code)

**API Requirement:**
- POST /api/companies/:companyId/branches
- Request: { name, code?, address, phone, email, gstin?, manager_id? }
- Response: { branch: {...} }

**UI Requirement:**
- Loading state: Spinner on submit
- Empty state: Branch creation form
- Success state: Toast "Branch created", redirect to branch list
- Error state: Inline validation, duplicate name/code error

**Security:**
- Owner or admin role required
- Same company (RLS)

**Audit:**
- Log: branch.created with branch details

**Dependencies:**
- CMP-001 (Company must exist)

**Edge Cases:**
- Branch limit reached on subscription
- Invalid GSTIN for branch
- Same address as another branch

**Tests:**
- Unit: Code generation, GSTIN validation
- Integration: Create branch, assign manager, default branch handling

---

### BRN-002 — Update Branch Details

| Field | Detail |
|-------|--------|
| **Module** | Branch |
| **Priority** | P1 |
| **Maturity** | V1 |
| **Roles** | owner, admin, branch_manager |

**Description:**
Branch details including address, contact information, manager assignment, and GSTIN can be updated. Branch managers can update basic details; GSTIN changes require owner/admin.

**Preconditions:**
- User is authenticated with appropriate role
- Branch exists and is active

**Inputs:**
- Branch name, address, phone, email (optional)
- Manager ID (optional)
- GSTIN (optional, owner/admin only)

**Validation Rules:**
- Name: unique within company if changed
- Address: valid format
- Manager must be active company user

**Business Rules:**
- Branch manager can update contact details
- GSTIN change requires owner/admin
- Name change does not affect historical transactions
- Manager reassignment logged

**Database Impact:**
- Tables: branches (updated fields)

**API Requirement:**
- PATCH /api/branches/:id
- Request: Partial branch fields
- Response: { branch: {...} }

**UI Requirement:**
- Loading state: Save button spinner
- Empty state: Pre-filled form
- Success state: Toast "Branch updated"
- Error state: Validation errors

**Security:**
- Branch manager can update basic fields
- Owner/admin required for GSTIN changes
- Same company (RLS)

**Audit:**
- Log: branch.updated with changed fields

**Dependencies:**
- BRN-001 (Branch must exist)

**Edge Cases:**
- Changing manager who has pending approvals
- Deactivating the only active branch
- GSTIN change with pending GST returns

**Tests:**
- Unit: Field validation, permission check
- Integration: Update flow, manager reassignment, permission enforcement

---

### BRN-003 — Deactivate Branch

| Field | Detail |
|-------|--------|
| **Module** | Branch |
| **Priority** | P1 |
| **Maturity** | V1 |
| **Roles** | owner, admin |

**Description:**
Branches are deactivated when no longer operational. Deactivation hides the branch from active selections but preserves historical data. Assigned users are notified and reassigned.

**Preconditions:**
- User is authenticated with owner or admin role
- Branch exists and is active
- Not the last active branch

**Inputs:**
- Branch ID
- Confirmation

**Validation Rules:**
- Cannot deactivate the last active branch
- Confirmation required

**Business Rules:**
- Deactivated branch hidden from dropdowns
- Historical transactions remain intact
- Users reassigned to default branch
- Stock in branch warehouses frozen

**Database Impact:**
- Tables: branches (is_active = false)

**API Requirement:**
- DELETE /api/branches/:id
- Request: { confirmation: true }
- Response: { message: "Branch deactivated" }

**UI Requirement:**
- Loading state: Spinner during deactivation
- Empty state: Confirmation dialog
- Success state: Branch moved to inactive list
- Error state: "Cannot deactivate last active branch"

**Security:**
- Owner or admin role required
- Same company (RLS)

**Audit:**
- Log: branch.deactivated with branch details

**Dependencies:**
- BRN-001 (Branch must exist)
- INV-001 (Stock levels)

**Edge Cases:**
- Last branch cannot be deactivated
- Branch has pending stock transfers
- Users with pending approvals in branch

**Tests:**
- Unit: Last branch check, user reassignment
- Integration: Deactivation, user reassignment, stock freeze

---

### BRN-004 — Assign Branch Manager

| Field | Detail |
|-------|--------|
| **Module** | Branch |
| **Priority** | P1 |
| **Maturity** | V1 |
| **Roles** | owner, admin |

**Description:**
A company user is assigned as branch manager with elevated permissions within the branch scope including approving transactions, managing branch users, and viewing branch-level reports.

**Preconditions:**
- User is authenticated with owner or admin role
- Target user exists in the company
- Branch exists and is active

**Inputs:**
- Branch ID
- User ID (of the new manager)

**Validation Rules:**
- Target user must be active company member
- User must have appropriate base role

**Business Rules:**
- Branch manager gets branch-scoped permissions
- Previous manager demoted to regular user
- Manager assignment logged with timestamp
- Manager can approve branch-level transactions

**Database Impact:**
- Tables: branches (manager_id updated)
- Tables: user_branch_roles (role = 'branch_manager' added)

**API Requirement:**
- PUT /api/branches/:id/manager
- Request: { user_id }
- Response: { branch: {...} }

**UI Requirement:**
- Loading state: Spinner during assignment
- Empty state: User dropdown to select manager
- Success state: Toast "Branch manager assigned"
- Error state: "User not found" or "User already manages another branch"

**Security:**
- Owner or admin role required
- Same company (RLS)

**Audit:**
- Log: branch.manager_assigned with old_manager, new_manager

**Dependencies:**
- BRN-001 (Branch must exist)
- USR-004 (User role assignment)

**Edge Cases:**
- Removing manager without assigning new one
- Manager is the user being removed from company
- Multiple branch management

**Tests:**
- Unit: Manager assignment logic
- Integration: Assign manager, reassign, permission propagation

---

### BRN-005 — Branch-Level Inventory View

| Field | Detail |
|-------|--------|
| **Module** | Branch |
| **Priority** | P2 |
| **Maturity** | V2 |
| **Roles** | owner, admin, branch_manager, inventory_manager |

**Description:**
Branch managers and inventory managers view inventory levels specific to their branch's warehouses including current stock, stock movements, and low-stock alerts filtered by branch location.

**Preconditions:**
- User is authenticated with appropriate role
- Branch has associated warehouses
- Inventory data exists

**Inputs:**
- Branch ID (from context)
- Date range (optional)
- Product filter (optional)

**Validation Rules:**
- Branch must belong to user's company
- User must have branch-level access

**Business Rules:**
- Shows only stock from branch's warehouses
- Aggregates stock across branch warehouses
- Low-stock alerts scoped to branch
- Can drill down to warehouse-level details

**Database Impact:**
- Tables: stock_balances (filtered by warehouse → branch mapping)
- Tables: stock_ledger (filtered by branch)
- Tables: warehouses (branch_id filter)

**API Requirement:**
- GET /api/branches/:id/inventory?date_range=&product_id=
- Response: [{ product_id, product_name, total_stock, warehouses: [...] }]

**UI Requirement:**
- Loading state: Skeleton table
- Empty state: "No inventory data for this branch"
- Success state: Table with product stock levels
- Error state: "Access denied" or error toast

**Security:**
- Branch manager sees only their branch
- Admin/owner sees all branches
- Same company (RLS)

**Audit:**
- No audit needed (read-only)

**Dependencies:**
- BRN-001 (Branch must exist)
- INV-001 (Stock levels)
- WHS-001 (Warehouses)

**Edge Cases:**
- Branch with no warehouses
- Stock in transit between branch warehouses
- User with access to multiple branches

**Tests:**
- Unit: Branch filter logic
- Integration: Filtered inventory view, drill-down to warehouse

---


## Module 05 — Users

---

### USR-001 — Invite User to Company

| Field | Detail |
|-------|--------|
| **Module** | Users |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | owner, admin |

**Description:**
Organization owners and admins invite new users to join their company via email. The invitee receives an email with a link to accept and join with the specified role.

**Preconditions:**
- User is authenticated with owner or admin role
- Company exists and is active
- Subscription allows additional users

**Inputs:**
- Email address of invitee
- Role to assign
- Optional: Branch assignment
- Welcome message (optional)

**Validation Rules:**
- Email must be valid format
- Email must not already be a company member
- Role must be from valid role enum
- Maximum 50 pending invitations per company

**Business Rules:**
- Invitation email sent with unique link
- Link expires after 7 days
- Pending invitations shown in user list
- Invitee prompted to register if no account
- Re-send available (max 3 times)

**Database Impact:**
- Tables: invitations (id, company_id, email, role, invited_by, token, expires_at, status)
- Indexes: unique on invitations(company_id, email), index on invitations.token

**API Requirement:**
- POST /api/companies/:id/invitations
- Request: { email, role, branch_id?, message? }
- Response: { invitation: {...} }

**UI Requirement:**
- Loading state: Spinner on send
- Empty state: Invitation form with email input
- Success state: Toast "Invitation sent to {email}"
- Error state: "User already invited" or "User limit reached"

**Security:**
- Owner or admin role required
- Rate limited to 10 invitations per hour
- Same company (RLS)

**Audit:**
- Log: user.invitation_sent with email, role, invited_by

**Dependencies:**
- USR-002 (Accept invitation)
- SUB-001 (Subscription user limits)
- ROL-003 (Role-based access)

**Edge Cases:**
- Inviting user already in another company
- Invitation link expired
- Company at user limit
- Re-inviting same email after cancellation

**Tests:**
- Unit: Token generation, expiry check
- Integration: Full invitation flow, email delivery, accept flow

---

### USR-002 — Accept Invitation & Onboard

| Field | Detail |
|-------|--------|
| **Module** | Users |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | All (invited users) |

**Description:**
Invited users accept an invitation to join a company. Existing BizKhata users are added directly; new users register first. After accepting, they are redirected to the company dashboard with their assigned role.

**Preconditions:**
- User has a valid, non-expired invitation token
- Company is active

**Inputs:**
- Invitation token (from email link)
- Registration details (if new user)

**Validation Rules:**
- Token must be valid and not expired
- Token must not be already used
- If registering: standard registration validation applies

**Business Rules:**
- If already logged in, acceptance is immediate
- If not logged in, prompted to log in or register
- User added to organization_members with assigned role
- Invitation status changes to 'accepted'
- Welcome notification sent

**Database Impact:**
- Tables: invitations (status = 'accepted', accepted_at)
- Tables: organization_members (new record)
- Tables: company_members (new record)

**API Requirement:**
- POST /api/invitations/:token/accept
- Request: { user_id? }
- Response: { company: {...}, role: {...} }

**UI Requirement:**
- Loading state: "Joining company..." spinner
- Empty state: Registration/login form (if not authenticated)
- Success state: Redirect to company dashboard
- Error state: "Invitation expired" or "Invitation already accepted"

**Security:**
- Token single-use
- Email on invitation must match authenticated user's email

**Audit:**
- Log: user.invitation_accepted with user_id, company_id

**Dependencies:**
- USR-001 (Invitation must exist)
- AUTH-001 (Registration for new users)

**Edge Cases:**
- Invitation email doesn't match logged-in user's email
- User declines invitation
- Company deactivated before acceptance

**Tests:**
- Unit: Token validation, user creation
- Integration: Accept with existing account, accept with new registration, expired token

---

### USR-003 — Update User Profile

| Field | Detail |
|-------|--------|
| **Module** | Users |
| **Priority** | P1 |
| **Maturity** | MVP |
| **Roles** | All authenticated users |

**Description:**
Users update their personal profile including name, phone, avatar, and timezone. Admins can also update user details for company members. Changes are reflected across all organizations.

**Preconditions:**
- User is authenticated
- Profile exists

**Inputs:**
- Full name (optional)
- Phone number (optional)
- Avatar image (optional)
- Timezone (optional)
- Language preference (optional)

**Validation Rules:**
- Name: 2-100 characters
- Phone: valid format if provided
- Avatar: max 2MB, PNG/JPG
- Timezone: valid IANA timezone

**Business Rules:**
- Profile changes are global (affect all organizations)
- Avatar stored in Supabase Storage
- Admin can update other user's name and phone
- Phone verification required for WhatsApp features

**Database Impact:**
- Tables: profiles (updated fields)
- Storage: avatar file in Supabase Storage

**API Requirement:**
- PATCH /api/profile
- Request: { full_name?, phone?, avatar?, timezone?, language? }
- Response: { profile: {...} }

**UI Requirement:**
- Loading state: Save button spinner
- Empty state: Profile form with current values
- Success state: Toast "Profile updated"
- Error state: Validation errors

**Security:**
- Users can only update their own profile (except admin)
- Avatar URL is sanitized

**Audit:**
- Log: user.profile_updated with changed fields

**Dependencies:**
- AUTH-001 (User must exist)

**Edge Cases:**
- Avatar upload fails
- Phone number already used by another user
- Timezone change affects report dates

**Tests:**
- Unit: Phone validation, timezone validation
- Integration: Profile update, avatar upload, admin update

---

### USR-004 — Assign Role to User

| Field | Detail |
|-------|--------|
| **Module** | Users |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | owner, admin |

**Description:**
Owners and admins change the role of company members. Role changes take effect immediately and affect permissions across all modules. Special care when changing owner or admin roles.

**Preconditions:**
- User is authenticated with owner or admin role
- Target user is active company member
- New role is valid

**Inputs:**
- User ID
- New role (from role enum)

**Validation Rules:**
- New role must be from valid role list
- Cannot demote the last owner
- Admin cannot change owner's role (only owner can)
- Cannot assign role higher than own (non-owner)

**Business Rules:**
- Role change logged with old and new values
- User's session permissions update on next API call
- Cannot demote last owner
- Owner can change any role
- Admin assigns roles up to their level

**Database Impact:**
- Tables: organization_members (role updated)
- Tables: audit_log (role change record)

**API Requirement:**
- PUT /api/companies/:companyId/users/:userId/role
- Request: { role }
- Response: { user: { id, role } }

**UI Requirement:**
- Loading state: Spinner during role change
- Empty state: Role dropdown with current role selected
- Success state: Toast "Role updated to {role}"
- Error state: "Cannot change owner role" or "Cannot demote last owner"

**Security:**
- Owner or admin role required
- Hierarchical role enforcement
- Same company (RLS)

**Audit:**
- Log: user.role_changed with user_id, old_role, new_role, changed_by

**Dependencies:**
- ROL-003 (Role-based access check)
- USR-001 (User must be in company)

**Edge Cases:**
- Changing last owner's role
- Admin trying to assign owner role
- Self-demotion

**Tests:**
- Unit: Role hierarchy validation
- Integration: Role change, permission propagation, owner protection

---

### USR-005 — Remove User from Company

| Field | Detail |
|-------|--------|
| **Module** | Users |
| **Priority** | P1 |
| **Maturity** | MVP |
| **Roles** | owner, admin |

**Description:**
Owners and admins remove a user from the company. Removed users lose all access. Historical transactions are preserved but attributed to a "Removed User" placeholder. The removed user receives a notification.

**Preconditions:**
- User is authenticated with owner or admin role
- Target user is active company member
- Target user is not the last owner

**Inputs:**
- User ID
- Confirmation

**Validation Rules:**
- Cannot remove the last owner
- Cannot remove yourself (use deactivation)
- Confirmation required

**Business Rules:**
- User's sessions invalidated for the company
- Historical data preserved
- User removed from all branch assignments
- Pending invitations from user cancelled

**Database Impact:**
- Tables: organization_members (membership deleted or status = 'removed')
- Tables: user_branch_roles (all deleted)
- Tables: auth.sessions (revoked for removed user)

**API Requirement:**
- DELETE /api/companies/:companyId/users/:userId
- Request: { confirmation: true }
- Response: { message: "User removed from company" }

**UI Requirement:**
- Loading state: Spinner during removal
- Empty state: Confirmation dialog with warning
- Success state: User removed from list
- Error state: "Cannot remove last owner" or "Cannot remove yourself"

**Security:**
- Owner or admin role required
- Cannot remove equal or higher role (except owner)
- Same company (RLS)

**Audit:**
- Log: user.removed with user_id, removed_by, company_id

**Dependencies:**
- USR-006 (User list)
- ROL-003 (Permission check)
- AUTH-007 (Session revocation)

**Edge Cases:**
- Removing user who has pending approvals
- Removing user who has unsaved drafts
- User is also a branch manager

**Tests:**
- Unit: Last owner check, permission validation
- Integration: Remove user, session revocation, data preservation

---

### USR-006 — List Company Users

| Field | Detail |
|-------|--------|
| **Module** | Users |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | owner, admin, accountant, viewer |

**Description:**
Authorized users view a list of all company users including roles, status, branch assignments, and last active time. Supports filtering by role, status, and search.

**Preconditions:**
- User is authenticated with appropriate role
- Company exists and is active

**Inputs:**
- Role filter (optional)
- Status filter (active/invited/removed)
- Search query (name or email)
- Page number and page size

**Validation Rules:**
- Pagination: page >= 1, page_size 1-100

**Business Rules:**
- Shows user name, email, role, status, branches, last active
- Invitations shown with 'invited' status
- Pending invitations listed separately
- Sorted by role hierarchy then name

**Database Impact:**
- Tables: organization_members (join with profiles)
- Indexes: organization_members(company_id, role), profiles(full_name) (trigram)

**API Requirement:**
- GET /api/companies/:companyId/users?role=&status=&search=&page=&page_size=
- Response: { users: [...], total, page, page_size }

**UI Requirement:**
- Loading state: Skeleton table rows
- Empty state: "No users found" or "Invite your first team member"
- Success state: Table with user rows, pagination
- Error state: Error toast

**Security:**
- Authenticated company member required
- Same company (RLS)
- Viewer can see list but not edit

**Audit:**
- No audit needed (read-only)

**Dependencies:**
- USR-001 (Invitations)
- USR-002 (Accepted invitations)

**Edge Cases:**
- Large company with many users (pagination)
- User with multiple roles
- Recently removed user still showing

**Tests:**
- Unit: Pagination, filter logic
- Integration: List users, filter by role, search, pagination

---

## Module 06 — Roles & Permissions

---

### ROL-001 — Create Custom Role

| Field | Detail |
|-------|--------|
| **Module** | Roles & Permissions |
| **Priority** | P1 |
| **Maturity** | V1 |
| **Roles** | owner |

**Description:**
The organization owner creates custom roles beyond built-in roles. Custom roles are defined by selecting specific permissions from a permission tree for fine-grained access control.

**Preconditions:**
- User is authenticated as owner
- Company exists

**Inputs:**
- Role name (2-50 characters, unique)
- Role description (optional, max 200 characters)
- Selected permissions (array of permission IDs)

**Validation Rules:**
- Role name: 2-50 characters, unique within company
- At least one permission must be selected
- Cannot use names of built-in roles
- Maximum 20 custom roles per company

**Business Rules:**
- Custom roles are company-specific
- Built-in roles cannot be modified
- Custom roles can be assigned to users
- Role creation logged for audit

**Database Impact:**
- Tables: custom_roles (id, company_id, name, description, created_by)
- Tables: role_permissions (role_id, permission_id)
- Indexes: unique on custom_roles(company_id, name)

**API Requirement:**
- POST /api/companies/:companyId/roles
- Request: { name, description?, permissions: [...] }
- Response: { role: {...} }

**UI Requirement:**
- Loading state: Spinner on save
- Empty state: Permission tree with checkboxes
- Success state: Toast "Custom role created"
- Error state: "Role name already exists" or "Permission limit reached"

**Security:**
- Owner-only operation
- Same company (RLS)

**Audit:**
- Log: role.created with role name, permissions count

**Dependencies:**
- ROL-002 (Permission assignment)
- ROL-003 (Access check)

**Edge Cases:**
- Creating role with no permissions
- Maximum custom role limit reached
- Creating role with name similar to built-in role

**Tests:**
- Unit: Permission validation, name uniqueness
- Integration: Create role, assign to user, verify access

---

### ROL-002 — Assign Permissions to Role

| Field | Detail |
|-------|--------|
| **Module** | Roles & Permissions |
| **Priority** | P1 |
| **Maturity** | V1 |
| **Roles** | owner |

**Description:**
The owner assigns module-level permissions to roles. Permissions control create, read, update, delete, approve, and export operations across all modules. Built-in roles have predefined permissions; custom roles are configurable.

**Preconditions:**
- User is authenticated as owner
- Role exists (built-in or custom)

**Inputs:**
- Role ID
- Permission set (array of permission objects with module, action, scope)

**Validation Rules:**
- Role must exist and be editable
- Permissions must be from valid permission list
- No duplicate permissions

**Business Rules:**
- Each permission controls module + action combination
- Actions: create, read, update, delete, approve, export
- Scopes: own, branch, company (data visibility)
- Changes take effect immediately
- Built-in roles have fixed permissions

**Database Impact:**
- Tables: role_permissions (role_id, permission_id, updated_at)
- Indexes: composite on role_permissions(role_id, permission_id)

**API Requirement:**
- PUT /api/companies/:companyId/roles/:roleId/permissions
- Request: { permissions: [{ module, action, scope }] }
- Response: { role: {...}, permissions: [...] }

**UI Requirement:**
- Loading state: Spinner on save
- Empty state: Permission matrix (grid of modules x actions)
- Success state: Toast "Permissions updated"
- Error state: "Cannot modify built-in role permissions"

**Security:**
- Owner-only operation
- Cannot grant permissions above own level
- Same company (RLS)

**Audit:**
- Log: role.permissions_updated with old/new permission set

**Dependencies:**
- ROL-001 (Role must exist)
- ROL-003 (Access check uses these permissions)

**Edge Cases:**
- Removing permission that active user relies on
- Permission change while user is logged in
- Conflicting permissions

**Tests:**
- Unit: Permission resolution logic
- Integration: Update permissions, verify access change for assigned users

---

### ROL-003 — Role-Based Access Check (fn_has_access)

| Field | Detail |
|-------|--------|
| **Module** | Roles & Permissions |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | All (system function) |

**Description:**
The core RLS function fn_has_access verifies that the authenticated user has the required role/permission for every data query. It checks organization membership, company assignment, role permissions, and data scope. This is the backbone of the security model.

**Preconditions:**
- User is authenticated (JWT available)
- Company context is set
- RLS policies enabled on all tables

**Inputs:**
- User ID (from JWT)
- Company ID (from session/context)
- Required permission (module + action)
- Data scope (own, branch, company)

**Validation Rules:**
- User must be authenticated
- User must be member of the organization
- User must be assigned to the company
- User's role must include the required permission

**Business Rules:**
- Owner: full access to all operations
- Admin: full access except owner-level operations
- Accountant: read/write on accounting, no delete
- Sales roles: scoped to sales module
- Viewer: read-only access to assigned modules
- Branch scope: user sees only their branch data
- Company scope: user sees all company data

**Database Impact:**
- Tables: organization_members (role check)
- Tables: company_members (company assignment)
- Tables: role_permissions (permission resolution)
- Tables: user_branch_roles (branch scope)
- SQL function: fn_has_access(user_id, company_id, permission, scope)

**API Requirement:**
- Internal SQL function (not a REST endpoint)
- Called by RLS policies on every table query
- Returns boolean

**UI Requirement:**
- N/A (server-side function)
- UI reflects permissions by hiding/disabling unauthorized actions

**Security:**
- Core security function — any bypass is a critical vulnerability
- Always executes in database context (cannot be skipped)
- Logs failed access attempts

**Audit:**
- Log: access.denied with user_id, resource, permission, timestamp
- Throttled: max 100 log entries per minute

**Dependencies:**
- ROL-001 (Roles must exist)
- ROL-002 (Permissions must be assigned)
- USR-004 (User role assignment)
- SEC-001 (RLS enforcement)

**Edge Cases:**
- User role changed while query is in flight
- Custom role with no permissions
- Simultaneous role update and data access
- Owner role cannot be removed

**Tests:**
- Unit: Permission resolution logic for each role
- Integration: RLS enforcement on all tables, scope-based filtering
- Security: Penetration test for permission bypass

---

### ROL-004 — Default Role Assignment on Join

| Field | Detail |
|-------|--------|
| **Module** | Roles & Permissions |
| **Priority** | P1 |
| **Maturity** | MVP |
| **Roles** | owner, admin |

**Description:**
When a new user accepts an invitation, they are automatically assigned a default role. Owners and admins configure which role is the default for new members.

**Preconditions:**
- User is authenticated with owner or admin role
- Company exists

**Inputs:**
- Default role ID (from role list)

**Validation Rules:**
- Default role must be from valid role list
- Must be a role that exists in the company

**Business Rules:**
- Default role is 'viewer' if not configured
- Admin can set any role as default (except owner)
- Applies to all new members via invitation
- Does not apply to owner (always owner)

**Database Impact:**
- Tables: company_settings (default_role_id)

**API Requirement:**
- PUT /api/companies/:companyId/settings/default-role
- Request: { role_id }
- Response: { setting: {...} }

**UI Requirement:**
- Loading state: Spinner on save
- Empty state: Role dropdown with current default selected
- Success state: Toast "Default role updated"
- Error state: "Invalid role"

**Security:**
- Owner or admin role required
- Same company (RLS)

**Audit:**
- Log: role.default_changed with old_role, new_role

**Dependencies:**
- USR-001 (Invitation uses default role)
- ROL-001 (Roles must exist)

**Edge Cases:**
- Setting owner as default role (blocked)
- Changing default while invitations are pending

**Tests:**
- Unit: Default role selection logic
- Integration: New member gets default role, owner role blocked

---

### ROL-005 — Clone Existing Role

| Field | Detail |
|-------|--------|
| **Module** | Roles & Permissions |
| **Priority** | P2 |
| **Maturity** | V1 |
| **Roles** | owner |

**Description:**
The owner clones an existing role (built-in or custom) to quickly create a new custom role with the same permission set. Useful for creating variations without manually selecting permissions.

**Preconditions:**
- User is authenticated as owner
- Source role exists
- Custom role limit not reached

**Inputs:**
- Source role ID
- New role name
- New role description (optional)

**Validation Rules:**
- Source role must exist
- New name must be unique
- Maximum custom roles not reached

**Business Rules:**
- Cloned role is new custom role (not linked to source)
- All permissions copied
- New role can be modified independently
- Cloned from built-in role preserves exact permissions

**Database Impact:**
- Tables: custom_roles (new record)
- Tables: role_permissions (copied from source)

**API Requirement:**
- POST /api/companies/:companyId/roles/:sourceRoleId/clone
- Request: { name, description? }
- Response: { role: {...} }

**UI Requirement:**
- Loading state: Spinner on clone
- Empty state: Name input for cloned role
- Success state: Redirect to role permissions editor
- Error state: "Role name exists" or "Limit reached"

**Security:**
- Owner-only operation
- Same company (RLS)

**Audit:**
- Log: role.cloned with source_role, new_role

**Dependencies:**
- ROL-001 (Custom role creation)
- ROL-002 (Permission assignment)

**Edge Cases:**
- Cloning a role modified since creation
- Cloning a role with conditional permissions

**Tests:**
- Unit: Permission copy logic
- Integration: Clone built-in role, clone custom role, verify permissions match

---


## Module 07 — Customers

---

### CUS-001 — Create Customer

| Field | Detail |
|-------|--------|
| **Module** | Customers |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | owner, admin, accountant, sales_manager, sales_user |

**Description:**
Users create a customer record with contact details, GSTIN, billing/shipping addresses, and payment terms. Customers are used in sales invoices, quotations, and receivable tracking. Duplicate detection by GSTIN and phone/email is performed.

**Preconditions:**
- User is authenticated with appropriate role
- Company exists and is active
- Financial year is set

**Inputs:**
- Customer name (2-200 characters)
- Trade name / display name (optional)
- GSTIN (optional)
- PAN (optional)
- Phone (primary, optional but recommended)
- Email (optional)
- Billing address (line1, line2, city, state, pincode, country)
- Shipping address (optional)
- Payment terms (Net 30, Net 15, etc.)
- Credit limit (optional, in INR)
- Opening balance (optional)
- WhatsApp number (optional)
- Contact person name
- Notes (optional)

**Validation Rules:**
- Name: 2-200 characters
- GSTIN: valid 15-character format if provided
- PAN: valid 10-character format if provided
- Phone: valid Indian format
- Email: valid format
- State: valid 2-digit state code
- Credit limit: non-negative number
- Opening balance: signed number (positive = receivable)

**Business Rules:**
- Duplicate GSTIN check with warning
- Duplicate phone/email check with warning
- Customer code auto-generated (CUS-0001, CUS-0002)
- Default payment terms from company settings
- State determines CGST/SGST vs IGST
- Customer ledger auto-created in chart of accounts

**Database Impact:**
- Tables: customers (id, company_id, code, name, trade_name, gstin, pan, phone, email, billing_address, shipping_address, payment_terms, credit_limit, opening_balance, whatsapp_number, contact_person, notes, is_active)
- Tables: ledgers (auto-created for customer)
- Tables: stock_balances (linked for advance stock)
- Indexes: unique on customers(company_id, code), index on customers.gstin, trigram on customers.name

**API Requirement:**
- POST /api/companies/:companyId/customers
- Request: All customer fields
- Response: { customer: {...} }

**UI Requirement:**
- Loading state: Spinner on save
- Empty state: Customer creation form
- Success state: Toast "Customer created", redirect to customer detail
- Error state: Inline validation, duplicate warnings

**Security:**
- Role-based access per ROL-003
- Same company (RLS)

**Audit:**
- Log: customer.created with customer details

**Dependencies:**
- CMP-001 (Company must exist)
- CMP-003 (Active financial year)
- ACC-002 (Ledger creation)

**Edge Cases:**
- GSTIN already exists for another customer
- Customer with same name as supplier
- Missing state code (defaults to company state)
- Opening balance creates journal entry

**Tests:**
- Unit: GSTIN validation, duplicate check, code generation
- Integration: Full creation flow, ledger auto-creation, address validation

---

### CUS-002 — Update Customer Details

| Field | Detail |
|-------|--------|
| **Module** | Customers |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | owner, admin, accountant, sales_manager, sales_user |

**Description:**
Authorized users update customer information including contact details, addresses, GSTIN, payment terms, and credit limits. GSTIN or state code changes are logged and affect future invoice GST calculations.

**Preconditions:**
- Customer exists and is active
- User has appropriate role

**Inputs:**
- Customer ID
- Any customer field (partial update)

**Validation Rules:**
- Same validation as CUS-001 for updated fields
- GSTIN change logged with old value
- State change triggers GST warning

**Business Rules:**
- Name changes reflected in future invoices
- Historical invoices retain original customer data
- GSTIN change affects future invoices
- Credit limit change immediate

**Database Impact:**
- Tables: customers (updated fields)
- Tables: audit_log (GSTIN/state change)

**API Requirement:**
- PATCH /api/customers/:id
- Request: Partial customer fields
- Response: { customer: {...} }

**UI Requirement:**
- Loading state: Save button spinner
- Empty state: Pre-filled form
- Success state: Toast "Customer updated"
- Error state: Validation errors

**Security:**
- Role-based access per ROL-003
- Same company (RLS)

**Audit:**
- Log: customer.updated with changed fields

**Dependencies:**
- CUS-001 (Customer must exist)

**Edge Cases:**
- GSTIN change while pending invoices exist
- Removing phone number used for WhatsApp

**Tests:**
- Unit: Field validation, change logging
- Integration: Update flow, GSTIN change handling

---

### CUS-003 — List & Filter Customers

| Field | Detail |
|-------|--------|
| **Module** | Customers |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | owner, admin, accountant, sales_manager, sales_user, viewer |

**Description:**
Users view a searchable, filterable, sortable list of all customers. Supports search by name, code, GSTIN, phone, email. Filters include status, state, and balance range. Sorting by name, code, balance, and last transaction date.

**Preconditions:**
- User is authenticated with appropriate role
- Company has customers

**Inputs:**
- Search query
- Status filter (active, inactive, all)
- State filter
- Balance range (min, max)
- Sort field and direction
- Page number and page size

**Validation Rules:**
- Pagination: valid page and page_size
- Balance range: min <= max

**Business Rules:**
- Default sort: name ascending
- Shows: code, name, phone, email, state, outstanding balance
- Inactive customers shown with muted styling
- Quick actions: view, edit, create invoice

**Database Impact:**
- Tables: customers (read with filters)
- Tables: ledgers (balance subquery)
- Indexes: trigram search on name, index on code, gstin, phone

**API Requirement:**
- GET /api/customers?search=&status=&state=&min_balance=&max_balance=&sort=&page=&page_size=
- Response: { customers: [...], total, page, page_size }

**UI Requirement:**
- Loading state: Skeleton table rows
- Empty state: "No customers yet. Add your first customer."
- Success state: Data table with pagination
- Error state: Error toast

**Security:**
- Role-based access per ROL-003
- Same company (RLS)

**Audit:**
- No audit needed (read-only)

**Dependencies:**
- CUS-001 (Customers must exist)

**Edge Cases:**
- No customers (empty state)
- Very large customer list (pagination)
- Search with special characters

**Tests:**
- Unit: Filter logic, sort logic, pagination
- Integration: Search, filter, sort, pagination accuracy

---

### CUS-004 — Customer Ledger View

| Field | Detail |
|-------|--------|
| **Module** | Customers |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | owner, admin, accountant, sales_manager, sales_user, viewer |

**Description:**
Users view a detailed ledger (account statement) for a specific customer showing all transactions, payments, invoices, and running balance. Follows double-entry accounting principles with debit/credit columns and running balance.

**Preconditions:**
- Customer exists
- Transactions exist for the customer
- Financial year is active

**Inputs:**
- Customer ID
- Date range (optional, defaults to current FY)
- Transaction type filter (optional)
- Include opening balance (boolean, default true)

**Validation Rules:**
- Date range: start_date <= end_date
- Customer must belong to current company

**Business Rules:**
- Shows all transactions: invoices, payments, credit notes, adjustments
- Running balance calculated per transaction
- Opening balance shown at top if included
- Closing balance shown at bottom
- Exportable to PDF/Excel
- Filterable by transaction type

**Database Impact:**
- Tables: vouchers (join with voucher_lines where ledger = customer ledger)
- Tables: ledgers (customer ledger lookup)
- Tables: sales_invoices (join for invoice details)
- Tables: payments (join for payment details)
- Indexes: vouchers(ledger_id, voucher_date), vouchers(voucher_type)

**API Requirement:**
- GET /api/customers/:id/ledger?start_date=&end_date=&type=&include_opening=
- Response: { opening_balance, transactions: [...], closing_balance }

**UI Requirement:**
- Loading state: Skeleton table
- Empty state: "No transactions for this customer"
- Success state: Ledger table with running balance, summary at bottom
- Error state: Error toast

**Security:**
- Role-based access per ROL-003
- Same company (RLS)

**Audit:**
- No audit needed (read-only)

**Dependencies:**
- CUS-001 (Customer must exist)
- ACC-003 (Vouchers must exist)
- PAY-001 (Payments must exist)

**Edge Cases:**
- Customer with no transactions
- Very large ledger (pagination/virtual scroll)
- Date range spanning multiple financial years

**Tests:**
- Unit: Running balance calculation, transaction filtering
- Integration: Full ledger view, export, date range accuracy

---

### CUS-005 — Customer Balance Summary

| Field | Detail |
|-------|--------|
| **Module** | Customers |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | owner, admin, accountant, sales_manager, sales_user, viewer |

**Description:**
Provides a quick summary of a customer's outstanding balance, aging breakdown (current, 30, 60, 90+ days), last transaction date, and credit utilization. Used for quick assessment without viewing the full ledger.

**Preconditions:**
- Customer exists
- Financial year is active

**Inputs:**
- Customer ID
- As of date (optional, defaults to today)

**Validation Rules:**
- Customer must belong to current company
- As of date cannot be in the future

**Business Rules:**
- Balance broken down by aging buckets
- Credit utilization shown as percentage of credit limit
- Last invoice and last payment dates shown
- Overdue amount highlighted in red
- Credit available calculated

**Database Impact:**
- Tables: customers (credit_limit, current_balance)
- Tables: vouchers (aging calculation query)
- Tables: sales_invoices (due_date for aging)

**API Requirement:**
- GET /api/customers/:id/balance?as_of=
- Response: { total_outstanding, aging: { current, d30, d60, d90 }, credit_limit, credit_used, credit_available, last_invoice_date, last_payment_date }

**UI Requirement:**
- Loading state: Skeleton card
- Empty state: "No outstanding balance"
- Success state: Summary card with balance breakdown
- Error state: Error toast

**Security:**
- Role-based access per ROL-003
- Same company (RLS)

**Audit:**
- No audit needed (read-only)

**Dependencies:**
- CUS-001 (Customer must exist)
- CUS-004 (Ledger calculations)

**Edge Cases:**
- Customer with zero balance
- Customer with credit limit = 0 (no limit)
- Aging calculation on first day of invoice

**Tests:**
- Unit: Aging bucket calculation, credit utilization
- Integration: Balance accuracy against ledger, aging breakdown

---

### CUS-006 — Customer GSTIN Validation

| Field | Detail |
|-------|--------|
| **Module** | Customers |
| **Priority** | P1 |
| **Maturity** | V1 |
| **Roles** | owner, admin, accountant, sales_manager, sales_user |

**Description:**
Validates a customer's GSTIN against the Indian GST portal API. Retrieves and auto-fills the customer's registered business name, trade name, state, registration status, and constitution type from the GST portal.

**Preconditions:**
- Customer is being created or updated
- GST portal API is accessible
- Company has valid GST portal credentials

**Inputs:**
- GSTIN (15 characters)

**Validation Rules:**
- GSTIN must be valid 15-character format
- GST portal must be accessible
- Customer state auto-populated from GSTIN

**Business Rules:**
- GSTIN lookup returns business name, trade name, state, status
- Auto-fills customer name and state from GSTIN data
- Shows registration status (Active, Cancelled, Suspended)
- Validates state code matches billing address
- Caches lookup results for 24 hours

**Database Impact:**
- Tables: gstin_cache (gstin, business_name, trade_name, state_code, status, last_verified)
- Indexes: unique on gstin_cache.gstin

**API Requirement:**
- POST /api/gst/validate-gstin
- Request: { gstin }
- Response: { gstin, business_name, trade_name, state_code, status, constitution_type }

**UI Requirement:**
- Loading state: Spinner during GSTIN lookup
- Empty state: GSTIN input field
- Success state: Auto-filled customer details with validation badge
- Error state: "GSTIN not found" or "GST portal unavailable"

**Security:**
- GST portal credentials never exposed in client
- Rate limited to 10 lookups per minute

**Audit:**
- Log: gstin.lookup with gstin, result_status

**Dependencies:**
- GST-001 (GSTIN validation)
- CMP-004 (GST details)

**Edge Cases:**
- GSTIN not found on portal
- GSTIN is cancelled/suspended
- Portal API timeout
- GSTIN belongs to different state than expected

**Tests:**
- Unit: GSTIN format validation
- Integration: Portal API call, auto-fill, caching, error handling

---

### CUS-007 — Customer Credit Limit

| Field | Detail |
|-------|--------|
| **Module** | Customers |
| **Priority** | P1 |
| **Maturity** | V1 |
| **Roles** | owner, admin, accountant, sales_manager |

**Description:**
Manages the credit limit assigned to a customer. When a sales invoice is created, the system checks if the customer's outstanding balance plus new invoice amount exceeds the credit limit. Exceeding the limit can block or warn the invoice creation.

**Preconditions:**
- Customer exists
- Credit limit feature enabled in company settings

**Inputs:**
- Customer ID
- Credit limit amount (INR)

**Validation Rules:**
- Credit limit must be non-negative
- Setting to 0 means no limit (unlimited credit)

**Business Rules:**
- Credit limit checked on invoice creation/posting
- If exceeded: configurable action (block, warn, or allow)
- Credit available = credit limit - outstanding balance
- Credit limit changes logged
- Per-customer override of global settings

**Database Impact:**
- Tables: customers (credit_limit field)
- Tables: company_settings (global credit_check_action: block/warn/allow)

**API Requirement:**
- PUT /api/customers/:id/credit-limit
- Request: { credit_limit }
- Response: { customer: { id, credit_limit, credit_available } }

**UI Requirement:**
- Loading state: Spinner on save
- Empty state: Credit limit input
- Success state: Toast "Credit limit updated", shows credit available
- Error state: "Invalid amount"

**Security:**
- Role-based access per ROL-003
- Same company (RLS)

**Audit:**
- Log: customer.credit_limit_changed with old_limit, new_limit

**Dependencies:**
- CUS-001 (Customer must exist)
- SAL-001 (Sales invoice creation checks credit)

**Edge Cases:**
- Customer already over limit when limit is set
- Setting limit below current outstanding
- Credit check bypassed by owner/admin override

**Tests:**
- Unit: Credit calculation logic
- Integration: Invoice creation with credit check, block/warn/allow modes

---

### CUS-008 — Deactivate Customer

| Field | Detail |
|-------|--------|
| **Module** | Customers |
| **Priority** | P1 |
| **Maturity** | MVP |
| **Roles** | owner, admin, accountant, sales_manager |

**Description:**
Customers can be deactivated when they are no longer an active business partner. Deactivation hides the customer from active selections but preserves all historical data. Reactivation is possible at any time.

**Preconditions:**
- Customer exists and is active
- User has appropriate role

**Inputs:**
- Customer ID
- Reason for deactivation (optional)

**Validation Rules:**
- Customer must be active
- Cannot deactivate if there are pending invoices

**Business Rules:**
- Deactivated customer hidden from active dropdowns
- Historical transactions preserved
- Customer can be reactivated later
- Pending invoices remain visible
- Cannot create new invoices for deactivated customer

**Database Impact:**
- Tables: customers (is_active = false)

**API Requirement:**
- DELETE /api/customers/:id
- Request: { reason? }
- Response: { message: "Customer deactivated" }

**UI Requirement:**
- Loading state: Spinner during deactivation
- Empty state: Confirmation dialog
- Success state: Customer moved to inactive list
- Error state: "Cannot deactivate: pending invoices exist"

**Security:**
- Role-based access per ROL-003
- Same company (RLS)

**Audit:**
- Log: customer.deactivated with customer_id, reason

**Dependencies:**
- CUS-001 (Customer must exist)
- SAL-005 (Check pending invoices)

**Edge Cases:**
- Deactivating customer with pending invoices
- Reactivating customer with old data
- Deactivating customer used in templates

**Tests:**
- Unit: Deactivation check logic
- Integration: Deactivate, prevent with pending invoices, reactivate

---

## Module 08 — Suppliers

---

### SUP-001 — Create Supplier

| Field | Detail |
|-------|--------|
| **Module** | Suppliers |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | owner, admin, accountant, purchase_manager |

**Description:**
Users create a supplier record with contact details, GSTIN, addresses, and payment terms. Suppliers are used in purchase invoices, purchase orders, and payable tracking. Duplicate detection by GSTIN and phone/email is performed.

**Preconditions:**
- User is authenticated with appropriate role
- Company exists and is active
- Financial year is set

**Inputs:**
- Supplier name (2-200 characters)
- Trade name (optional)
- GSTIN (optional)
- PAN (optional)
- Phone, email
- Billing address
- Shipping address (optional)
- Payment terms
- Opening balance (optional)
- GSTIN lookup and auto-fill
- Contact person
- Notes (optional)

**Validation Rules:**
- Name: 2-200 characters
- GSTIN: valid 15-character format if provided
- PAN: valid 10-character format if provided
- Phone: valid Indian format
- Opening balance: signed number (negative = payable)

**Business Rules:**
- Supplier code auto-generated (SUP-0001, SUP-0002)
- Default payment terms from company settings
- Supplier ledger auto-created in chart of accounts
- GSTIN lookup auto-fills name and state

**Database Impact:**
- Tables: suppliers (id, company_id, code, name, trade_name, gstin, pan, phone, email, billing_address, shipping_address, payment_terms, opening_balance, contact_person, notes, is_active)
- Tables: ledgers (auto-created for supplier)
- Indexes: unique on suppliers(company_id, code), index on suppliers.gstin, trigram on suppliers.name

**API Requirement:**
- POST /api/companies/:companyId/suppliers
- Request: All supplier fields
- Response: { supplier: {...} }

**UI Requirement:**
- Loading state: Spinner on save
- Empty state: Supplier creation form
- Success state: Toast "Supplier created", redirect to detail
- Error state: Inline validation, duplicate warnings

**Security:**
- Role-based access per ROL-003
- Same company (RLS)

**Audit:**
- Log: supplier.created with supplier details

**Dependencies:**
- CMP-001 (Company must exist)
- ACC-002 (Ledger creation)
- GST-001 (GSTIN validation)

**Edge Cases:**
- GSTIN already used by another supplier
- Supplier with same name as customer
- Opening balance creates journal entry

**Tests:**
- Unit: GSTIN validation, duplicate check, code generation
- Integration: Full creation flow, ledger auto-creation

---

### SUP-002 — Update Supplier Details

| Field | Detail |
|-------|--------|
| **Module** | Suppliers |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | owner, admin, accountant, purchase_manager |

**Description:**
Authorized users update supplier information including contact details, addresses, GSTIN, and payment terms. GSTIN or state code changes are logged.

**Preconditions:**
- Supplier exists and is active
- User has appropriate role

**Inputs:**
- Supplier ID
- Any supplier field (partial update)

**Validation Rules:**
- Same validation as SUP-001 for updated fields
- GSTIN change logged with old value

**Business Rules:**
- Name changes reflected in future invoices
- Historical invoices retain original supplier data
- GSTIN change affects future invoices

**Database Impact:**
- Tables: suppliers (updated fields)
- Tables: audit_log (GSTIN/state change)

**API Requirement:**
- PATCH /api/suppliers/:id
- Request: Partial supplier fields
- Response: { supplier: {...} }

**UI Requirement:**
- Loading state: Save button spinner
- Empty state: Pre-filled form
- Success state: Toast "Supplier updated"
- Error state: Validation errors

**Security:**
- Role-based access per ROL-003
- Same company (RLS)

**Audit:**
- Log: supplier.updated with changed fields

**Dependencies:**
- SUP-001 (Supplier must exist)

**Edge Cases:**
- GSTIN change while pending purchase invoices exist

**Tests:**
- Unit: Field validation, change logging
- Integration: Update flow, GSTIN change handling

---

### SUP-003 — List & Filter Suppliers

| Field | Detail |
|-------|--------|
| **Module** | Suppliers |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | owner, admin, accountant, purchase_manager, viewer |

**Description:**
Users view a searchable, filterable, sortable list of all suppliers. Supports search by name, code, GSTIN, phone, email. Filters include status and state.

**Preconditions:**
- User is authenticated with appropriate role
- Company has suppliers

**Inputs:**
- Search query
- Status filter
- State filter
- Sort field and direction
- Page number and page size

**Validation Rules:**
- Pagination: valid page and page_size

**Business Rules:**
- Default sort: name ascending
- Shows: code, name, phone, email, state, outstanding balance
- Quick actions: view, edit, create purchase invoice

**Database Impact:**
- Tables: suppliers (read with filters)
- Tables: ledgers (balance subquery)
- Indexes: trigram on name, index on code, gstin

**API Requirement:**
- GET /api/suppliers?search=&status=&state=&sort=&page=&page_size=
- Response: { suppliers: [...], total, page, page_size }

**UI Requirement:**
- Loading state: Skeleton table rows
- Empty state: "No suppliers yet."
- Success state: Data table with pagination
- Error state: Error toast

**Security:**
- Role-based access per ROL-003
- Same company (RLS)

**Audit:**
- No audit needed (read-only)

**Dependencies:**
- SUP-001 (Suppliers must exist)

**Edge Cases:**
- No suppliers (empty state)
- Large supplier list

**Tests:**
- Unit: Filter logic, sort logic, pagination
- Integration: Search, filter, sort accuracy

---

### SUP-004 — Supplier Ledger View

| Field | Detail |
|-------|--------|
| **Module** | Suppliers |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | owner, admin, accountant, purchase_manager, viewer |

**Description:**
Users view a detailed ledger for a specific supplier showing all purchase transactions, payments made, debit notes, and running balance. Follows double-entry accounting with debit/credit columns.

**Preconditions:**
- Supplier exists
- Transactions exist for the supplier

**Inputs:**
- Supplier ID
- Date range (optional)
- Transaction type filter

**Validation Rules:**
- Date range: start_date <= end_date
- Supplier must belong to current company

**Business Rules:**
- Shows: purchase invoices, payments, debit notes, adjustments
- Running balance calculated per transaction
- Opening and closing balance shown
- Exportable to PDF/Excel

**Database Impact:**
- Tables: vouchers (join with voucher_lines where ledger = supplier ledger)
- Tables: purchase_invoices (join for details)
- Tables: payments (join for payment details)

**API Requirement:**
- GET /api/suppliers/:id/ledger?start_date=&end_date=&type=
- Response: { opening_balance, transactions: [...], closing_balance }

**UI Requirement:**
- Loading state: Skeleton table
- Empty state: "No transactions for this supplier"
- Success state: Ledger table with running balance
- Error state: Error toast

**Security:**
- Role-based access per ROL-003
- Same company (RLS)

**Audit:**
- No audit needed (read-only)

**Dependencies:**
- SUP-001 (Supplier must exist)
- ACC-003 (Vouchers)
- PAY-002 (Payments)

**Edge Cases:**
- Supplier with no transactions
- Ledger spanning multiple FYs

**Tests:**
- Unit: Running balance calculation
- Integration: Full ledger view, export

---

### SUP-005 — Supplier Balance Summary

| Field | Detail |
|-------|--------|
| **Module** | Suppliers |
| **Priority** | P0 |
| **Maturity** | MVP |
| **Roles** | owner, admin, accountant, purchase_manager, viewer |

**Description:**
Quick summary of a supplier's outstanding payable balance, aging breakdown, last transaction date, and total purchases for the period.

**Preconditions:**
- Supplier exists
- Financial year is active

**Inputs:**
- Supplier ID
- As of date (optional)

**Validation Rules:**
- Supplier must belong to current company

**Business Rules:**
- Balance broken down by aging buckets (current, 30, 60, 90+ days)
- Last purchase invoice and last payment dates shown
- Overdue amount highlighted
- Total purchases for current period shown

**Database Impact:**
- Tables: suppliers (current_balance)
- Tables: vouchers (aging calculation)
- Tables: purchase_invoices (due_date for aging)

**API Requirement:**
- GET /api/suppliers/:id/balance?as_of=
- Response: { total_outstanding, aging: {...}, last_purchase_date, last_payment_date, period_purchases }

**UI Requirement:**
- Loading state: Skeleton card
- Empty state: "No outstanding balance"
- Success state: Summary card with balance breakdown
- Error state: Error toast

**Security:**
- Role-based access per ROL-003
- Same company (RLS)

**Audit:**
- No audit needed (read-only)

**Dependencies:**
- SUP-001 (Supplier must exist)
- SUP-004 (Ledger)

**Edge Cases:**
- Supplier with zero balance
- Aging on first day of invoice

**Tests:**
- Unit: Aging calculation
- Integration: Balance accuracy, aging breakdown

---

### SUP-006 — Deactivate Supplier

| Field | Detail |
|-------|--------|
| **Module** | Suppliers |
| **Priority** | P1 |
| **Maturity** | MVP |
| **Roles** | owner, admin, accountant, purchase_manager |

**Description:**
Suppliers are deactivated when no longer an active business partner. Deactivation hides the supplier from active selections but preserves historical data. Reactivation is possible.

**Preconditions:**
- Supplier exists and is active
- User has appropriate role

**Inputs:**
- Supplier ID
- Reason (optional)

**Validation Rules:**
- Supplier must be active
- Cannot deactivate with pending purchase invoices

**Business Rules:**
- Deactivated supplier hidden from dropdowns
- Historical transactions preserved
- Can be reactivated later
- Cannot create new purchase invoices for deactivated supplier

**Database Impact:**
- Tables: suppliers (is_active = false)

**API Requirement:**
- DELETE /api/suppliers/:id
- Request: { reason? }
- Response: { message: "Supplier deactivated" }

**UI Requirement:**
- Loading state: Spinner
- Empty state: Confirmation dialog
- Success state: Supplier moved to inactive list
- Error state: "Cannot deactivate: pending invoices"

**Security:**
- Role-based access per ROL-003
- Same company (RLS)

**Audit:**
- Log: supplier.deactivated with supplier_id, reason

**Dependencies:**
- SUP-001 (Supplier must exist)
- PUR-005 (Check pending invoices)

**Edge Cases:**
- Deactivating with pending invoices
- Reactivating with old data

**Tests:**
- Unit: Deactivation check
- Integration: Deactivate, prevent with pending invoices, reactivate

---

