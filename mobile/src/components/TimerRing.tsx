import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { StepKind } from '../lib/session';
import { COLORS, FONTS } from '../theme/tokens';

const RING_R = 70;
export const RING_CIRC = 2 * Math.PI * RING_R;

const RING_COLOR: Record<StepKind, string> = {
  work: COLORS.blaze,
  rest: COLORS.rest,
  prep: COLORS.gold,
  gap: COLORS.gold,
};

interface Props {
  rem: number;
  offset: number;
  phase: StepKind;
  paused: boolean;
}

export function TimerRing({ rem, offset, phase, paused }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.ringRotated}>
        <Svg width={160} height={160} viewBox="0 0 160 160">
          <Circle cx={80} cy={80} r={RING_R} stroke={COLORS.line} strokeWidth={4} fill="none" />
          <Circle
            cx={80}
            cy={80}
            r={RING_R}
            stroke={RING_COLOR[phase]}
            strokeWidth={4}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={RING_CIRC}
            strokeDashoffset={offset}
          />
        </Svg>
      </View>
      <Text style={[styles.timer, { color: RING_COLOR[phase] }, paused && styles.timerPaused]}>{rem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  ringRotated: {
    position: 'absolute',
    top: 0,
    left: 0,
    transform: [{ rotate: '-90deg' }],
  },
  timer: {
    fontFamily: FONTS.monoBold,
    fontSize: 56,
    fontVariant: ['tabular-nums'],
  },
  timerPaused: {
    opacity: 0.55,
  },
});
