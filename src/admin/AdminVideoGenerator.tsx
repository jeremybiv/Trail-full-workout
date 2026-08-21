import { useEffect, useRef, useState } from 'react';
import { ALL } from '../data/exercises';
import { NAME_EN } from '../data/exerciseNamesEn';
import { ExerciseVideo } from '../components/ExerciseVideo';
import './admin.css';

type Duration = '5' | '8' | '10';
type Resolution = '720p' | '1080p';
type JobStatus = 'idle' | 'pending' | 'completed' | 'failed' | 'stuck';

const ADMIN_KEY_STORAGE = 'runforce_admin_key';
const POLL_INTERVAL_MS = 5000;

// Mirrors api/_lib/fal.ts's estimateCostUsd — duplicated on purpose rather
// than imported, since that file lives under /api (server-only) and must
// never end up in the client bundle.
function estimateCostUsd(duration: Duration): number {
  return Number(duration) * 0.084;
}

const exerciseOptions = Object.values(ALL).sort((a, b) =>
  (NAME_EN[a.id] ?? a.id).localeCompare(NAME_EN[b.id] ?? b.id),
);

export default function AdminVideoGenerator() {
  const [adminKey, setAdminKey] = useState('');
  const [exerciseSlug, setExerciseSlug] = useState(exerciseOptions[0]?.id ?? '');
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState<Duration>('5');
  const [resolution, setResolution] = useState<Resolution>('720p');

  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus>('idle');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_KEY_STORAGE);
    if (stored) setAdminKey(stored);
  }, []);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  function persistAdminKey(value: string) {
    setAdminKey(value);
    localStorage.setItem(ADMIN_KEY_STORAGE, value);
  }

  function startPolling(id: string) {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/exercises/video-status/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? `status ${res.status}`);

        setJobStatus(data.status);
        if (data.videoUrl) setVideoUrl(data.videoUrl);

        if (data.status === 'completed' || data.status === 'failed' || data.status === 'stuck') {
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch (err) {
        setSubmitError((err as Error).message);
        if (pollRef.current) clearInterval(pollRef.current);
      }
    }, POLL_INTERVAL_MS);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setVideoUrl(null);
    setJobId(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/exercises/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ prompt, exerciseSlug, duration, resolution }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `request failed (${res.status})`);

      if (data.status === 'completed' && data.videoUrl) {
        setJobStatus('completed');
        setVideoUrl(data.videoUrl);
      } else {
        setJobId(data.jobId);
        setJobStatus('pending');
        startPolling(data.jobId);
      }
    } catch (err) {
      setSubmitError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-page">
      <h1 className="admin-title">RunForce — Générateur de vidéos (admin)</h1>
      <p className="admin-hint">
        Page non liée dans l'app — usage personnel uniquement. Chaque génération coûte de l'argent réel.
      </p>

      <form className="admin-form" onSubmit={handleSubmit}>
        <label className="admin-field">
          <span>Clé admin</span>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => persistAdminKey(e.target.value)}
            placeholder="x-admin-key"
            required
          />
        </label>

        <label className="admin-field">
          <span>Exercice</span>
          <select value={exerciseSlug} onChange={(e) => setExerciseSlug(e.target.value)}>
            {exerciseOptions.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {NAME_EN[ex.id] ?? ex.id}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-field">
          <span>Prompt</span>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="Décris le mouvement pour Kling…"
            required
          />
        </label>

        <div className="admin-row">
          <label className="admin-field">
            <span>Durée</span>
            <select value={duration} onChange={(e) => setDuration(e.target.value as Duration)}>
              <option value="5">5s</option>
              <option value="8">8s</option>
              <option value="10">10s</option>
            </select>
          </label>

          <label className="admin-field">
            <span>Résolution</span>
            <select value={resolution} onChange={(e) => setResolution(e.target.value as Resolution)}>
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
            </select>
          </label>
        </div>

        <p className="admin-cost">
          Coût estimé : ~${estimateCostUsd(duration).toFixed(2)}
          {resolution === '1080p' && ' (indicatif, tarif 720p appliqué au calcul)'}
        </p>

        <button className="admin-submit" type="submit" disabled={submitting || jobStatus === 'pending'}>
          {submitting ? 'Envoi…' : 'Générer la vidéo'}
        </button>
      </form>

      {submitError && <p className="admin-error">Erreur : {submitError}</p>}

      {jobId && jobStatus === 'pending' && (
        <p className="admin-status">Job {jobId} en cours… (poll toutes les 5s)</p>
      )}
      {jobStatus === 'stuck' && (
        <p className="admin-error">Job bloqué depuis plus de 5 minutes — le webhook fal.ai n'est probablement jamais arrivé.</p>
      )}
      {jobStatus === 'failed' && <p className="admin-error">La génération a échoué.</p>}

      {videoUrl && (
        <div className="admin-preview">
          <ExerciseVideo url={videoUrl} autoPlay />
        </div>
      )}
    </div>
  );
}
