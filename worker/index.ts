/**
 * Cloudflare Worker — Renfo Trail push notification service
 *
 * Routes:
 *   POST   /api/subscribe        save or update a push subscription
 *   DELETE /api/subscribe        remove a push subscription
 *   POST   /api/sync             update workoutsThisWeek for a device
 *
 * Cron: every hour — send push to devices whose reminderTime matches
 */

export interface Env {
  SUBSCRIPTIONS: KVNamespace
  VAPID_PRIVATE_KEY: string
  VAPID_PUBLIC_KEY: string
}

export interface ProfilePrefs {
  workoutsPerWeek: number
  reminderTime: string   // "HH:MM"
  timezone: string
  enabled: boolean
}

export interface SubscriptionRecord {
  subscription: PushSubscriptionJSON
  deviceId: string
  prefs: ProfilePrefs
  workoutsThisWeek: number
  weekStart: string   // ISO date of Monday of current week
  lastSync: string    // ISO date
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function weekStartISO(timezone: string): string {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: timezone }))
  const day = now.getDay() === 0 ? 6 : now.getDay() - 1 // Mon=0
  const monday = new Date(now)
  monday.setDate(now.getDate() - day)
  return monday.toISOString().slice(0, 10)
}

function cors(res: Response): Response {
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  return res
}

async function sendWebPush(
  env: Env,
  subscription: PushSubscriptionJSON,
  payload: { title: string; body: string }
): Promise<boolean> {
  const { keys, endpoint } = subscription
  if (!keys?.p256dh || !keys?.auth || !endpoint) return false

  // Build the JWT for VAPID auth
  const audience = new URL(endpoint).origin
  const exp = Math.floor(Date.now() / 1000) + 12 * 3600

  const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'ES256' })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const claims = btoa(JSON.stringify({ aud: audience, exp, sub: 'mailto:admin@renfotrail.app' })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

  // Import VAPID private key (PKCS8 base64url)
  const rawKey = Uint8Array.from(atob(env.VAPID_PRIVATE_KEY.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))
  const privateKey = await crypto.subtle.importKey(
    'pkcs8', rawKey,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false, ['sign']
  )

  const sigInput = new TextEncoder().encode(`${header}.${claims}`)
  const sigRaw = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, privateKey, sigInput)
  const sig = btoa(String.fromCharCode(...new Uint8Array(sigRaw))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const jwt = `${header}.${claims}.${sig}`

  // Encrypt payload using WebCrypto (Web Push encryption RFC 8291)
  const body = JSON.stringify(payload)
  const encoder = new TextEncoder()
  const contentEncoding = 'aes128gcm'

  // Recipient public key
  const recipientKey = await crypto.subtle.importKey(
    'raw',
    Uint8Array.from(atob(keys.p256dh.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)),
    { name: 'ECDH', namedCurve: 'P-256' },
    false, []
  )

  // Generate sender EC key pair
  const senderKeyPair = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits'])
  const senderPublicRaw = new Uint8Array(await crypto.subtle.exportKey('raw', senderKeyPair.publicKey))

  // Derive shared secret
  const sharedBits = await crypto.subtle.deriveBits({ name: 'ECDH', public: recipientKey }, senderKeyPair.privateKey, 256)

  // Auth secret
  const authSecret = Uint8Array.from(atob(keys.auth.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))

  // HKDF to derive content encryption key and nonce
  const prk = await crypto.subtle.importKey('raw', new Uint8Array(sharedBits), { name: 'HKDF' }, false, ['deriveBits'])
  const salt = crypto.getRandomValues(new Uint8Array(16))

  const keyInfo = encoder.encode('Content-Encoding: aes128gcm\0')
  const nonceInfo = encoder.encode('Content-Encoding: nonce\0')
  const contextInfo = new Uint8Array([...encoder.encode('WebPush: info\0'), ...authSecret, ...senderPublicRaw, ...new Uint8Array(await crypto.subtle.exportKey('raw', recipientKey))])

  const ikm = await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt: authSecret, info: contextInfo }, prk, 256)
  const ikmKey = await crypto.subtle.importKey('raw', ikm, { name: 'HKDF' }, false, ['deriveBits'])

  const contentKey = await crypto.subtle.importKey(
    'raw',
    await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info: keyInfo }, ikmKey, 128),
    { name: 'AES-GCM' }, false, ['encrypt']
  )
  const nonce = new Uint8Array(await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info: nonceInfo }, ikmKey, 96))

  // Pad and encrypt
  const plaintext = encoder.encode(body)
  const padded = new Uint8Array([...plaintext, 2]) // AEAD_AES_128_GCM padding delimiter
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, contentKey, padded))

  // Build header: salt(16) + rs(4) + keyid_len(1) + sender_public(65)
  const rs = new Uint8Array(4)
  new DataView(rs.buffer).setUint32(0, 4096, false)
  const header = new Uint8Array([...salt, ...rs, senderPublicRaw.length, ...senderPublicRaw])
  const encrypted = new Uint8Array([...header, ...ciphertext])

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': `application/octet-stream`,
      'Content-Encoding': contentEncoding,
      'TTL': '86400',
      'Authorization': `vapid t=${jwt},k=${env.VAPID_PUBLIC_KEY}`,
    },
    body: encrypted,
  })

  return res.ok || res.status === 201
}

