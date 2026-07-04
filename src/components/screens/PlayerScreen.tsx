import { useEffect, useMemo, useState } from 'react';
import { buildTimeline, nextWorkName } from '../../lib/session';
import type { Session } from '../../lib/session';
import { ALL } from '../../data/exercises';
import { useTimer } from '../../hooks/useTimer';
import { PlayerMedia } from '../PlayerMedia';

interface Props {
  session: Session;
  gifVersion: number;
  onQuit: () => void;
  onDone: (elapsed: number) => void;
}

export function PlayerScreen({ session, gifVersion, onQuit, onDone }: Props) {
  const [muted, setMuted] = useState(false);
  const timeline = useMemo(() => buildTimeline(session.ids), [session.ids]);

  const { step, stepIndex, rem, elapsed, totalDur, paused, done, toggle, skip, start, stop } =
    useTimer(timeline, muted, onDone);

  useEffect(() => {
    start();
    return () => stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (done) onDone(elapsed);
  }, [done, elapsed, onDone]);

  const exercise = step?.id ? ALL[step.id] : null;
  const progressPct = totalDur > 0 ? Math.round((elapsed / totalDur) * 100) : 0;
  const nextName = step ? nextWorkName(timeline, stepIndex) : null;

  let phaseClass = 'phase-lbl';
  let timerClass = 'timer';
  let phaseText = '';

  if (step?.type === 'work') {
    phaseClass += ' work'; timerClass += ' work'; phaseText = 'TRAVAIL';
  } else if (step?.type === 'rest') {
    phaseClass += ' rest'; timerClass += ' rest'; phaseText = 'RÉCUP';
  } else {
    phaseClass += ' prep'; timerClass += ' prep'; phaseText = 'PAUSE';
  }

  const roundLabel = step?.type === 'gap'
    ? 'Entre les rounds'
    : `Round ${step?.round ?? 1} / 2`;

  return (
    <div className="player open">
      <div className="player-top">
        <button className="quit-btn" onClick={onQuit}>✕</button>
        <span className="round-pill">{roundLabel}</span>
        <button
          className="mute-btn"
          onClick={() => setMuted((m) => !m)}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </div>

      <div className="prog-bar">
        <div className="prog-fill" style={{ width: `${progressPct}%` }} />
      </div>

      <p className={phaseClass}>{phaseText}</p>

      <PlayerMedia step={step} gifVersion={gifVersion} paused={paused} />

      <h2 className="ex-title">
        {step?.type === 'gap' ? 'Round 2 dans…' : (exercise?.name ?? '–')}
      </h2>
      <p className="ex-desc">
        {step?.type === 'gap'
          ? 'Souffle, hydrate-toi.'
          : step?.type === 'rest'
          ? 'Respire, secoue les bras.'
          : (exercise?.desc ?? '')}
      </p>

      <div className={timerClass}>{rem}</div>

      <p className="next-lbl">
        {nextName ? (
          <>Ensuite : <b>{nextName}</b></>
        ) : step?.type === 'work' ? (
          'Dernier exercice 💪'
        ) : null}
      </p>

      <div className="controls">
        <button className="ctrl" onClick={() => skip(-1)}>⏮</button>
        <button className="ctrl big" onClick={toggle}>
          {paused ? '▶' : '⏸'}
        </button>
        <button className="ctrl" onClick={() => skip(1)}>⏭</button>
      </div>
    </div>
  );
}
