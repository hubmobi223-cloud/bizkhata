# Development Rules

Rules that govern how this codebase is changed.

## 1. Workflow

For every task: **READ → UNDERSTAND → PLAN → IMPLEMENT → TEST → REVIEW → FIX → VERIFY.**
- Never blind-derive code from memory of a framework version. This repo uses Next.js 16 /
  React 19 / Supabase (PostgREST 2.9+, gotrue 2.27+): read `node_modules/next/dist/docs/`
  (AGENTS.md) and package sources before writing code against them.
- If a requirement is ambiguous: inspect existing docs/specs, prefer the documented business
  rule, and make the smallest reasonable assumption — then document it.
- Do not silently remove or downgrade requirements.
- Do not claim a feature is done if it is mocked/stubbed/TODO-only.

## 2. Do not break working functionality

- Preserve existing modules unless the change explicitly reworks them.
- Prefer additive migrations; never destructive DB operations automatically.
- Before architectural changes: state current architecture, the problem, the proposed change,
  impact, migration requirement, and risks — then implement.

## 3. Quality bar (every module)

- Type safety (TypeScript strict) · validation · error handling · authorization · logging ·
  tests · documentation.
- Avoid: duplicated business logic, giant components/services, hard-coded credentials, hard-coded
  tax rules, magic numbers, unvalidated input, direct DB access from UI, silent error swallows.

## 4. Error contract

- Consistent shape (see `BUSINESS_RULES.md`): `success`, `error.code`, `error.message`,
  `error.details[]`, `requestId`.
- Never surface raw stack traces to customers.
- Postgres/PostgREST errors are normalized server-side (cf. `BizApi` `_guard`/`BizKhataException`
  normalization in the mobile client) or via a future API layer; UI shows friendly codes.

## 5. Naming & structure

- Web: feature folders under `src/components/<feature>/`, data access under `src/lib/api/`,
  pages under `src/app/(app)/<feature>/`.
- Database: enums/types in `001`, tables `002`, functions `003`, triggers `004`, RLS `005`,
  views/reports `006` (new migrations append or add files — never re-edit applied history).
- Mobile: mirrors web feature files under `mobile/lib/src/`.
- Money/tax values: use shared helpers (`round2`, formatters); never inline math in widgets.

## 6. Testing strategy

- **Unit** (vitest): pure logic — `round2`, `splitTax`, `taxableValue`, formatters, state/constant
  integrity. Run with `npm run test:unit`.
- **Integration/API** (supertest): against a running server via `E2E_BASE_URL`
  (`npm run test:api`). Assert auth redirects, status codes, body contract.
- **Security**: tenant isolation, permission bypass, unauthorized access fixtures.
- **Financial**: debit/credit balance, tax rounding parity, outstanding math, stock movement,
  invoice totals, cancel semantics.
- Parity note: web `tests/unit/gst.test.ts` and mobile `mobile/test/gst_test.dart` must test the
  same GST cases so the two GST implementations stay consistent.

## 7. Commands

| Command | Meaning |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | production build |
| `npm run lint` | eslint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | all unit tests |
| `npm run test:unit` | unit tests only |
| `npm run test:api` | HTTP smoke/integration (needs `E2E_BASE_URL`) |
| `flutter analyze` / `flutter test` | mobile verification |

Run lint + typecheck + tests + build before declaring completion. Fix errors before claiming done.

## 8. Git & safety

- No destructive git operations (force reset, branch deletion, overwriting unrelated work)
without explicit instruction.
- Keep commits logically organized; never commit secrets (`.env*` is gitignored; never add
  credentials, JWT signing secrets, provider keys).

## 9. Documentation obligation

Update `/docs` whenever architecture materially changes, and keep `product.config.json`
current. New modules must be represented in `product.config.json` `modules[]`.