function shouldNotify(record: SubscriptionRecord, now: Date): boolean {
  if (!record.prefs.enabled) return false

  // Check if workouts this week goal already reached
  const curWeekStart = weekStartISO(record.prefs.timezone)
  const weeklyDone = record.weekStart === curWeekStart ? record.workoutsThisWeek : 0
  if (weeklyDone >= record.prefs.workoutsPerWeek) return false

  // Check if current hour matches reminderTime (within this hour window)
  const local = new Date(now.toLocaleString('en-US', { timeZone: record.prefs.timezone }))
  const [rh, rm] = record.prefs.reminderTime.split(':').map(Number)
  return local.getHours() === rh && local.getMinutes() < 60
}

function notifMessage(record: SubscriptionRecord): string {
  const curWeekStart = weekStartISO(record.prefs.timezone)
  const done = record.weekStart === curWeekStart ? record.workoutsThisWeek : 0
  const left = record.prefs.workoutsPerWeek - done
  if (left === 1) return 'Plus qu'une séance pour atteindre ton objectif cette semaine 💪'
  return `Objectif : ${done}/${record.prefs.workoutsPerWeek} séances cette semaine. C'est parti !`
}

// ── Request handlers ──────────────────────────────────────────────────────────

async function handleSubscribe(req: Request, env: Env): Promise<Response> {
  const body = await req.json() as {
    subscription: PushSubscriptionJSON
    deviceId: string
    prefs: ProfilePrefs
    workoutsThisWeek?: number
    weekStart?: string
  }

  const record: SubscriptionRecord = {
    subscription: body.subscription,
    deviceId: body.deviceId,
    prefs: body.prefs,
    workoutsThisWeek: body.workoutsThisWeek ?? 0,
    weekStart: body.weekStart ?? weekStartISO(body.prefs.timezone),
    lastSync: new Date().toISOString(),
  }

  await env.SUBSCRIPTIONS.put(body.deviceId, JSON.stringify(record))
  return cors(new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
}

async function handleUnsubscribe(req: Request, env: Env): Promise<Response> {
  const { deviceId } = await req.json() as { deviceId: string }
  await env.SUBSCRIPTIONS.delete(deviceId)
  return cors(new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
}

async function handleSync(req: Request, env: Env): Promise<Response> {
  const { deviceId, workoutsThisWeek, weekStart } = await req.json() as {
    deviceId: string; workoutsThisWeek: number; weekStart: string
  }
  const raw = await env.SUBSCRIPTIONS.get(deviceId)
  if (!raw) return cors(new Response(JSON.stringify({ ok: false }), { status: 404, headers: { 'Content-Type': 'application/json' } }))
  const record: SubscriptionRecord = JSON.parse(raw)
  record.workoutsThisWeek = workoutsThisWeek
  record.weekStart = weekStart
  record.lastSync = new Date().toISOString()
  await env.SUBSCRIPTIONS.put(deviceId, JSON.stringify(record))
  return cors(new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
}

// ── Entry point ───────────────────────────────────────────────────────────────

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url)

    if (req.method === 'OPTIONS') return cors(new Response(null, { status: 204 }))

    if (url.pathname === '/api/subscribe') {
      if (req.method === 'POST') return handleSubscribe(req, env)
      if (req.method === 'DELETE') return handleUnsubscribe(req, env)
    }
    if (url.pathname === '/api/sync' && req.method === 'POST') return handleSync(req, env)

    return cors(new Response('Not found', { status: 404 }))
  },

  async scheduled(_event: ScheduledEvent, env: Env): Promise<void> {
    const now = new Date()
    const { keys } = await env.SUBSCRIPTIONS.list()

    await Promise.allSettled(keys.map(async (k) => {
      const raw = await env.SUBSCRIPTIONS.get(k.name)
      if (!raw) return
      const record: SubscriptionRecord = JSON.parse(raw)
      if (!shouldNotify(record, now)) return

      const sent = await sendWebPush(env, record.subscription, {
        title: '🏔️ Renfo Trail',
        body: notifMessage(record),
      })

      // Clean up stale subscriptions (push endpoint returned 410 Gone)
      if (!sent) await env.SUBSCRIPTIONS.delete(k.name)
    }))
  },
}
