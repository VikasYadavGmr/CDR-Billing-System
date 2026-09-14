// One-off codemod: re-points the billing entity identity from Frankfurt/Germany
// to Athens/Greece. The Country Master keeps every European country — only the
// billing entity's own identity changes. Run with `node scripts/greece-focus.mjs`.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(process.cwd(), 'src');

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx)$/.test(entry)) out.push(full);
  }
  return out;
}

const replacements = [
  // Billing entity identity
  [/VAT ID: DE 811234567 \| Tax Office: Finanzamt Frankfurt III/g, 'VAT ID: EL 998765432 | Tax Office: Athens Tax Office (DOY) A'],
  [/Frankfurt Telecom Operations Centre, Building 3/g, 'Athens Telecom Operations Centre, Building 3'],
  [/European Telecom Services Group/g, 'Hellenic Telecom Services Group'],
  [/telecom\.billing@ets-group\.eu/g, 'telecom.billing@hts-group.gr'],
  [/telecom\.admin@ets-group\.eu/g, 'telecom.admin@hts-group.gr'],
  [/INV-ETS-/g, 'INV-HTS-'],

  // Locations & dialling
  [/Frankfurt Metro/g, 'Athens Metro'],
  [/Munich \/ Hamburg/g, 'Thessaloniki / Patras'],
  [/\bFrankfurt\b/g, 'Athens'],
  [/\+49 69 6900/g, '+30 21 0900'],
  [/\+49/g, '+30'],
  [/Europe\/Berlin \(CET \+01:00\)/g, 'Europe/Athens (EET +02:00)'],
  [/Europe\/Berlin/g, 'Europe/Athens'],
];

let changedFiles = 0;
let totalHits = 0;

for (const file of walk(ROOT)) {
  // The Country Master and tax master must keep every European country intact.
  if (/mock-data[\\/](countryData|taxData|taxAuditData)\.ts$/.test(file)) continue;

  const original = readFileSync(file, 'utf8');
  let next = original;
  for (const [pattern, value] of replacements) {
    const matches = next.match(pattern);
    if (matches) totalHits += matches.length;
    next = next.replace(pattern, value);
  }
  if (next !== original) {
    writeFileSync(file, next, 'utf8');
    changedFiles++;
    console.log('updated', file.replace(process.cwd(), '.'));
  }
}

console.log(`\n${changedFiles} files changed, ${totalHits} replacements.`);
