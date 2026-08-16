import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Guards a route with the `x-admin-key` header against env ADMIN_API_KEY.
 * These routes trigger real paid generations (~$0.42-$0.90 each), so this
 * is a deliberately simple personal-use gate, not a public auth system.
 *
 * Writes the 401 response itself and returns false when the request should
 * be rejected — callers should `if (!requireAdminKey(req, res)) return;`.
 */
export function requireAdminKey(req: VercelRequest, res: VercelResponse): boolean {
  const provided = req.headers['x-admin-key'];
  const expected = process.env.ADMIN_API_KEY;

  if (!expected || provided !== expected) {
    res.status(401).json({ error: 'unauthorized' });
    return false;
  }
  return true;
}
