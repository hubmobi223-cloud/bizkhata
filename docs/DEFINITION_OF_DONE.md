# Definition of Done

A feature is **not complete** until every applicable item is checked. "N/A" is only allowed
when the item cannot apply to the feature type (document why in the review).

## The checklist

| # | Item | How it is verified in this repo |
|---|---|---|
| 1 | Database schema | migration applied; `supabase/schema/*` updated, idempotent where required |
| 2 | Migration | additive, versioned, reviewed; destructive changes prohibited without explicit approval |
| 3 | Backend service | business logic in Postgres functions/views or `src/lib/api/*`; never UI-owned |
| 4 | API | RPC/view/route contract documented; versioning (`api/v1` → `/v2`) respected |
| 5 | Validation | input validated server-side; `BUSINESS_RULES.md` rules enforced (e.g. GSTIN format, balance) |
| 6 | Authorization | permission declared + enforced; tenant scope resolved from session (see `TENANT_SECURITY_RULES.md`) |
| 7 | UI | page/component integrated in app shell; feature-flag gated if beta |
| 8 | Loading state | explicit loading UI (skeleton/spinner) |
| 9 | Empty state | friendly empty state for zero records |
| 10 | Error state | friendly error + actionable retry; never raw stack traces |
| 11 | Success state | confirmation (toast/redirect) reflecting completed action |
| 12 | Audit log | relevant event recorded (POST, CANCEL, PAYMENT, …) without secrets |
| 13 | Unit tests | vitest coverage for logic (`npm run test:unit`) |
| 14 | Integration tests | service/API behavior (supertest + `E2E_BASE_URL`) |
| 15 | Security review | tenant isolation + permission bypass checked; unauthorized access fails closed |
| 16 | Type check | `npm run typecheck` clean |
| 17 | Lint | `npm run lint` clean |
| 18 | Build | `npm run build` succeeds (mobile: `flutter analyze`, `flutter build apk --debug`) |
| 19 | Documentation | `/docs` + `product.config.json` reflect the change |

## Rules of engagement

- TODO-only or mocked implementations are **not** done. No fake/mock substitutes unless the
  user explicitly requests a smoke/prototype.
- When a check is N/A, the review must say why (e.g. "audit log N/A — read-only report").
- Financial features carry extra scrutiny: balance invariants, rounding parity, outstanding,
  stock movement, and delete/cancel semantics must all be tested before merge.
- "Works on my machine" is not evidence; run the repo's verification commands from the previous
  checklist and report actual output.