import { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import type { MotionType } from '../data/exercises';
import { getAnimation } from '../animations/data';
import { ErrorBoundary } from './ErrorBoundary';

interface Props {
  motionType: MotionType;
  variant: 'card' | 'player';
  paused?: boolean;
}

function LottieAnim({ motionType, variant, paused }: Props) {
  const lottieRef = useRef<LottieView | null>(null);
  const animData = getAnimation(motionType);
  const size = variant === 'card' ? 50 : 100;

  useEffect(() => {
    if (!lottieRef.current) return;
    if (paused) lottieRef.current.pause();
    else lottieRef.current.play();
  }, [paused]);

  return (
    <LottieView
      ref={lottieRef}
      // getAnimation() is typed as `object` (see ../animations/data.ts, ported
      // verbatim from the web app) — it's really valid Lottie JSON at runtime.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      source={animData as any}
      loop
      autoPlay={!paused}
      style={{ width: size, height: size, flexShrink: 0 }}
      resizeMode="contain"
    />
  );
}

export function ExerciseSvg(props: Props) {
  return (
    <ErrorBoundary fallback={<></>}>
      <LottieAnim {...props} />
    </ErrorBoundary>
  );
}
