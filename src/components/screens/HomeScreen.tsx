import type { Session } from '../../lib/session';
import { ALL } from '../../data/exercises';
import { dateLabel } from '../../lib/format';
import { ExerciseCard } from '../ExerciseCard';

interface Props {
  session: Session | null;
  routeName: string;
  gifVersion: number;
  ready: boolean;
  onRegen: () => void;
  onStart: () => void;
}

export function HomeScreen({ session, routeName, gifVersion, ready, onRegen, onStart }: Props) {
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

      <div className="workout-meta">
        <span className="meta-pill">~14 min</span>
        <span className="meta-pill">2 rounds</span>
        <span className="meta-pill">8 exercices</span>
      </div>

      <div className="ex-list">
        {exercises.map((ex) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            isLeg={session ? session.legIds.includes(ex.id) : false}
            gifVersion={gifVersion}
          />
        ))}
      </div>

      <button className="start-btn" onClick={onStart} disabled={!ready}>
        ▶ START
      </button>
    </div>
  );
}
