#!/usr/bin/env node
// Fetch a LIVE AppotaPay doc (llms-*.txt) so generated code matches the current spec.
// No dependencies (Node >= 18, uses global fetch).
//
//   node fetch-doc.mjs index                 -> llms.txt (index of every v2.0 page)
//   node fetch-doc.mjs full                  -> llms-full.txt (all v2.0 docs)
//   node fetch-doc.mjs payment-payment       -> llms-v2.0-payment-payment-full.txt
//   node fetch-doc.mjs <slug> --v 1.1        -> llms-v1.1-<slug>-full.txt
//   DOCS=https://docs.dev.appotapay.com node fetch-doc.mjs index
//
// <slug> = doc path with '/' replaced by '-' (see `index` to discover slugs).

const DOCS = (process.env.DOCS || 'https://docs.appotapay.com').replace(/\/$/, '');

function urlFor(arg, version) {
  if (arg === 'index') return version === '2.0' ? `${DOCS}/llms.txt` : `${DOCS}/llms-v${version}.txt`;
  if (arg === 'full') return version === '2.0' ? `${DOCS}/llms-full.txt` : `${DOCS}/llms-v${version}-full.txt`;
  return `${DOCS}/llms-v${version}-${arg}-full.txt`;
}

export async function fetchDoc(arg = 'index', version = '2.0') {
  const url = urlFor(arg, version);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return { url, text: await res.text() };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const vIdx = args.indexOf('--v');
  const version = vIdx !== -1 ? args[vIdx + 1] : '2.0';
  const arg = args.find((a) => a !== '--v' && a !== version) || 'index';
  fetchDoc(arg, version)
    .then(({ url, text }) => {
      process.stderr.write(`# fetched ${url}\n`);
      process.stdout.write(text);
    })
    .catch((e) => {
      process.stderr.write(String(e.message) + '\n');
      process.exit(1);
    });
}
