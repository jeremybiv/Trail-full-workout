import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client, authenticated with the service-role key.
 * Import this ONLY from files under /api — never from src/, or the service
 * role key would end up in the client bundle.
 */

export interface ExerciseVideoRow {
  id: string;
  exercise_slug: string;
  prompt: string;
  fal_request_id: string | null;
  status: 'pending' | 'completed' | 'failed';
  video_url: string | null;
  gif_url: string | null;
  estimated_cost_usd: number | null;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars');
  }

  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}
