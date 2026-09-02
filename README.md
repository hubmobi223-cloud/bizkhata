# BizKhata

**Cloud Accounting + Billing + GST + Inventory SaaS for India** (internal codename: CloudLedger).

Currency INR · Timezone Asia/Kolkata · Financial year 1 Apr – 31 Mar.

## Stack

- **Web**: Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind 4 · shadcn/ui
- **Backend**: Supabase (PostgreSQL + PostgREST). Business rules live in Postgres functions/views, invoked via `supabase.rpc()`.
- **Auth**: Supabase Auth (email/password + Google OAuth) with SSR cookie sessions.
- **Mobile**: Flutter app in [`mobile/`](mobile/) consuming the same backend.

## Features

- Multi-tenant organizations/companies, members with roles, financial years
- Chart of Accounts (groups + ledgers) and double-entry vouchers (balance guaranteed in DB)
- Items & Inventory with batches, stock ledger and balances
- Sales/Purchase GST billing with CGST/SGST/IGST split engine
- Reports: trial balance, day book, ledger statement, P&L, balance sheet, stock book, GSTR-1/3B

## Repository layout

```
src/app/            web routes (App Router)
src/components/     feature + shadcn/ui components
src/lib/            supabase clients, api helpers, gst/formats
supabase/schema/    01..06 SQL migrations (extensions, tables, functions, triggers, RLS, views)
mobile/             Flutter Android app
docs/               product source-of-truth documents (Chapter 1 deliverables)
product.config.json machine-readable product specification
tests/              vitest unit + supertest API harness
```

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | development server |
| `npm run build` | production build |
| `npm run lint` | eslint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | vitest unit tests |
| `npm run test:api` | HTTP integration tests (set `E2E_BASE_URL`; needs a running server) |

Mobile: `cd mobile && flutter analyze && flutter test && flutter build apk --debug`.

## Configuration

Copy `.env.local.example` → `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` /
`NEXT_PUBLIC_SUPABASE_ANON_KEY` from the Supabase dashboard. `mobile/` uses the equivalent
`--dart-define=SUPABASE_URL` / `SUPABASE_ANON_KEY`.

Apply the SQL schema in `supabase/schema/` in numeric order.

## Documentation

See [`docs/`](docs/) — product definition, business rules, architecture, tenant security,
accounting rules, development rules, and the Definition of Done checklist.