import { fal } from '@fal-ai/client';

fal.config({ credentials: process.env.FAL_KEY });

// `as const` so TS narrows this to the literal endpoint id and can type-check
// the input against the real `@fal-ai/client` schema for this model below.
export const KLING_MODEL = 'fal-ai/kling-video/v3/standard/text-to-video' as const;

export type KlingDuration = '5' | '8' | '10';
export type KlingResolution = '720p' | '1080p';

// Standard tier, 720p, no audio — per the pricing figure supplied by the
// product owner. TODO: adjust (or branch by resolution) if 1080p / a
// different tier turns out to be priced differently — this is a best-effort
// estimate for cost logging, not a billing source of truth.
const STANDARD_720P_RATE_PER_SEC = 0.084;

export function estimateCostUsd(durationSec: KlingDuration): number {
  return Number(durationSec) * STANDARD_720P_RATE_PER_SEC;
}

export interface SubmitKlingOptions {
  prompt: string;
  duration: KlingDuration;
  resolution: KlingResolution;
  webhookUrl: string;
}

/**
 * Submits a text-to-video job to the fal.ai QUEUE (never a blocking
 * subscribe/run call). Kling generations take 30-120s, well past Vercel's
 * serverless function timeout, so the result is only ever collected via the
 * webhook configured here — this call just enqueues the job and returns.
 *
 * NOTE: `fal-ai/kling-video/v3/standard/text-to-video`'s real input schema
 * (per the installed `@fal-ai/client` type definitions) has no `resolution`
 * field — Standard tier appears to have a fixed output resolution. The
 * `resolution` argument here is accepted for API-surface parity with the
 * original spec and used for cost estimation, but is intentionally NOT
 * forwarded to fal.ai. Re-check this against fal.ai's current docs/dashboard
 * for this model in case a resolution knob exists under a different name.
 */
export async function submitKlingGeneration(opts: SubmitKlingOptions): Promise<string> {
  const { request_id } = await fal.queue.submit(KLING_MODEL, {
    input: {
      prompt: opts.prompt,
      duration: opts.duration,
      generate_audio: false,
    },
    webhookUrl: opts.webhookUrl,
  });
  return request_id;
}
