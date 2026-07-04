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
        <h1 className="route">{routeName || 'Renfo du jour'}</h1>
      </div>

      <div className="section-row">
        <p className="section-title">8 exercices du jour</p>
        <button className="regen-btn" onClick={onRegen}>🎲 Changer</button>
      </div>

      <div className="ex-list">
        {exercises.map((ex, i) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            index={i}
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
