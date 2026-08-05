import { useCallback, useEffect, useRef, useState } from 'react';
import type { Session, Difficulty } from '../../lib/session';
import type { Exercise } from '../../data/exercises';
import { ALL } from '../../data/exercises';
import { dateLabel } from '../../lib/format';
import { sg, ss } from '../../lib/storage';
import { ExerciseCard } from '../ExerciseCard';
import { ExerciseDetailModal } from '../ExerciseDetailModal';
import { InstallBanner } from '../InstallBanner';
import { InstallModal } from '../InstallModal';

const LOWER_SERIES_UNLOCK_KEY = 'lowerSeriesUnlocked';
const LONG_PRESS_MS = 2000;

interface Props {
  session: Session | null;
  routeName: string;
  ready: boolean;
  onRegen: () => void;
  onStart: () => void;
  focus: 'upper' | 'lower';
  duration: 'short' | 'long';
  onFocusChange: (f: 'upper' | 'lower') => void;
  onDurationChange: (d: 'short' | 'long') => void;
  showInstall: boolean;
  promptReady: boolean;
  isIOS: boolean;
  onInstall: () => void;
  onDismissInstall: () => void;
  streak: number;
  onOpenHistory: () => void;
  onOpenProfile: () => void;
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  onStartLowerSeries: () => void;
}

const DIFF_LABELS: Record<Difficulty, string> = {
  deb: '🟢 Débutant',
  int: '🔵 Intermédiaire',
  conf: '🔴 Confirmé',
};

export function HomeScreen({
  session, routeName, ready, onRegen, onStart,
  focus, duration, onFocusChange, onDurationChange,
  showInstall, promptReady, isIOS, onInstall, onDismissInstall,
  streak, onOpenHistory, onOpenProfile,
  difficulty, onDifficultyChange,
  onStartLowerSeries,
}: Props) {
  const exercises = session ? session.ids.map((id) => ALL[id]) : [];
  const [showModal, setShowModal] = useState(false);
  const modalShown = useRef(false);
  const [detailExercise, setDetailExercise] = useState<{ ex: Exercise; isLeg: boolean } | null>(null);
  const [lowerSeriesUnlocked, setLowerSeriesUnlocked] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    void sg<boolean>(LOWER_SERIES_UNLOCK_KEY).then((v) => {
      if (v) setLowerSeriesUnlocked(true);
    });
  }, []);

  const clearPressTimer = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  const handleTitlePressStart = useCallback(() => {
    clearPressTimer();
    pressTimer.current = setTimeout(() => {
      setLowerSeriesUnlocked(true);
      void ss(LOWER_SERIES_UNLOCK_KEY, true);
    }, LONG_PRESS_MS);
  }, [clearPressTimer]);

  const handleStartClick = useCallback(() => {
    if (showInstall && !modalShown.current) {
      modalShown.current = true;
      setShowModal(true);
    } else {
      onStart();
    }
  }, [showInstall, onStart]);

  const handleModalInstall = useCallback(() => {
    onInstall();
    setShowModal(false);
    // On Android the native prompt takes over; don't start simultaneously.
    // On iOS there's no native prompt so we proceed to the workout.
    if (isIOS) onStart();
  }, [onInstall, isIOS, onStart]);

  const handleModalContinue = useCallback(() => {
    setShowModal(false);
    onStart();
  }, [onStart]);

  return (
    <div className="home">
      <div className="hdr">
        <div className="hdr-top">
          <p className="eyebrow">{dateLabel()}</p>
          <div className="hdr-actions">
            {streak > 0 && <span className="streak-badge">🔥 {streak}</span>}
            <button className="history-btn" onClick={onOpenHistory} title="Mon historique">📋</button>
            <button className="profile-btn" onClick={onOpenProfile} title="Mon profil">👤</button>
          </div>
        </div>
        <div className="hdr-row">
          <h1
            className="route"
            onPointerDown={handleTitlePressStart}
            onPointerUp={clearPressTimer}
            onPointerLeave={clearPressTimer}
            onPointerCancel={clearPressTimer}
          >
            {routeName || 'Renfo du jour'}
          </h1>
          <button className="regen-btn" onClick={onRegen} title="Changer les exercices">🎲</button>
        </div>
      </div>

      <InstallBanner
        show={showInstall}
        promptReady={promptReady}
        isIOS={isIOS}
        onInstall={onInstall}
        onDismiss={onDismissInstall}
      />

      <div className="opt-row">
        <div className="opt-group">
          {(['upper', 'lower'] as const).map((f) => (
            <button
              key={f}
              className={`opt-pill${focus === f ? ' active' : ''}`}
              onClick={() => onFocusChange(f)}
            >
              {f === 'upper' ? '💪 Upper' : '🦵 Lower'}
            </button>
          ))}
        </div>
        <div className="opt-group">
          {(['short', 'long'] as const).map((d) => (
            <button
              key={d}
              className={`opt-pill${duration === d ? ' active' : ''}`}
              onClick={() => onDurationChange(d)}
            >
              {d === 'short' ? '15 min' : '30 min'}
            </button>
          ))}
        </div>
      </div>

      <div className="opt-row diff-row">
        {(['deb', 'int', 'conf'] as const).map((d) => (
          <button
            key={d}
            className={`opt-pill diff-pill${difficulty === d ? ' active' : ''}`}
            onClick={() => onDifficultyChange(d)}
          >
            {DIFF_LABELS[d]}
          </button>
        ))}
      </div>

      {lowerSeriesUnlocked && (
        <button className="lower-series-btn" onClick={onStartLowerSeries}>
          🦵 Série bas du corps (perso)
        </button>
      )}

      <div className="workout-meta">
        <span className="meta-pill">{duration === 'short' ? '~14 min' : '~29 min'}</span>
        <span className="meta-pill">{duration === 'short' ? '2 rounds' : '4 rounds'}</span>
        <span className="meta-pill">8 exercices</span>
      </div>

      <div className="ex-list">
        {exercises.map((ex) => {
          const isLeg = session ? session.legIds.includes(ex.id) : false;
          return (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              isLeg={isLeg}
              onClick={() => setDetailExercise({ ex, isLeg })}
            />
          );
        })}
      </div>

      <button className="start-btn" onClick={handleStartClick} disabled={!ready}>
        ▶ START
      </button>

      {showModal && (
        <InstallModal
          promptReady={promptReady}
          isIOS={isIOS}
          onInstall={handleModalInstall}
          onContinue={handleModalContinue}
          onClose={() => setShowModal(false)}
        />
      )}

      {detailExercise && (
        <ExerciseDetailModal
          exercise={detailExercise.ex}
          isLeg={detailExercise.isLeg}
          onClose={() => setDetailExercise(null)}
        />
      )}
    </div>
  );
}
