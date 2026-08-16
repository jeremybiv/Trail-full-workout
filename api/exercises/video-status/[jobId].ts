import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin } from '../../_lib/supabase';

const STUCK_AFTER_MS = 5 * 60 * 1000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const { jobId } = req.query;
  if (typeof jobId !== 'string') {
    return res.status(400).json({ error: 'jobId required' });
  }

  const supabase = getSupabaseAdmin();
  const { data: row, error } = await supabase
    .from('exercise_videos')
    .select('status, video_url, gif_url, created_at')
    .eq('id', jobId)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  if (!row) {
    return res.status(404).json({ error: 'job not found' });
  }

  // Computed on read, never written back — the webhook stays the single
  // writer of `status`, so a stuck read can never race a webhook that
  // completes the job a moment later.
  if (row.status === 'pending') {
    const ageMs = Date.now() - new Date(row.created_at).getTime();
    if (ageMs > STUCK_AFTER_MS) {
      return res.status(200).json({ status: 'stuck' });
    }
  }

  return res.status(200).json({
    status: row.status,
    videoUrl: row.video_url ?? undefined,
    gifUrl: row.gif_url ?? undefined,
  });
}
