import { fmt } from '../../lib/format';

interface Props {
  totalDur: number;
  onBack: () => void;
}

export function DoneScreen({ totalDur, onBack }: Props) {
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
          <span className="stat-val">16</span>
          <span className="stat-lbl">Séries</span>
        </div>
      </div>
      <button className="start-btn" onClick={onBack}>
        Retour à l'accueil
      </button>
    </div>
  );
}
