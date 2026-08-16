import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin } from '../_lib/supabase';
import { verifyFalWebhook } from '../_lib/webhook-verify';

// Signature verification needs the exact raw bytes fal.ai signed, so the
// default JSON body parser is disabled here — see api/_lib/webhook-verify.ts.
export const config = {
  api: { bodyParser: false },
};

async function readRawBody(req: VercelRequest): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf8');
}

interface FalWebhookPayload {
  request_id: string;
  status?: 'OK' | 'ERROR' | string;
  error?: string;
  payload?: {
    video?: { url?: string };
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const rawBody = await readRawBody(req);

  try {
    await verifyFalWebhook(
      {
        requestId: req.headers['x-fal-webhook-request-id'] as string | undefined,
        userId: req.headers['x-fal-webhook-user-id'] as string | undefined,
        timestamp: req.headers['x-fal-webhook-timestamp'] as string | undefined,
        signature: req.headers['x-fal-webhook-signature'] as string | undefined,
      },
      rawBody,
    );
  } catch (err) {
    console.error('fal.ai webhook signature rejected', err);
    return res.status(401).json({ error: 'invalid signature' });
  }

  let payload: FalWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: 'invalid JSON body' });
  }

  const supabase = getSupabaseAdmin();

  const { data: row, error: findErr } = await supabase
    .from('exercise_videos')
    .select('id, exercise_slug')
    .eq('fal_request_id', payload.request_id)
    .maybeSingle();

  if (findErr || !row) {
    // No point having fal.ai retry a webhook for a row we'll never find —
    // ack it anyway, but log so this is visible if it happens repeatedly.
    console.error('webhook: no matching exercise_videos row', payload.request_id, findErr);
    return res.status(200).json({ ok: true });
  }

  if (payload.status === 'ERROR' || payload.error) {
    await supabase
      .from('exercise_videos')
      .update({ status: 'failed', error_message: String(payload.error ?? 'unknown fal.ai error') })
      .eq('id', row.id);
    return res.status(200).json({ ok: true });
  }

  // NOTE: assumed success payload shape `payload.payload.video.url`, per the
  // typical fal.ai queue result envelope — confirm against a real webhook
  // delivery and adjust if it differs.
  const videoUrl = payload.payload?.video?.url;
  if (!videoUrl) {
    await supabase
      .from('exercise_videos')
      .update({ status: 'failed', error_message: 'webhook success payload missing video url' })
      .eq('id', row.id);
    return res.status(200).json({ ok: true });
  }

  try {
    const mp4Res = await fetch(videoUrl);
    if (!mp4Res.ok) {
      throw new Error(`download failed: ${mp4Res.status}`);
    }
    const mp4Buffer = Buffer.from(await mp4Res.arrayBuffer());

    const storagePath = `${row.exercise_slug}/${Date.now()}.mp4`;
    const { error: uploadErr } = await supabase.storage
      .from('exercise-videos')
      .upload(storagePath, mp4Buffer, { contentType: 'video/mp4', upsert: false });
    if (uploadErr) throw uploadErr;

    const { data: pub } = supabase.storage.from('exercise-videos').getPublicUrl(storagePath);

    await supabase
      .from('exercise_videos')
      .update({
        status: 'completed',
        video_url: pub.publicUrl,
        gif_url: null, // v1 has no GIF tier — explicit product decision
        completed_at: new Date().toISOString(),
      })
      .eq('id', row.id);
  } catch (err) {
    await supabase
      .from('exercise_videos')
      .update({ status: 'failed', error_message: (err as Error).message })
      .eq('id', row.id);
  }

  return res.status(200).json({ ok: true });
}
