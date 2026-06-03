#!/usr/bin/env node
// Generate an AppotaPay X-APPOTAPAY-AUTH JWT (HS256).
//   npm i jsonwebtoken
//   APPOTAPAY_PARTNER_CODE=... APPOTAPAY_API_KEY=... APPOTAPAY_SECRET_KEY=... node gen-jwt.mjs
//
// Reusable: import { buildAppotaPayJwt } from './gen-jwt.mjs'
import jwt from 'jsonwebtoken';

/**
 * @param {{partnerCode: string, apiKey: string, secretKey: string, ttlSeconds?: number}} cfg
 * @returns {string} signed JWT for the X-APPOTAPAY-AUTH header
 */
export function buildAppotaPayJwt({ partnerCode, apiKey, secretKey, ttlSeconds = 300 }) {
  if (!partnerCode || !apiKey || !secretKey) {
    throw new Error('partnerCode, apiKey and secretKey are required');
  }
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: partnerCode,
    jti: `${apiKey}-${now}`,
    api_key: apiKey,
    exp: now + ttlSeconds,
  };
  return jwt.sign(payload, secretKey, {
    algorithm: 'HS256',
    header: { typ: 'JWT', cty: 'appotapay-api;v=1' },
  });
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const token = buildAppotaPayJwt({
    partnerCode: process.env.APPOTAPAY_PARTNER_CODE,
    apiKey: process.env.APPOTAPAY_API_KEY,
    secretKey: process.env.APPOTAPAY_SECRET_KEY,
  });
  console.log(token);
}
