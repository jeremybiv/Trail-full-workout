import { useEffect, useMemo, useRef, useState } from 'react';
import { NAME_EN } from '../../data/exerciseNamesEn';
import { ALL } from '../../data/exercises';
import { useTimer } from '../../hooks/useTimer';
import { useWakeLock } from '../../hooks/useWakeLock';
import type { Session } from '../../lib/session';
import { buildTimeline, nextWorkName, nextWorkStep } from '../../lib/session';
import { PlayerMedia } from '../PlayerMedia';
import { ExerciseVideo } from '../ExerciseVideo';

interface Props {
  session: Session;
  onQuit: () => void;
  onDone: (elapsed: number) => void;
}

const RING_R = 70;
const RING_CIRC = 2 * Math.PI * RING_R;

export function PlayerScreen({ session, onQuit, onDone }: Props) {
  const [muted, setMuted] = useState(false);
  const [confirmQuit, setConfirmQuit] = useState(false);
  const wasPlayingRef = useRef(false);
  const timeline = useMemo(() => buildTimeline(session.ids, session.duration), [session.ids, session.duration]);
  const totalRounds = session.duration === 'long' ? 4 : 2;
  const requestWakeLock = useWakeLock(true);

  const { step, stepIndex, rem, elapsed, totalDur, paused, done, toggle, jumpTo, start, stop } =
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
  const nextStep = step ? nextWorkStep(timeline, stepIndex) : null;

  // For unilateral exercises: show GAUCHE for first half of step, DROITE for second half
  const sideLabel = (exercise?.unilateral && step?.type === 'work' && step.dur > 0)
    ? (rem > step.dur / 2 ? '◀ GAUCHE' : 'DROITE ▶')
    : null;

  const exDoneCount = useMemo(() => {
    let count = 0;
    for (let i = 0; i < stepIndex; i++) {
      if (timeline[i]?.type === 'work') count++;
    }
    return count;
  }, [timeline, stepIndex]);

  // Exercise-level navigation: find nearest work step in each direction
  const prevExIdx = useMemo(() => {
    for (let i = stepIndex - 1; i >= 0; i--) {
      if (timeline[i]?.type === 'work') return i;
    }
    return 0;
  }, [timeline, stepIndex]);

  const nextExIdx = useMemo(() => {
    for (let i = stepIndex + 1; i < timeline.length; i++) {
      if (timeline[i]?.type === 'work') return i;
    }
    return stepIndex;
  }, [timeline, stepIndex]);

  function handleQuitPress() {
    wasPlayingRef.current = !paused;
    if (!paused) toggle();
    setConfirmQuit(true);
  }

  function handleContinue() {
    setConfirmQuit(false);
    if (wasPlayingRef.current) toggle();
  }

  let phaseClass = 'phase-lbl';
  let timerClass = 'timer';
  let phaseText = '';
  let phaseCls = 'phase-gap';

  if (step?.type === 'work') {
    phaseClass += ' work'; timerClass += ' work'; phaseText = '🔥 TRAVAIL'; phaseCls = 'phase-work';
  } else if (step?.type === 'rest') {
    phaseClass += ' rest'; timerClass += ' rest'; phaseText = '💨 Repos'; phaseCls = 'phase-rest';
  } else if (step?.type === 'prep') {
    phaseClass += ' prep'; timerClass += ' prep'; phaseText = '⏱ PRÊT'; phaseCls = 'phase-gap';
  } else {
    phaseClass += ' prep'; timerClass += ' prep'; phaseText = '⏸ PAUSE'; phaseCls = 'phase-gap';
  }

  const roundLabel = step?.type === 'gap'
    ? 'Entre les rounds'
    : step?.type === 'prep'
    ? 'Préparation'
    : `Round ${step?.round ?? 1} / ${totalRounds}`;

  const ringOffset = step ? RING_CIRC * (1 - rem / step.dur) : 0;

  const ring = (
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
  );

  const mediaBlock = (
    <>
      {step?.type === 'work' && exercise?.video ? (
        <div className="player-video-hero">
          <ExerciseVideo url={exercise.video} autoPlay />
        </div>
      ) : (
        <PlayerMedia step={step} nextStep={nextStep} paused={paused} />
      )}

      {step?.type === 'rest' && nextStep?.id && (
        <p className="next-eyebrow">Prochain exercice</p>
      )}

      <h2 className="ex-title">
        {step?.type === 'gap'
          ? `Round ${step?.round ?? 2} dans…`
          : step?.type === 'prep'
          ? 'Prépare-toi !'
          : step?.type === 'rest' && nextStep?.id
          ? (NAME_EN[nextStep.id] ?? '–')
          : (exercise ? NAME_EN[exercise.id] : '–')}
      </h2>
      {step?.type !== 'rest' && (
        <p className="ex-desc">
          {step?.type === 'gap'
            ? 'Souffle, hydrate-toi.'
            : step?.type === 'prep'
            ? 'Installe-toi, ça commence…'
            : (exercise?.desc ?? '')}
        </p>
      )}
    </>
  );

  return (
    <div className={`player open ${phaseCls}`}>
      <div className="player-top">
        <button className="quit-btn" onClick={handleQuitPress}>✕</button>
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
      {sideLabel && <p className="side-lbl">{sideLabel}</p>}

      {step?.type === 'rest' ? (
        <>
          {ring}
          {mediaBlock}
        </>
      ) : (
        <>
          {mediaBlock}
          {ring}
        </>
      )}

      {step?.type !== 'rest' && (
        <p className="next-lbl">
          {nextName ? (
            <>Ensuite : <b>{nextName}</b></>
          ) : step?.type === 'work' ? (
            'Dernier exercice 💪'
          ) : null}
        </p>
      )}

      <div className="controls">
        <button className="ctrl" onClick={() => jumpTo(prevExIdx)}>⏮</button>
        <button className="ctrl big" onClick={() => { toggle(); requestWakeLock(); }}>
          {paused ? '▶' : '⏸'}
        </button>
        <button className="ctrl" onClick={() => jumpTo(nextExIdx)}>⏭</button>
      </div>

      {confirmQuit && (
        <div className="quit-overlay">
          <div className="quit-card">
            <p>Quitter l'entraînement ?</p>
            <button className="start-btn danger" onClick={onQuit}>Oui, quitter</button>
            <button className="ctrl-lnk" onClick={handleContinue}>Continuer</button>
          </div>
        </div>
      )}
    </div>
  );
}
