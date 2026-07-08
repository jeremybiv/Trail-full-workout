import { fmt } from '../../lib/format';
import { WDAYS, MONTHS } from '../../data/constants';
import type { Session } from '../../lib/session';
import type { WorkoutRecord } from '../../hooks/useWorkoutHistory';

interface Props {
  totalDur: number;
  session: Session | null;
  records: WorkoutRecord[];
  onBack: () => void;
}

function fmtDate(date: string): string {
  const [, m, d] = date.split('-').map(Number);
  const day = new Date(date).getDay();
  return `${WDAYS[day]} ${d} ${MONTHS[m - 1]}`;
}

export function DoneScreen({ totalDur, session, records, onBack }: Props) {
  const seriesCount = (session?.duration === 'long' ? 4 : 2) * 8;

  return (
    <div className="done open">
      <div style={{ fontSize: 56 }}>🏔️</div>
      <h1>Sommet atteint !</h1>
      <div className="done-stats">
        <div className="stat-box">
          <span className="stat-val">{fmt(totalDur)}</span>
          <span className="stat-lbl">Durée</span>
        </div>
        <div className="stat-box">
          <span className="stat-val">{seriesCount}</span>
          <span className="stat-lbl">Séries</span>
        </div>
      </div>

      {records.length > 1 && (
        <div className="history-list">
          <p className="history-title">Dernières séances</p>
          {records.slice(1, 6).map((r) => (
            <div key={r.ts} className="history-row">
              <span className="history-date">{fmtDate(r.date)}</span>
              <span className="history-tag">{r.focus === 'upper' ? '💪' : '🦵'} {r.rounds} rounds</span>
              <span className="history-dur">{fmt(r.elapsed)}</span>
            </div>
          ))}
        </div>
      )}

      <button className="start-btn" onClick={onBack}>
        Retour à l'accueil
      </button>
    </div>
  );
}
