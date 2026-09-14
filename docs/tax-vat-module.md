# Tax & VAT Management Module

Country-wise taxation for the CDR Billing System. This module owns the tax master
data, the calculation engine, the validation rules and the audit trail, and it
plugs into the billing pipeline between call rating and invoice generation.

> **Scope.** This module belongs to the CDR Billing System only. It is not shared
> with AOCC, Flight Operations or any other airport system.

---

## 1. Regional scope

This release carries **Europe only**. Every seeded country, tax rule and tax type
is European VAT on Telecom Services, and no other region is selectable anywhere
in the UI.

The data model is nonetheless generic. `Region` is a plain `string` and `TaxType`
allows `VAT | GST | Sales Tax | Other`, so onboarding another region later is a
master-data exercise rather than a schema change. What constrains the current
release is a pair of runtime constants, not the type system:

```10:21:src/types/tax.ts
export type Region = string;

/** The only region carried by this release. */
export const REGION_EUROPE = 'Europe';

/** Regions offered in the UI. Europe only — no other region is configured. */
export const SUPPORTED_REGIONS: Region[] = [REGION_EUROPE];

export type TaxType = 'VAT' | 'GST' | 'Sales Tax' | 'Other';

/** Tax types selectable for European tax rules. Europe is VAT-only. */
export const EUROPE_TAX_TYPES: TaxType[] = ['VAT'];
```

**32 European countries** are seeded across the EU and non-EU blocs (EU-27 plus
the United Kingdom, Norway, Iceland, Switzerland and Turkey), each with its
standard VAT reference rate.

### Greece is the primary billing jurisdiction

This deployment bills from Greece. The billing entity is *Hellenic Telecom
Services Group*, Athens Telecom Operations Centre, VAT ID `EL 998765432`, Athens
Tax Office (DOY) A, and invoices carry the `INV-HTS-` prefix.

Greek VAT of 24% therefore applies to any charge that is not explicitly
attributed to another jurisdiction:

```73:78:src/mock-data/countryData.ts
/**
 * Country of the billing entity — drives the default tax jurisdiction.
 * This deployment bills from Greece (EL), so Greek VAT applies unless a charge
 * is attributed to another configured European jurisdiction.
 */
export const DEFAULT_BILLING_COUNTRY_CODE = 'EL';
```

Greece also carries reduced (13%), super-reduced (6%) and intra-EU B2B
reverse-charge rules in the master. All three are seeded as **Inactive** because
telecom services are standard-rated — they exist so the rate-category and
reverse-charge behaviour is demonstrable on the focus country, and activating one
is enough to see the engine pick it up by priority.

The remaining European countries stay fully configured. A handful of cost centres
are deliberately invoiced from other entities (Ground Handling from France,
Engineering and Facility Management from the Netherlands, IT from Austria) so
that the multi-rate invoice table, the tax summary and the country-wise report
have genuine multi-jurisdiction data to display instead of collapsing into a
single rate.

---

## 2. Data model

Three master entities plus the tax fields carried on each billable transaction.

### Country Master (`Country`)

The list of jurisdictions the system can bill from. Kept separate from tax rules
because one country has many rules over time.

| Field | Notes |
| --- | --- |
| `countryId` | Internal identifier — Greece is `CTY-012` |
| `countryName`, `isoCode` | e.g. Greece / `EL` |
| `region` | `Europe` for every seeded country |
| `bloc` | `EU` or `Non-EU`, for reporting and filtering only |
| `currency` | Local currency; reporting consolidates in EUR |
| `taxSystem` | `VAT` across Europe |
| `status` | `Active` / `Inactive` |

### Tax Rule Master (`TaxRule`)

One row per country × service type × rate × effective period. See
`src/types/tax.ts` for the full interface. The fields that carry the business
logic are:

| Field | Notes |
| --- | --- |
| `rate` | Percentage — `24` means 24% |
| `rateCategory` | `Standard`, `Reduced`, `Super Reduced`, `Zero`, `Exempt` |
| `serviceType` | `Telecom Services` today; data/equipment/professional supported |
| `effectiveFrom` / `effectiveTo` | `effectiveTo: null` means open-ended |
| `priority` | Higher number wins when several rules match the same day |
| `taxInclusive` | Selects the inclusive or exclusive calculation |
| `reverseCharge` | Recipient accounts for the VAT |
| `exemptionCode` | e.g. `EU-RC-196` |
| `sourceReference` | Authority the rate came from |
| `lastVerifiedAt` | When the rate was last checked against that source |

