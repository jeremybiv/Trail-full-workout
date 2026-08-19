import { useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NAME_EN } from '../../data/exerciseNamesEn';
import { ALL } from '../../data/exercises';
import { useTimer } from '../../hooks/useTimer';
import { useWakeLock } from '../../hooks/useWakeLock';
import type { Session, StepKind } from '../../lib/session';
import { buildTimeline, nextWorkName, nextWorkStep } from '../../lib/session';
import { PlayerMedia } from '../PlayerMedia';
import { ExerciseVideo } from '../ExerciseVideo';
import { TimerRing, RING_CIRC } from '../TimerRing';
import { COLORS, FONTS, RADIUS } from '../../theme/tokens';

interface Props {
  session: Session;
  onQuit: () => void;
  onDone: (elapsed: number) => void;
}

const PHASE_BG: Record<StepKind, string> = {
  work: COLORS.blaze,
  rest: COLORS.rest,
  prep: COLORS.gold,
  gap: COLORS.gold,
};
const PHASE_FG: Record<StepKind, string> = {
  work: COLORS.onBlaze,
  rest: COLORS.onRest,
  prep: COLORS.onBlaze,
  gap: COLORS.onBlaze,
};
const PHASE_TEXT: Record<StepKind, string> = {
  work: '🔥 TRAVAIL',
  rest: '💨 Repos',
  prep: '⏱ PRÊT',
  gap: '⏸ PAUSE',
};

