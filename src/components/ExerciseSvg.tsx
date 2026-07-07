import { useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import type { LottieRefCurrentProps } from 'lottie-react';
import type { MotionType } from '../data/exercises';
import { getAnimation } from '../animations/data';
import { ErrorBoundary } from './ErrorBoundary';

interface Props {
  motionType: MotionType;
  variant: 'card' | 'player';
  paused?: boolean;
}

function LottieAnim({ motionType, variant, paused }: Props) {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const animData = getAnimation(motionType);
  const size = variant === 'card' ? 50 : 100;

  useEffect(() => {
    if (!lottieRef.current) return;
    if (paused) lottieRef.current.pause();
    else lottieRef.current.play();
  }, [paused]);

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animData}
      loop
      autoplay={!paused}
      style={{ width: size, height: size, flexShrink: 0 }}
      rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
    />
  );
}

export function ExerciseSvg(props: Props) {
  return (
    <ErrorBoundary fallback={<span style={{ width: props.variant === 'card' ? 50 : 100, height: props.variant === 'card' ? 50 : 100, display: 'block' }} />}>
      <LottieAnim {...props} />
    </ErrorBoundary>
  );
}
