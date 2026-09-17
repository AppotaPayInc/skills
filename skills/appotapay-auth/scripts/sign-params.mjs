#!/usr/bin/env node
// Build an AppotaPay "Family A" parameter signature: take a NAMED SUBSET of fields, sort the keys
// alphabetically, join as key=value with &, then HMAC-SHA256 with SECRET_KEY.
// No dependencies (Node >= 18).
//
//   APPOTAPAY_SECRET_KEY=... node sign-params.mjs \
//     --fields partnerRefId,phoneNumber,productCode,telco,telcoServiceType \
//     --params '{"partnerRefId":"AB123","phoneNumber":"0866123456","productCode":"viettel_10",
//                "telco":"viettel","telcoServiceType":"prepaid","signature":"ignored"}'
//
// Prints the canonical string (stderr) and the hex signature (stdout).
//
// IMPORTANT: the field list is per endpoint AND per direction (request vs response). Read it off the
// endpoint's doc page — see appotapay-auth/references/signature.md for the table.
import { createHmac, timingSafeEqual } from 'node:crypto';

/** Canonical string: only `fields`, sorted, joined `key=value` with `&`, values raw (no encoding). */
export function canonicalString(params, fields) {
  return [...fields]
    .sort()
    .map((k) => `${k}=${serialize(params[k])}`)
    .join('&');
}

function serialize(v) {
  if (v === undefined || v === null) return '';
  if (typeof v === 'object') return JSON.stringify(v); // e.g. virtual-account `payment`
  return String(v);
}

export function signParams(params, fields, secretKey) {
  const canonical = canonicalString(params, fields);
  return { canonical, signature: createHmac('sha256', secretKey).update(canonical, 'utf8').digest('hex') };
}

/** Constant-time compare of two hex digests. */
export function verifyParams(params, fields, secretKey, received) {
  const { signature } = signParams(params, fields, secretKey);
  const a = Buffer.from(signature, 'utf8');
  const b = Buffer.from(String(received || ''), 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = (name) => {
    const i = process.argv.indexOf(`--${name}`);
    return i === -1 ? undefined : process.argv[i + 1];
  };
  const secret = process.env.APPOTAPAY_SECRET_KEY;
  const fields = arg('fields')?.split(',').map((s) => s.trim()).filter(Boolean);
  const params = arg('params');
  if (!secret || !fields || !params) {
    process.stderr.write('usage: APPOTAPAY_SECRET_KEY=... node sign-params.mjs --fields a,b,c --params \'{"a":1}\'\n');
    process.exit(1);
  }
  const { canonical, signature } = signParams(JSON.parse(params), fields, secret);
  process.stderr.write(`# canonical: ${canonical}\n`);
  process.stdout.write(signature + '\n');
}
