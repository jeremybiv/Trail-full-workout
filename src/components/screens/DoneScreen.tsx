import { fmt } from '../../lib/format';

interface Props {
  totalDur: number;
  onBack: () => void;
}

export function DoneScreen({ totalDur, onBack }: Props) {
  return (
    <div className="done open">
      <div style={{ fontSize: 48 }}>🏔️</div>
      <h1>Sommet atteint !</h1>
      <p>Séance terminée — {fmt(totalDur)} de travail. Bien joué ! 🔥</p>
      <button className="start-btn" onClick={onBack}>
        Retour à l'accueil
      </button>
    </div>
  );
}
