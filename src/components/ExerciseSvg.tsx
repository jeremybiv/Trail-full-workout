import type { MotionType } from '../data/exercises';

const FIG = (
  <g className="fig">
    <g className="upper">
      <circle className="fl" cx="50" cy="18" r="3" strokeWidth="7" />
      <line className="fl" x1="50" y1="25" x2="50" y2="55" />
      <g className="arms">
        <line className="fl" x1="50" y1="32" x2="32" y2="48" />
        <line className="fl" x1="50" y1="32" x2="68" y2="48" />
      </g>
    </g>
    <g className="legs">
      <line className="fl" x1="50" y1="55" x2="36" y2="82" />
      <line className="fl" x1="50" y1="55" x2="64" y2="82" />
    </g>
    <ellipse className="heel" cx="50" cy="86" rx="9" ry="2.6" />
  </g>
);

interface Props {
  motionType: MotionType;
  variant: 'card' | 'player';
  paused?: boolean;
}

export function ExerciseSvg({ motionType, variant, paused }: Props) {
  const cls =
    variant === 'card'
      ? `anim ${motionType}`
      : [`psvg`, motionType, paused ? 'paused' : ''].filter(Boolean).join(' ');

  return (
    <svg className={cls} viewBox="0 0 100 100" overflow="visible">
      {FIG}
    </svg>
  );
}
