#!/usr/bin/env node
// Verify an AppotaPay IPN / redirect callback and decode the transaction.
// No dependencies (Node >= 16, uses built-in crypto).
//
// Usage as a library:
//   import { verifyAppotaPayCallback } from './verify-ipn.mjs'
//   const { ok, payload } = verifyAppotaPayCallback({ data, signature }, SECRET_KEY)
import crypto from 'node:crypto';

/**
 * @param {{data: string, signature: string}} body  the raw { data, signature } from IPN/redirect
 * @param {string} secretKey  your APPOTAPAY_SECRET_KEY
 * @returns {{ ok: boolean, payload: object|null }}
 */
export function verifyAppotaPayCallback(body, secretKey) {
  const { data, signature } = body || {};
  if (typeof data !== 'string' || typeof signature !== 'string') {
    return { ok: false, payload: null };
  }
  // Sign the RAW data string, exactly as received.
  const expected = crypto.createHmac('sha256', secretKey).update(data).digest('hex');

  // Constant-time compare (guard against length mismatch which timingSafeEqual would throw on).
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(signature, 'utf8');
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!ok) return { ok: false, payload: null };

  const payload = JSON.parse(Buffer.from(data, 'base64').toString('utf8'));
  return { ok: true, payload };
}

// --- Example Express IPN handler ---------------------------------------------
// import express from 'express';
// const app = express();
// app.use(express.json());
// app.post('/ipn', (req, res) => {
//   const { ok, payload } = verifyAppotaPayCallback(req.body, process.env.APPOTAPAY_SECRET_KEY);
//   if (!ok) return res.status(400).json({ status: 'invalid signature' });
//   const t = payload.transaction;
//   if (t.status === 'success' && Number(t.orderAmount) === expectedAmountFor(payload.partnerReference.order.id)) {
//     fulfillOnce(payload.partnerReference.order.id); // idempotent!
//   }
//   return res.status(200).json({ status: 'ok' }); // always ack so retries stop
// });

// --- CLI smoke test: echo '{"data":"...","signature":"..."}' | node verify-ipn.mjs
if (import.meta.url === `file://${process.argv[1]}`) {
  let raw = '';
  process.stdin.on('data', (c) => (raw += c));
  process.stdin.on('end', () => {
    const result = verifyAppotaPayCallback(JSON.parse(raw), process.env.APPOTAPAY_SECRET_KEY);
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.ok ? 0 : 1);
  });
}
