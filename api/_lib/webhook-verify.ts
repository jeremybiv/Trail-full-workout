// ============================================================================
// fal.ai webhook signature verification
//
// BEST-EFFORT IMPLEMENTATION — docs.fal.ai was unreachable when this was
// written (egress-blocked in the dev environment). Before relying on this
// in production, re-check the current fal.ai webhooks documentation for:
//   - the exact byte sequence fal signs (assumed below:
//     `${requestId}.${userId}.${timestamp}.${sha256hex(rawBody)}`)
//   - whether it's the raw request body or a parsed/re-serialized JSON body
//     that gets hashed (this implementation hashes the untouched raw bytes,
//     which is why the webhook route disables Vercel's body parser)
//   - the JWKS response shape (key selection, key encoding: JWK vs base64
//     vs PEM) — this assumes standard JWK entries importable via
//     `crypto.subtle.importKey('jwk', ...)`
//   - the signature encoding (assumed hex below; could be base64)
//   - clock-skew tolerance for X-Fal-Webhook-Timestamp (this impl allows 5
//     minutes either direction)
//
// Behavior: FAILS CLOSED. Any missing header, JWKS fetch error, expired
// timestamp, or signature mismatch across every published key => reject
// (throws), and the webhook handler treats that as "do not trust this
// payload" (401, nothing written to the DB).
//
// This is intentionally isolated in its own file so a fix to any of the
// assumptions above is a one-file patch that doesn't touch route logic.
// ============================================================================

import { webcrypto, type JsonWebKey } from 'node:crypto';

const JWKS_URL = 'https://rest.alpha.fal.ai/.well-known/jwks.json';
const JWKS_CACHE_MS = 24 * 60 * 60 * 1000; // fal.ai docs: don't cache longer than 24h
const MAX_CLOCK_SKEW_MS = 5 * 60 * 1000;

interface JwksCache {
  keys: JsonWebKey[];
  fetchedAt: number;
}

let jwksCache: JwksCache | null = null;

async function getJwks(): Promise<JsonWebKey[]> {
  const now = Date.now();
  if (jwksCache && now - jwksCache.fetchedAt < JWKS_CACHE_MS) {
    return jwksCache.keys;
  }

  const res = await fetch(JWKS_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch fal.ai JWKS: ${res.status}`);
  }
  const body = (await res.json()) as { keys: JsonWebKey[] };
  jwksCache = { keys: body.keys, fetchedAt: now };
  return jwksCache.keys;
}

export interface FalWebhookHeaders {
  requestId: string | undefined;
  userId: string | undefined;
  timestamp: string | undefined;
  signature: string | undefined;
}

/**
 * Verifies a fal.ai webhook request. Throws on any failure — callers must
 * treat a thrown error as "reject the request", never as "skip verification
 * and continue".
 */
export async function verifyFalWebhook(headers: FalWebhookHeaders, rawBody: string): Promise<void> {
  const { requestId, userId, timestamp, signature } = headers;
  if (!requestId || !userId || !timestamp || !signature) {
    throw new Error('Missing required fal.ai webhook headers');
  }

  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(Date.now() - ts * 1000) > MAX_CLOCK_SKEW_MS) {
    throw new Error('fal.ai webhook timestamp out of tolerance');
  }

  const encoder = new TextEncoder();
  const bodyHashBuffer = await webcrypto.subtle.digest('SHA-256', encoder.encode(rawBody));
  const bodyHashHex = Buffer.from(bodyHashBuffer).toString('hex');
  const message = `${requestId}.${userId}.${timestamp}.${bodyHashHex}`;

  let signatureBytes: Buffer;
  try {
    signatureBytes = Buffer.from(signature, 'hex');
  } catch {
    throw new Error('fal.ai webhook signature is not valid hex');
  }

  const jwks = await getJwks();
  for (const jwk of jwks) {
    try {
      const key = await webcrypto.subtle.importKey('jwk', jwk, { name: 'Ed25519' }, false, ['verify']);
      const ok = await webcrypto.subtle.verify('Ed25519', key, signatureBytes, encoder.encode(message));
      if (ok) return; // verified against at least one published key
    } catch {
      // this key didn't work (wrong kid/shape) — try the next one
    }
  }

  throw new Error('fal.ai webhook signature verification failed against all published keys');
}
