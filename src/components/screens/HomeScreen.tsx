import type { Session } from '../../lib/session';
import { ALL } from '../../data/exercises';
import { dateLabel } from '../../lib/format';
import { ExerciseCard } from '../ExerciseCard';
import { InstallBanner } from '../InstallBanner';

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
  canInstall: boolean;
  isIOSInstallable: boolean;
  onInstall: () => void;
  needRefresh: boolean;
  onUpdate: () => void;
}

export function HomeScreen({
  session, routeName, ready, onRegen, onStart,
  focus, duration, onFocusChange, onDurationChange,
  canInstall, isIOSInstallable, onInstall,
  needRefresh, onUpdate,
}: Props) {
  const exercises = session ? session.ids.map((id) => ALL[id]) : [];

  return (
    <div className="home">
      <div className="hdr">
        <p className="eyebrow">{dateLabel()}</p>
        <div className="hdr-row">
          <h1 className="route">{routeName || 'Renfo du jour'}</h1>
          <button className="regen-btn" onClick={onRegen} title="Changer les exercices">🎲</button>
        </div>
      </div>

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

      <div className="workout-meta">
        <span className="meta-pill">{duration === 'short' ? '~14 min' : '~29 min'}</span>
        <span className="meta-pill">{duration === 'short' ? '2 rounds' : '4 rounds'}</span>
        <span className="meta-pill">8 exercices</span>
      </div>

      <div className="ex-list">
        {exercises.map((ex) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            isLeg={session ? session.legIds.includes(ex.id) : false}
          />
        ))}
      </div>

      <button className="start-btn" onClick={onStart} disabled={!ready}>
        ▶ START
      </button>

      <InstallBanner canInstall={canInstall} isIOS={isIOSInstallable} onInstall={onInstall} />

      {needRefresh && (
        <div className="update-banner">
          Nouvelle version disponible
          <button className="update-btn" onClick={onUpdate}>Mettre à jour</button>
        </div>
      )}
    </div>
  );
}
