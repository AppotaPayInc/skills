#!/usr/bin/env node
// Maintainer tool: refresh the OFFLINE snapshot under each skill's references/ from the LIVE docs.
// Writes the raw live llms-*.txt next to the hand-written references as `*.live.txt`, so reviewers
// can diff the current spec against the curated reference before committing.
// No dependencies (Node >= 18). Run from the repo root:  node skills/appotapay/scripts/sync-references.mjs
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DOCS = (process.env.DOCS || 'https://docs.appotapay.com').replace(/\/$/, '');
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..'); // repo root

// page (llms file basename) -> where to drop the live copy for review
const MAP = [
  ['llms-v2.0-authentication-full.txt',            'skills/appotapay-auth/references/authentication.live.txt'],
  ['llms-v2.0-security-full.txt',                  'skills/appotapay-auth/references/jwt.live.txt'],
  ['llms-v2.0-payment-payment-signature-full.txt', 'skills/appotapay-auth/references/signature.live.txt'],
  ['llms-v2.0-payment-payment-full.txt',           'skills/appotapay-payment/references/create-payment.live.txt'],
  ['llms-v2.0-payment-payment-result-full.txt',    'skills/appotapay-payment/references/ipn.live.txt'],
  ['llms-v2.0-payment-payment-status-full.txt',    'skills/appotapay-payment/references/status.live.txt'],
  ['llms-v2.0-payment-refund-full.txt',            'skills/appotapay-payment/references/refund.live.txt'],
  ['llms-v2.0-payment-payment-code-full.txt',      'skills/appotapay-payment/references/codes.live.txt'],
  ['llms-v2.0-payment-payment-sandbox-full.txt',   'skills/appotapay-payment/references/sandbox.live.txt'],
];

let ok = 0, fail = 0;
for (const [file, dest] of MAP) {
  const url = `${DOCS}/${file}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const out = resolve(ROOT, dest);
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, `# Synced from ${url}\n# Review and fold changes into the curated reference, then delete this file.\n\n${text}`);
    console.log(`✓ ${dest}`);
    ok++;
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
    fail++;
  }
}
console.log(`\nDone. ${ok} ok, ${fail} failed. Review the *.live.txt diffs, update the curated references, then remove the *.live.txt files.`);
process.exit(fail ? 1 : 0);
