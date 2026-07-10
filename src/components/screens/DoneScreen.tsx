import { fmt } from '../../lib/format';
import { WDAYS, MONTHS } from '../../data/constants';
import type { Session } from '../../lib/session';
import type { WorkoutRecord } from '../../hooks/useWorkoutHistory';

interface Props {
  totalDur: number;
  session: Session | null;
  records: WorkoutRecord[];
  streak: number;
  bestStreak: number;
  totalSessions: number;
  onBack: () => void;
}

function fmtDate(date: string): string {
  const [, m, d] = date.split('-').map(Number);
  const day = new Date(date + 'T12:00:00').getDay();
  return `${WDAYS[day]} ${d} ${MONTHS[m - 1]}`;
}

function streakMessage(streak: number, totalSessions: number): { emoji: string; title: string; sub: string } {
  if (totalSessions === 1) return { emoji: '🎉', title: 'Première séance !', sub: 'Le plus dur, c\'est de commencer.' };
  if (streak >= 30) return { emoji: '🏆', title: 'Légende du trail !', sub: `${streak} jours sans faillir.` };
  if (streak >= 14) return { emoji: '🔥', title: 'En feu !', sub: `${streak} jours d'affilée. Incroyable.` };
  if (streak >= 7) return { emoji: '💪', title: 'Une semaine pleine !', sub: `${streak} jours consécutifs.` };
  if (streak >= 3) return { emoji: '⚡', title: 'Belle série !', sub: `${streak} jours de suite.` };
  return { emoji: '🏔️', title: 'Sommet atteint !', sub: 'Continue comme ça.' };
}

export function DoneScreen({ totalDur, session, records, streak, bestStreak, totalSessions, onBack }: Props) {
  const seriesCount = (session?.duration === 'long' ? 4 : 2) * 8;
  const { emoji, title, sub } = streakMessage(streak, totalSessions);

  return (
    <div className="done open">
      <div className="done-hero">
        <div className="done-emoji">{emoji}</div>
        <h1 className="done-title">{title}</h1>
        <p className="done-sub">{sub}</p>
      </div>

      <div className="done-stats">
        <div className="stat-box">
          <span className="stat-val">{fmt(totalDur)}</span>
          <span className="stat-lbl">Durée</span>
        </div>
        <div className="stat-box">
          <span className="stat-val">{seriesCount}</span>
          <span className="stat-lbl">Séries</span>
        </div>
        <div className="stat-box accent">
          <span className="stat-val">🔥 {streak}</span>
          <span className="stat-lbl">Streak</span>
        </div>
        <div className="stat-box">
          <span className="stat-val">{totalSessions}</span>
          <span className="stat-lbl">Total séances</span>
        </div>
      </div>

      {bestStreak > streak && (
        <p className="done-best-streak">Meilleur streak : {bestStreak} jours</p>
      )}

      {records.length > 1 && (
        <div className="history-list">
          <p className="history-title">Historique</p>
          {records.slice(1).map((r) => (
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
