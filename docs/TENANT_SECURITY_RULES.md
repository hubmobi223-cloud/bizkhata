# Tenant Security Rules

Mandatory security invariants. A failed rule is a failed release.

## 1. Tenant isolation invariant

Every organization-owned record contains an organization scope (`company_id`), and every
organization-owned query enforces it server-side:

- Conceptually: `SELECT … WHERE id = ? AND company_id = ?`.
- The organization is **resolved from the authenticated session** via membership — never
  trusted blindly from client input.

**Current enforcement (Chapter 1):**
- RLS enabled on all 15 business tables (`supabase/schema/005_rls_policies.sql`); policies
  call `fn_has_access(company_id)` for SELECT/INSERT/UPDATE/DELETE.
- `companies`: INSERT requires authenticated; UPDATE/DELETE require `fn_can_admin`.
- `financial_years`, `company_members`: admin/owner-only mutation.
- SECURITY DEFINER procedures re-verify access and company scope internally
  (`sp_post_voucher`, `sp_cancel_voucher`, `sp_seed_defaults`, `sp_create_company`).
- Function grants are explicit (`revoke … from public; grant … to authenticated`).

Rule for all future code: **a client-supplied org id is a hint, never a substitute for
membership resolution.**

## 2. Role model

Now: `company_members.role` ∈ {`owner`, `admin`, `accountant`, `viewer`} (enum
`company_member_role`), `fn_can_admin` gates admin actions.

Roadmap (users/roles chapter): add Sales Manager, Sales User, Purchase Manager, Inventory
Manager, Branch Manager, Platform Super Admin; support custom roles.

## 3. Permission model (roadmap)

Granular permissions, e.g.:

- `customers.create | read | update | delete`
- `sales.invoice.create | read | update | cancel`
- `reports.profit_loss.read`
- `users.manage` · `settings.manage`

Every new endpoint/module must declare its required permissions and be tested for bypass.
Current permission catalog: `product.config.json` → `permissions`.

## 4. Branch access (roadmap)

- Branch managers see only their branch's data, by policy — never by convention.
- Multi-branch scoping must be enforced in data-access layer (same pattern as §1).

## 5. Audit

Audit important events (LOGIN, LOGOUT, CREATE, UPDATE, ARCHIVE, POST, CANCEL, PAYMENT, REFUND,
GST_SUBMISSION, EINVOICE_GENERATED, EWAYBILL_GENERATED, WHATSAPP_SENT, ROLE_CHANGED,
PASSWORD_CHANGED, SETTINGS_CHANGED) with actor, org, entity, before/after state, timestamp, IP,
user agent. Never log secrets/passwords/tokens.

## 6. Secrets

Frontend must never receive: database credentials, API secrets, JWT signing secrets, WhatsApp
credentials, GST provider credentials, payment gateway secret keys.

- Env inventory + placeholders: `.env.local.example`.
- Supabase anon key is public by design; security relies on RLS, not key secrecy.
- Webhook endpoints verify signatures (roadmap).

## 7. Web baseline (OWASP-informed)

HTTPS; secure password hashing (Supabase managed); session/JWT + refresh protection; RBAC;
rate limiting; input validation; SQL-injection (parameterized query builders + RLS); XSS
(React escaping, CSP hardening roadmap); CSRF (cookies SameSite strategy); CORS; secure
cookies; secret management; backup + restore testing.

## 8. Testing obligation

Security tests are mandatory and part of [Definition of Done](DEFINITION_OF_DONE.md):

- Tenant isolation: user A must never read user B's rows (cross-tenant fixture test).
- Permission bypass: role without `users.manage` cannot manage users.
- Unauthorized access: unauthenticated requests fail closed (already asserted by HTTP smoke
  tests in `tests/api/http-smoke.test.ts`).
- Financial: unbalanced journals cannot post; delete of posted vouchers blocked.