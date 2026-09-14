// One-off codemod: converts the CDR Billing System demo data/UI from
// Indian Rupee + GST to European Euro + VAT. Run with `node scripts/europeanise.mjs`.
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

// Order matters: longer/more specific patterns first.
const replacements = [
  // --- Tax identity -------------------------------------------------------
  [/GSTIN:\s*07AAACA0123M1Z5\s*\|\s*PAN:\s*AAACA0123M/g, 'VAT ID: DE 811234567 | Tax Office: Finanzamt Frankfurt III'],
  [/GSTIN/g, 'VAT ID'],
  [/\bGST\b/g, 'VAT'],
  [/\bgst\b/g, 'vat'],

  // --- Currency -----------------------------------------------------------
  [/₹/g, '€'],
  [/'INR'/g, "'EUR'"],
  [/"INR"/g, '"EUR"'],
  [/\bINR\b/g, 'EUR'],
  [/Indian Rupee/g, 'Euro'],
  [/IndianRupee/g, 'Euro'],
  [/en-IN/g, 'en-IE'],

  // --- Geography ----------------------------------------------------------
  [/Airport Authority of India/g, 'European Telecom Services Group'],
  [/Reserve Bank of India/g, 'European Central Bank'],
  [/Airports Authority of India/g, 'European Telecom Services Group'],
  [/across India/g, 'across Europe'],
  [/within India/g, 'within Europe'],
  [/Indira Gandhi International Airport, Terminal 3 Telecom Bldg/g, 'Frankfurt Telecom Operations Centre, Building 3'],
  [/\bIndia\b/g, 'Germany'],
  [/\bIndian\b/g, 'European'],
  [/New Delhi/g, 'Frankfurt'],
  [/\bDelhi\b/g, 'Frankfurt'],
  [/Asia\/Kolkata \(IST \+05:30\)/g, 'Europe/Berlin (CET +01:00)'],
  [/Asia\/Kolkata/g, 'Europe/Berlin'],
  [/\+91 11 2565 /g, '+49 69 6900 '],
  [/\+91 11 2565/g, '+49 69 6900'],
  [/\+91/g, '+49'],

  // --- Organisation naming ------------------------------------------------
  [/Security & CISF/g, 'Security & Compliance'],
  [/Security \/ CISF/g, 'Security & Compliance'],
  [/CISF Command Control/g, 'Corporate Security Control'],
  [/\bCISF\b/g, 'Corporate Security'],
];

let changedFiles = 0;
let totalHits = 0;

for (const file of walk(ROOT)) {
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
