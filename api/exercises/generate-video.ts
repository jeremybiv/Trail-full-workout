import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdminKey } from '../_lib/admin-auth';
import { getSupabaseAdmin } from '../_lib/supabase';
import { submitKlingGeneration, estimateCostUsd, type KlingDuration, type KlingResolution } from '../_lib/fal';

interface GenerateVideoBody {
  prompt?: string;
  exerciseSlug?: string;
  duration?: KlingDuration;
  resolution?: KlingResolution;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' });
  }
  if (!requireAdminKey(req, res)) return;

  const { prompt, exerciseSlug, duration = '5', resolution = '720p' } = (req.body ?? {}) as GenerateVideoBody;
  if (!prompt || !exerciseSlug) {
    return res.status(400).json({ error: 'prompt and exerciseSlug are required' });
  }

  const supabase = getSupabaseAdmin();

  // Dedupe: never spend money regenerating a video we already have.
  const { data: existing, error: lookupErr } = await supabase
    .from('exercise_videos')
    .select('video_url')
    .eq('exercise_slug', exerciseSlug)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lookupErr) {
    return res.status(500).json({ error: 'supabase lookup failed', detail: lookupErr.message });
  }
  if (existing?.video_url) {
    return res.status(200).json({ status: 'completed', videoUrl: existing.video_url });
  }

  const host = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.PUBLIC_APP_URL;
  if (!host) {
    return res.status(500).json({ error: 'cannot determine deployment URL for webhook_url' });
  }
  const webhookUrl = `${host}/api/exercises/video-webhook`;

  let requestId: string;
  try {
    requestId = await submitKlingGeneration({ prompt, duration, resolution, webhookUrl });
  } catch (err) {
    // Nothing was submitted to fal.ai, so don't create a row to track it.
    return res.status(502).json({ error: 'fal.ai submission failed', detail: (err as Error).message });
  }

  const { data: row, error: insertErr } = await supabase
    .from('exercise_videos')
    .insert({
      exercise_slug: exerciseSlug,
      fal_request_id: requestId,
      status: 'pending',
      prompt,
      estimated_cost_usd: estimateCostUsd(duration),
    })
    .select('id')
    .single();

  if (insertErr) {
    // The job IS running on fal.ai at this point even though we failed to
    // record it — its webhook will arrive with no matching row. Not worth
    // building reconciliation for a personal tool; log loudly instead.
    console.error('exercise_videos insert failed after fal.ai submit', insertErr, { requestId, exerciseSlug });
    return res.status(500).json({ error: 'supabase insert failed', detail: insertErr.message });
  }

  return res.status(200).json({ jobId: row.id, status: 'pending' });
}
