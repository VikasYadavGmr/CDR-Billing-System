# CDR Billing System — Frontend

Call Detail Record billing and telecom expense management. Rates calls against
rate plans, applies country-wise VAT, and produces department and individual
invoices with a full tax audit trail.

Billing entity: **Hellenic Telecom Services Group**, Athens. Reporting currency
is EUR and the default tax jurisdiction is Greece (`EL`, 24% VAT).

## Getting started

```bash
npm install
npm run dev      # dev server with HMR
npm run build    # typecheck (tsc -b) + production build
npm run lint     # Oxlint
```

Sign in with `admin` / `admin123`. Authentication is a local-storage stub for the
demo environment — there is no role enforcement yet.

## Stack

React 19 · TypeScript · Vite 8 · React Router 7 · Tailwind CSS v4 · Lucide icons.
All data is served from a client-side mock layer; no backend is required to run
the application.

## Modules

| Route | Module |
| --- | --- |
| `/dashboard` | KPIs, call traffic, billing trend, tax overview |
| `/cdr` | CDR records, CMR records, advanced filters, export |
| `/extensions` | Extension master |
| `/departments` | Department master and cost centres |
| `/billing` | Billing periods, invoices, tax summary |
| `/tax` | Tax & VAT Master — rules, countries, audit history |
| `/tax/reports` | Tax Summary, Country-wise Tax, Tax Rate, Tax Audit reports |
| `/rate-plans` | Rate plans and the live rate calculator |
| `/reports` | Usage, device, system and user reports |
| `/users` | User management |
| `/settings` | System configuration |
| `/audit-logs` | System-wide change history |

## Layout

```
src/
  components/   shared UI — layout, billing, cdr, dashboard, tax
  context/      auth context
  mock-data/    seeded data (countries, tax rules, CDRs, billing, audit)
  modules/cdr/  CDR records, CMR, export and reports sub-modules
  pages/        route-level pages
  routes/       route configuration
  services/     data access layer (mock today, API boundary tomorrow)
  types/        shared domain types
  utils/        billing calculator, tax engine, formatters
scripts/        one-off codemods
docs/           module documentation
```

## Documentation

- [Tax & VAT Management Module](docs/tax-vat-module.md) — regional scope, data
  model, rate versioning, calculation engine, validation, billing pipeline and
  the UI surface.

## Conventions worth knowing

**Tax rates are never hard-coded.** Every rate is resolved from the tax master by
country, service type, transaction date, status and priority. If you find
yourself typing a percentage into a component, it belongs in a tax rule instead.

**Tax rates are never overwritten.** A rate change closes the existing rule and
creates a new one with its own effective period, so historical invoices stay
correct. Use `taxService.changeTaxRate` rather than editing a rate in place.

**Billing country is a business attribute**, set on the transaction — it is not
derived from the dialled number.
