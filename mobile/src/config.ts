// Exercise photos/videos stay hosted remotely (see plan §"Médias distants") —
// they are NOT bundled into the native app binary. Point this at the deployed
// web app's origin (Vercel), which already serves everything under /exercises/.
// TODO: replace with the actual production domain before a real device/EAS build.
export const MEDIA_BASE_URL = 'https://trail-full-workout.vercel.app';

export function exercisePhotoUrl(id: string, frame: 0 | 1): string {
  return `${MEDIA_BASE_URL}/exercises/${id}-${frame}.jpg`;
}

export function exerciseVideoUrl(path: string): string {
  return `${MEDIA_BASE_URL}${path}`;
}