### Tax Audit Log (`TaxAuditLog`)

Append-only. Every rule change writes an entry recording the action (`Created`,
`Updated`, `Activated`, `Deactivated`, `Rate Changed`, `Effective Date Changed`),
the old and new values, who changed it, when, and why.

### Transaction tax fields

Each CDR billing record carries `billingCountry`, `billingCountryCode`,
`taxRuleId`, `taxType`, `taxName`, `taxRate`, `taxableAmount`, `taxAmount`,
`totalAmount` and `taxStatus`.

---

## 3. Rate versioning

**A tax rate is never overwritten.** When a rate changes, the current rule is
closed with an `effectiveTo` date and a new rule is created starting the next
day. Historical invoices keep resolving to the rate that applied on their own
transaction date, which is what makes a reprint of last year's invoice still
correct.

`taxService.changeTaxRate` implements this as a single operation so a rate change
cannot accidentally become an in-place edit. The seeded data includes a worked
example: Germany's 19% rule ends 2026-12-31 and a 20% rule takes over from
2027-01-01, so a December 2026 call and a January 2027 call resolve to different
rates from the same master.

---

## 4. Calculation engine

`src/utils/taxEngine.ts` is the single place where a rate is chosen and applied.
The services wrap it; nothing else computes tax.

### Rule resolution

`findApplicableTaxRule(rules, countryCode, serviceType, transactionDate)` filters
to rules that are `Active`, match the ISO country code and service type, and are
effective on the transaction date. Among the survivors, highest `priority` wins
and ties break toward the most recent `effectiveFrom`, so a newer rate version
supersedes an older one covering the same day.

**There are no hard-coded country rates anywhere in the application.** Every rate
is a dynamic lookup on country, service type, transaction date, status and
priority. If no rule matches, the engine returns `TAX_REVIEW_REQUIRED` rather
than guessing.

### Applying the rate

```
Tax Amount   = Taxable Amount × Tax Rate / 100
Total Amount = Taxable Amount + Tax Amount
```

Both billing directions are supported, and the rule decides which one applies:

- **Tax-exclusive** (`taxInclusive: false`) — the amount is net, tax is added on top.
- **Tax-inclusive** (`taxInclusive: true`) — the amount is gross, and the net is
  extracted as `net = gross / (1 + rate/100)`.

Exempt, zero-rated and reverse-charge rules resolve to zero tax with the taxable
amount preserved, so the value still appears in the tax summary under the right
heading instead of vanishing.

### Tax statuses

| Status | Meaning |
| --- | --- |
| `NOT_CALCULATED` | Tax has not been resolved for this record yet |
| `CALCULATED` | A rate was applied |
| `EXEMPT` | Exempt supply, optionally with an exemption code |
| `ZERO_RATED` | A rule applies at 0% |
| `REVERSE_CHARGE` | VAT accounted for by the recipient |
| `TAX_REVIEW_REQUIRED` | No valid rule — blocks finalisation, needs a human |

---

## 5. Services

| Service | Responsibility |
| --- | --- |
| `billingService` | Billing periods, rate plans, and country-scoped bill generation |
| `countryService` | Country Master reads and status updates |
| `taxService` | Tax rule CRUD, `changeTaxRate` versioning, status, verification |
| `taxCalculationService` | Applies rules to single transactions, batches and invoice-level summaries |
| `taxValidationService` | Rule, transaction, batch and invoice-total validation; `auditTaxMaster` health check |
| `taxAuditService` | Append-only audit journal |

Data currently comes from the mock layer in `src/mock-data/`; the service
boundary matches the intended backend split (`countries`, `tax_rules`,
`tax_audit_logs` tables plus the tax columns on `cdr_records`), so swapping in
real API calls is contained to these five files.

---

## 6. Validation

Checks run before an invoice can be finalised:

- **Rule level** — valid rate range, sensible effective dates, and no overlapping
  active rules for the same country, service type and period.
- **Transaction level** — billing country present, a rule resolves for the date,
  and the recomputed tax matches what was stored.
- **Invoice level** — the sum of the tax lines reconciles to the invoice total.
- **Master health** — `auditTaxMaster` surfaces countries with no active rule,
  overlapping rules and stale verification timestamps.

Anything the engine cannot resolve becomes `TAX_REVIEW_REQUIRED` and is surfaced
in the billing tax summary as an amount awaiting review, rather than being
silently taxed at zero.

---

## 7. Billing pipeline

```
CDR Ingestion
  → Call Rating (duration × rate plan, pulse rounding)
  → Tax Jurisdiction Resolution (billing country)
  → Tax/VAT Calculation (rule lookup → rate applied)
  → Tax Validation (review queue if unresolved)
  → Invoice Generation (with tax summary)
  → Audit Trail
```

The billing country is a **business attribute of the transaction**, not something
derived from the dialled number. A call to a German number billed to an Athens
cost centre is a Greek supply. Departments map to their billing jurisdiction in
the CDR mock data, and everything unmapped falls back to
`DEFAULT_BILLING_COUNTRY_CODE`.

### Generating a bill

Generation asks for the billing countries as well as the period. The country
picker is populated from `billingService.getUnbilledChargesByCountry`, so only
jurisdictions with actual traffic in the cycle can be selected, and each option
shows its call count and net charge. Deselecting a country leaves its charges
unbilled for that run rather than folding them into another jurisdiction.

Before anything is committed, the modal previews the run country by country —
net charge, the tax rule that resolved, the VAT amount and the total — using the
same engine that will rate the cycle. A country with no applicable rule is called
out as **Tax Review Required** at this point, so the gap is visible before the
invoice exists rather than after.

Two invoice scopes are supported:

- **Consolidated** — one invoice covering every selected jurisdiction, carrying
  the country breakdown and a multi-rate tax summary. Invoice number
  `INV-HTS-2026-09`.
- **Per country** — a separate invoice per jurisdiction, each carrying only its
  own VAT. Invoice numbers are suffixed with the ISO code, e.g.
  `INV-HTS-2026-09-EL`.

Call volumes and durations are apportioned from the selected splits, so a
single-country invoice reports only that country's traffic rather than the whole
cycle's.

---

## 8. User interface

| Route | Page | Contents |
| --- | --- | --- |
| `/tax` | Tax & VAT Master | Tax Rules, Country Master and Audit History tabs, with search, filters, add/edit and export |
| `/tax/reports` | Tax Reports | Tax Summary, Country-wise Tax, Tax Rate and Tax Audit reports |
| `/audit-logs` | Audit Logs | System-wide change history with search, filters and CSV export |

Tax also surfaces across the existing modules:

- **Dashboard** — a Tax & VAT Overview strip showing taxable amount, VAT
  collected, exempt amount, configured countries and active rules.
- **Billing** — a Tax Summary tab (rate distribution, country-wise tax, review
  queue) and country/rate/status filters on the invoice list.
- **Invoice** — a tax summary table that breaks out each rate when an invoice
  spans more than one, plus a country-wise section.
- **CDR Records** — a Billing Country column, and full tax detail in the record
  drawer and the CSV export.
- **Rate Plans** — the live calculator resolves the real applicable rule instead
  of a fixed percentage.
- **Settings** — the old default-tax-rate field is gone, replaced by a pointer to
  the Tax & VAT Master. Rates live in one place.

---

## 9. Working with tax data

Tax rates are regulatory data, and the module is built to treat them as such:
effective dates on every rule, a source reference and verification timestamp, no
overwrites, and a complete audit history.

The seeded rates are **reference values for the demo environment**. Before going
live, every rule must be populated and verified against the authoritative source
for its jurisdiction — the European Commission's TAXUD tables for EU member
states, and the national tax authority otherwise (HMRC, Skatteetaten, Skatturinn,
the Swiss ESTV, and for Greece the Independent Authority for Public Revenue
(AADE)). Reduced and super-reduced rates in particular vary by supply type and
change more often than standard rates.