export function PlayerScreen({ session, onQuit, onDone }: Props) {
  const [muted, setMuted] = useState(false);
  const [confirmQuit, setConfirmQuit] = useState(false);
  const wasPlayingRef = useRef(false);
  const timeline = useMemo(() => buildTimeline(session.ids, session.duration), [session.ids, session.duration]);
  const totalRounds = session.duration === 'long' ? 4 : 2;
  useWakeLock();

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

  const handleQuitPress = () => {
    wasPlayingRef.current = !paused;
    if (!paused) toggle();
    setConfirmQuit(true);
  };

  const handleContinue = () => {
    setConfirmQuit(false);
    if (wasPlayingRef.current) toggle();
  };

  // Android hardware back acts as the quit button instead of exiting the app.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (confirmQuit) {
        handleContinue();
      } else {
        handleQuitPress();
      }
      return true;
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmQuit, paused]);

  const exercise = step?.id ? ALL[step.id] : null;
  const progressPct = totalDur > 0 ? Math.round((elapsed / totalDur) * 100) : 0;
  const nextName = step ? nextWorkName(timeline, stepIndex) : null;
  const nextStep = step ? nextWorkStep(timeline, stepIndex) : null;

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

  const phase = step?.type ?? 'prep';
  const roundLabel = step?.type === 'gap'
    ? 'Entre les rounds'
    : step?.type === 'prep'
    ? 'Préparation'
    : `Round ${step?.round ?? 1} / ${totalRounds}`;

  const ringOffset = step ? RING_CIRC * (1 - rem / step.dur) : 0;

  const ring = <TimerRing rem={rem} offset={ringOffset} phase={phase} paused={paused} />;

  const mediaBlock = (
    <>
      {step?.type === 'work' && exercise?.video ? (
        <View style={styles.videoHero}>
          <ExerciseVideo url={exercise.video} autoPlay />
        </View>
      ) : (
        <PlayerMedia step={step} nextStep={nextStep} paused={paused} />
      )}

      {step?.type === 'rest' && nextStep?.id && (
        <Text style={styles.nextEyebrow}>Prochain exercice</Text>
      )}

      <Text style={styles.exTitle}>
        {step?.type === 'gap'
          ? `Round ${step?.round ?? 2} dans…`
          : step?.type === 'prep'
          ? 'Prépare-toi !'
          : step?.type === 'rest' && nextStep?.id
          ? (NAME_EN[nextStep.id] ?? '–')
          : (exercise ? NAME_EN[exercise.id] : '–')}
      </Text>
      {step?.type !== 'rest' && (
        <Text style={styles.exDesc}>
          {step?.type === 'gap'
            ? 'Souffle, hydrate-toi.'
            : step?.type === 'prep'
            ? 'Installe-toi, ça commence…'
            : (exercise?.desc ?? '')}
        </Text>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.player} edges={['top', 'bottom']}>
      <View style={styles.top}>
        <Pressable style={styles.iconBtn} onPress={handleQuitPress} hitSlop={8}>
          <Text style={styles.iconBtnText}>✕</Text>
        </Pressable>
        <View style={styles.roundPill}><Text style={styles.roundPillText}>{roundLabel}</Text></View>
        <Pressable style={styles.iconBtn} onPress={() => setMuted((m) => !m)} hitSlop={8}>
          <Text style={styles.iconBtnText}>{muted ? '🔇' : '🔊'}</Text>
        </Pressable>
      </View>

      <View style={styles.progBar}>
        <View style={[styles.progFill, { width: `${progressPct}%` }]} />
      </View>

      <View style={styles.progDots}>
        {session.ids.map((_, i) => {
          const isDone = i < exDoneCount;
          const isActive = i === exDoneCount;
          return (
            <View
              key={i}
              style={[
                styles.pdot,
                isDone && styles.pdotDone,
                isActive && { backgroundColor: PHASE_BG[phase] },
              ]}
            />
          );
        })}
      </View>

      <View style={[styles.phaseLbl, { backgroundColor: PHASE_BG[phase] }]}>
        <Text style={[styles.phaseLblText, { color: PHASE_FG[phase] }]}>{PHASE_TEXT[phase]}</Text>
      </View>
      {sideLabel && (
        <View style={styles.sideLbl}><Text style={styles.sideLblText}>{sideLabel}</Text></View>
      )}

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
        <Text style={styles.nextLbl}>
          {nextName ? (
            <>Ensuite : <Text style={styles.nextLblBold}>{nextName}</Text></>
          ) : step?.type === 'work' ? (
            'Dernier exercice 💪'
          ) : null}
        </Text>
      )}

      <View style={styles.controls}>
        <Pressable style={styles.ctrl} onPress={() => jumpTo(prevExIdx)}>
          <Text style={styles.ctrlText}>⏮</Text>
        </Pressable>
        <Pressable style={styles.ctrlBig} onPress={toggle}>
          <Text style={styles.ctrlBigText}>{paused ? '▶' : '⏸'}</Text>
        </Pressable>
        <Pressable style={styles.ctrl} onPress={() => jumpTo(nextExIdx)}>
          <Text style={styles.ctrlText}>⏭</Text>
        </Pressable>
      </View>

      <Modal visible={confirmQuit} transparent animationType="fade" onRequestClose={handleContinue}>
        <View style={styles.quitOverlay}>
          <View style={styles.quitCard}>
            <Text style={styles.quitCardText}>Quitter l'entraînement ?</Text>
            <Pressable style={styles.dangerBtn} onPress={onQuit}>
              <Text style={styles.dangerBtnText}>Oui, quitter</Text>
            </Pressable>
            <Pressable onPress={handleContinue} style={styles.ctrlLnk}>
              <Text style={styles.ctrlLnkText}>Continuer</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  player: {
    flex: 1,
    backgroundColor: COLORS.playerBg,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  top: {
    width: '100%',
    maxWidth: 420,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  videoHero: {
    width: '100%',
    maxWidth: 420,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: 10,
  },
  iconBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnText: {
    fontSize: 15,
    color: COLORS.dim,
  },
  roundPill: {
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surf,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  roundPillText: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.dim,
  },
  progBar: {
    width: '100%',
    maxWidth: 420,
    height: 3,
    backgroundColor: COLORS.line,
    borderRadius: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 2,
  },
  progDots: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 12,
  },
  pdot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.line,
  },
  pdotDone: {
    backgroundColor: COLORS.dim,
  },
  phaseLbl: {
    borderRadius: RADIUS.pill,
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginBottom: 10,
  },
  phaseLblText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  sideLbl: {
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginBottom: 8,
  },
  sideLblText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: COLORS.gold,
  },
  nextEyebrow: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '700',
    color: COLORS.rest,
    marginBottom: 4,
  },
  exTitle: {
    fontFamily: FONTS.display,
    fontSize: 36,
    letterSpacing: 0.6,
    textAlign: 'center',
    color: COLORS.ink,
    marginBottom: 6,
  },
  exDesc: {
    fontSize: 14,
    color: COLORS.dim,
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: 8,
    lineHeight: 20,
    minHeight: 40,
  },
  nextLbl: {
    fontSize: 12,
    color: COLORS.dim,
    textAlign: 'center',
    minHeight: 18,
  },
  nextLblBold: {
    color: COLORS.ink,
    fontWeight: '700',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 'auto',
    paddingTop: 16,
    paddingBottom: 8,
  },
  ctrl: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.surf,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctrlText: {
    fontSize: 18,
    color: COLORS.ink,
  },
  ctrlBig: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.blaze,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctrlBigText: {
    fontSize: 20,
    color: COLORS.onBlaze,
  },
  quitOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quitCard: {
    backgroundColor: COLORS.surf,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: RADIUS.xl,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 14,
    width: 280,
  },
  quitCardText: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.ink,
    textAlign: 'center',
  },
  dangerBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
  },
  dangerBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  ctrlLnk: {
    padding: 4,
  },
  ctrlLnkText: {
    color: COLORS.dim,
    fontSize: 14,
  },
});
