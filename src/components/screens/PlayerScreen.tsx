import { useEffect, useMemo, useState } from 'react';
import { NAME_EN } from '../../data/exerciseNamesEn';
import { ALL } from '../../data/exercises';
import { useTimer } from '../../hooks/useTimer';
import type { Session } from '../../lib/session';
import { buildTimeline, nextWorkName } from '../../lib/session';
import { PlayerMedia } from '../PlayerMedia';

interface Props {
  session: Session;
  onQuit: () => void;
  onDone: (elapsed: number) => void;
}

const RING_R = 70;
const RING_CIRC = 2 * Math.PI * RING_R;

export function PlayerScreen({ session, onQuit, onDone }: Props) {
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

  const exDoneCount = useMemo(() => {
    let count = 0;
    for (let i = 0; i < stepIndex; i++) {
      if (timeline[i]?.type === 'work') count++;
    }
    return count;
  }, [timeline, stepIndex]);

  let phaseClass = 'phase-lbl';
  let timerClass = 'timer';
  let phaseText = '';
  let phaseCls = 'phase-gap';

  if (step?.type === 'work') {
    phaseClass += ' work'; timerClass += ' work'; phaseText = 'TRAVAIL'; phaseCls = 'phase-work';
  } else if (step?.type === 'rest') {
    phaseClass += ' rest'; timerClass += ' rest'; phaseText = 'Repos'; phaseCls = 'phase-rest';
  } else if (step?.type === 'prep') {
    phaseClass += ' prep'; timerClass += ' prep'; phaseText = 'PRÊT'; phaseCls = 'phase-gap';
  } else {
    phaseClass += ' prep'; timerClass += ' prep'; phaseText = 'PAUSE'; phaseCls = 'phase-gap';
  }

  const roundLabel = step?.type === 'gap'
    ? 'Entre les rounds'
    : step?.type === 'prep'
    ? 'Préparation'
    : `Round ${step?.round ?? 1} / 2`;

  const ringOffset = step ? RING_CIRC * (1 - rem / step.dur) : 0;

  return (
    <div className={`player open ${phaseCls}`}>
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

      <div className="prog-dots">
        {session.ids.map((_, i) => {
          const cls = i < exDoneCount
            ? 'done'
            : i === exDoneCount
            ? `active ${step?.type ?? 'prep'}`
            : '';
          return <span key={i} className={`pdot${cls ? ' ' + cls : ''}`} />;
        })}
      </div>

      <p className={phaseClass}>{phaseText}</p>

      <PlayerMedia step={step} paused={paused} />

      <h2 className="ex-title">
        {step?.type === 'gap'
          ? 'Round 2 dans…'
          : step?.type === 'prep'
          ? 'Prépare-toi !'
          : (exercise ? NAME_EN[exercise.id] : '–')}
      </h2>
      <p className="ex-desc">
        {step?.type === 'gap'
          ? 'Souffle, hydrate-toi.'
          : step?.type === 'prep'
          ? 'Installe-toi, ça commence…'
          : step?.type === 'rest'
          ? 'Respire, secoue les bras.'
          : (exercise?.desc ?? '')}
      </p>

      <div className="timer-ring-wrap">
        <svg className="timer-ring" viewBox="0 0 160 160" width="160" height="160">
          <circle className="ring-bg" cx="80" cy="80" r={RING_R} />
          <circle
            className={`ring-fill ${step?.type ?? 'prep'}`}
            cx="80"
            cy="80"
            r={RING_R}
            strokeDasharray={RING_CIRC}
            strokeDashoffset={ringOffset}
          />
        </svg>
        <div className={`${timerClass}${paused ? ' paused' : ''}`}>{rem}</div>
      </div>

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
