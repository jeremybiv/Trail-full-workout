import { fmt } from '../lib/format';
import { WDAYS, MONTHS } from '../data/constants';
import type { WorkoutRecord } from '../hooks/useWorkoutHistory';

interface Props {
  records: WorkoutRecord[];
  streak: number;
  bestStreak: number;
  totalSessions: number;
  totalMinutes: number;
  onClose: () => void;
}

function fmtDate(date: string): string {
  const [, m, d] = date.split('-').map(Number);
  const day = new Date(date + 'T12:00:00').getDay();
  return `${WDAYS[day]} ${d} ${MONTHS[m - 1]}`;
}

export function HistoryModal({ records, streak, bestStreak, totalSessions, totalMinutes, onClose }: Props) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet history-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title">Mon historique</h2>

        <div className="history-modal-stats">
          <div className="hstat-box">
            <span className="hstat-val">🔥 {streak}</span>
            <span className="hstat-lbl">Streak actuel</span>
          </div>
          <div className="hstat-box">
            <span className="hstat-val">⭐ {bestStreak}</span>
            <span className="hstat-lbl">Meilleur streak</span>
          </div>
          <div className="hstat-box">
            <span className="hstat-val">{totalSessions}</span>
            <span className="hstat-lbl">Séances</span>
          </div>
          <div className="hstat-box">
            <span className="hstat-val">{totalMinutes}</span>
            <span className="hstat-lbl">Minutes</span>
          </div>
        </div>

        {records.length === 0 ? (
          <p className="history-empty">Aucune séance enregistrée.</p>
        ) : (
          <div className="history-modal-list">
            {records.map((r) => (
              <div key={r.ts} className="history-row">
                <span className="history-date">{fmtDate(r.date)}</span>
                <span className="history-tag">{r.focus === 'upper' ? '💪' : '🦵'} {r.rounds}×</span>
                <span className="history-dur">{fmt(r.elapsed)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
