# Feature Acceptance Criteria - BizKhata

## Universal Definition of Done

Every feature is complete ONLY when ALL of the following are verified:

### Database
- [ ] Schema implemented (tables, indexes, constraints)
- [ ] Migration created and tested
- [ ] RLS policies enforce tenant isolation
- [ ] Data integrity constraints verified (UNIQUE, CHECK, FK)

### Backend
- [ ] Business logic implemented in Postgres functions or src/lib/api/*
- [ ] Input validation (server-side, never trust client)
- [ ] Authorization checked (fn_has_access or equivalent)
- [ ] Error handling (consistent error contract)
- [ ] All financial calculations use shared round2 function

### API
- [ ] Endpoint implemented with correct HTTP method
- [ ] Authentication required where needed
- [ ] Permission check enforced (role-based)
- [ ] Request schema validated (Zod)
- [ ] Response schema consistent (standard envelope)
- [ ] Pagination/filtering/sorting where applicable
- [ ] Idempotency where applicable (POST operations)

### UI
- [ ] Loading state implemented (skeleton/spinner)
- [ ] Empty state implemented (helpful message + CTA)
- [ ] Success state implemented (confirmation/toast)
- [ ] Validation error state implemented (inline errors)
- [ ] Permission denied state implemented (disabled/greyed)
- [ ] Mobile responsive (768px+ breakpoint)
- [ ] Accessible (keyboard navigation, ARIA labels)

### Security
- [ ] Tenant isolation verified (org_id filter on all queries)
- [ ] RBAC enforced (role checked before operation)
- [ ] No secrets exposed (never in client-side code or logs)
- [ ] Input sanitized (XSS prevention)
- [ ] CSRF protection where applicable (form submissions)
- [ ] SQL injection prevention (parameterized queries only)

### Audit
- [ ] Audit log entry created for write operations
- [ ] No secrets/tokens in audit logs
- [ ] Audit entry includes: user_id, action, entity_type, entity_id, before/after

### Testing
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] API tests written and passing
- [ ] Security tests (tenant isolation, permission bypass)

### Documentation
- [ ] Feature catalog entry updated
- [ ] API documentation updated (request/response examples)
- [ ] product.config.json updated

### Quality Gates
- [ ] `npm run typecheck` passes (zero errors)
- [ ] `npm run lint` passes (zero warnings)
- [ ] `npm test` passes (zero failures)
- [ ] `npm run build` succeeds (no build errors)

---

## Feature-Specific Acceptance Criteria

### Financial Features (Sales, Purchase, Accounting, Payments)

These features have additional requirements because they affect financial records:

#### Double-Entry Accounting
- [ ] Every debit has a corresponding credit
- [ ] Total debits == total credits for every transaction
- [ ] Trial balance balances after every posting
- [ ] Account types enforced (assets=debit, liabilities=credit, etc.)

#### GST Calculation
- [ ] Intra-state: CGST (half rate) + SGST (half rate)
- [ ] Inter-state: IGST (full rate)
- [ ] State detection from supplier vs customer state codes
- [ ] GSTIN validation (15-character format)
- [ ] HSN/SAC code mandatory for products
- [ ] Tax amounts rounded to 2 decimal places

#### Rounding
- [ ] All amounts use shared `round2()` function
- [ ] Round-off calculated per invoice (nearest rupee)
- [ ] Round-off signed correctly (positive or negative)

#### Outstanding Management
- [ ] Customer outstanding = sum of unpaid sales invoices
- [ ] Supplier outstanding = sum of unpaid purchase invoices
- [ ] Payment allocation reduces outstanding correctly
- [ ] Partial payments handled correctly
- [ ] Aging buckets calculated correctly (30/60/90/120+)

#### Invoice Lifecycle
- [ ] Draft invoices can be edited freely
- [ ] Posted invoices are read-only (no silent edits)
- [ ] Posted invoices can only be cancelled (not deleted)
- [ ] Cancellation creates reversal entries
- [ ] Cancelled invoices preserve original data for audit
- [ ] Invoice numbers are sequential and gapless within financial year

#### Stock Movement on Invoices
- [ ] Sales invoice posting reduces stock (outward)
- [ ] Purchase invoice posting increases stock (inward)
- [ ] Stock movement recorded in stock_ledger on posting
- [ ] stock_balances updated atomically
- [ ] Stock movement reversed on cancellation
- [ ] Negative stock controlled by org setting

### Inventory Features

#### Stock Ledger
- [ ] Every stock movement logged (create/update/delete)
- [ ] Movement types: opening, purchase, sale, adjustment, transfer
- [ ] Balance after each movement calculated correctly
- [ ] Ledger is append-only (never modified, only new entries added)

#### Stock Balances
- [ ] Current stock = opening + sum(inward) - sum(outward)
- [ ] Balances per product per warehouse
- [ ] Resync function (fn_resync_stock) recalculates correctly
- [ ] Concurrent updates handled (no race conditions)

#### Stock Adjustments
- [ ] Positive adjustment increases stock
- [ ] Negative adjustment decreases stock
- [ ] Reason mandatory for adjustments
- [ ] Adjustment approval required (if workflow configured)

### Integration Features (E-Invoice, E-Way Bill, WhatsApp, Email)

#### Adapter Pattern
- [ ] Provider-agnostic interface defined
- [ ] Provider-specific adapter implements interface
- [ ] No direct provider calls in business logic
- [ ] Easy to swap providers without changing core code

#### Retry Mechanism
- [ ] Exponential backoff implemented
- [ ] Maximum retry count configurable
- [ ] Retry status tracked in database
- [ ] Permanent failures moved to dead letter queue

#### Failure Isolation
- [ ] Integration failure does NOT roll back financial transaction
- [ ] Invoice is posted even if E-Invoice fails (status = pending)
- [ ] Payment is recorded even if WhatsApp fails
- [ ] User notified of integration failure separately

#### Status Tracking
- [ ] Every integration has status field (pending/success/failed)
- [ ] Status updated asynchronously via webhooks or polling
- [ ] Status visible in entity detail view
- [ ] Manual retry available for failed items

#### Idempotency
- [ ] Same request submitted twice produces same result
- [ ] Idempotency key used for all external API calls
- [ ] Duplicate detection prevents double-processing

### Subscription Features

#### Plan Limits
- [ ] Free tier: 1 user, 50 invoices/month, 1 warehouse
- [ ] Starter tier: 5 users, 500 invoices/month, 3 warehouses
- [ ] Pro tier: 25 users, unlimited invoices, unlimited warehouses
- [ ] Enterprise tier: unlimited everything + advanced features
- [ ] Limits enforced at API level (not just UI)

#### Billing
- [ ] Subscription status tracked per organization
- [ ] Expired subscriptions show warning, not data loss
- [ ] Grace period before data restriction (7 days)
- [ ] Upgrade prorated to current billing cycle
- [ ] Downgrade effective at end of current cycle

---

## Verification Commands

```bash
# TypeScript strict check
npm run typecheck

# ESLint check
npm run lint

# Vitest unit tests
npm test

# Production build
npm run build

# HTTP integration tests (needs E2E_BASE_URL)
npm run test:api

# Database migration check
npm run db:migrate:status

# RLS policy check
npm run db:rls:check
```

---

## Non-Negotiable Rules

### Code Quality
1. **TODO-only implementations are NOT done** - No `// TODO: implement` placeholders
2. **Mocked/stubbed implementations are NOT done** without explicit user approval
3. **"Works on my machine" is not evidence** - Must pass CI pipeline
4. **No hardcoded values** - All configuration via environment or database

### Financial Integrity
5. **Financial records are never hard-deleted** - Only soft-deleted or cancelled
6. **Posted vouchers are never silently edited** - Audit trail must show changes
7. **Double-entry balance is always verified** - Every posting checked
8. **GST calculations are always accurate** - Intra/inter state detection mandatory

### Security
9. **Tenant isolation is never optional** - Every query filtered by org_id
10. **RBAC is always enforced** - fn_has_access checked on every endpoint
11. **No secrets in code** - All secrets in environment variables
12. **Input validation is server-side** - Never trust client-side validation alone

### Audit
13. **Audit logging is never optional for write operations** - Every create/update/delete logged
14. **No secrets/tokens in audit logs** - Mask sensitive data
15. **Audit entries include context** - User, timestamp, before/after state

### Testing
16. **No feature without tests** - Unit + integration tests required
17. **No feature without error handling** - Try/catch with meaningful messages
18. **No feature without loading states** - User must see progress indication
19. **No feature without empty states** - User must see what to do next
20. **No feature without permission states** - User must see why they cannot act

---

## Feature Review Checklist

Before marking any feature as done, verify:

- [ ] All items in Universal Definition of Done are checked
- [ ] All feature-specific criteria are checked
- [ ] Verification commands pass locally
- [ ] CI pipeline passes (green build)
- [ ] Manual testing completed for happy path
- [ ] Edge cases tested (empty data, boundary values, concurrent access)
- [ ] Error scenarios tested (network failure, invalid input, permission denied)
- [ ] Mobile responsive verified
- [ ] Accessibility verified (keyboard, screen reader)
- [ ] Code reviewed by at least one other developer
- [ ] Documentation updated

---

## Rollback Criteria

If any of the following are discovered after deployment, the feature must be rolled back:

1. Financial calculation errors (wrong GST, incorrect outstanding, etc.)
2. Data loss or corruption
3. Security vulnerability (tenant data leak, privilege escalation)
4. Performance regression >50% on critical paths
5. Core workflow broken (cannot create invoice, cannot record payment)
6. Audit log gaps (write operations not logged)

---

## Feature Prioritization Matrix

When deciding what to build, use this matrix:

| Priority | Criteria | Example |
|----------|----------|---------|
| P0 | Blocks other features, financial critical | Invoice posting, payment recording |
| P1 | Core user workflow, compliance required | GST calculation, audit logging |
| P2 | Important for user experience | Dashboard, reports, search |
| P3 | Nice to have, improves efficiency | WhatsApp integration, bulk operations |
| P4 | Future enhancement, not blocking | AI features, advanced analytics |

---

## Acceptance Testing Protocol

### Manual Testing Steps
1. Happy path: Create entity -> Edit -> Post -> View -> Download PDF
2. Error path: Invalid input -> Validation error -> Fix -> Retry
3. Permission path: Login as different roles -> Verify access control
4. Edge path: Empty data -> Boundary values -> Concurrent edits
5. Mobile path: Responsive layout -> Touch interactions -> Orientation

### Automated Testing Steps
1. Unit tests: All business logic functions
2. Integration tests: All API endpoints
3. E2E tests: Critical user journeys (invoice creation, payment recording)
4. Security tests: Tenant isolation, permission bypass attempts
5. Performance tests: API response times under load
