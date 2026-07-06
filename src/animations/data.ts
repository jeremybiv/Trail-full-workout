import type { MotionType } from '../data/exercises';
import { buildAnim, animCircle, animLine, staticCircle, staticLine } from './builder';

// ── PRESS (push / dip) — body shifts down 8px, arms flare outward ─────────────
// 60 frames at 30fps = 2 s loop
const press = buildAnim('press', 61, [
  animCircle(1, 'head', [
    { t: 0,  pos: [50, 18] },
    { t: 30, pos: [50, 26] },
    { t: 60, pos: [50, 18] },
  ], 7),
  animLine(2, 'torso', [
    { t: 0,  a: [50, 25], b: [50, 55] },
    { t: 30, a: [50, 33], b: [50, 63] },
    { t: 60, a: [50, 25], b: [50, 55] },
  ]),
  animLine(3, 'armL', [
    { t: 0,  a: [50, 32], b: [32, 48] },
    { t: 30, a: [50, 40], b: [29, 53] }, // flare + shift down
    { t: 60, a: [50, 32], b: [32, 48] },
  ]),
  animLine(4, 'armR', [
    { t: 0,  a: [50, 32], b: [68, 48] },
    { t: 30, a: [50, 40], b: [71, 53] },
    { t: 60, a: [50, 32], b: [68, 48] },
  ]),
  animLine(5, 'legL', [
    { t: 0,  a: [50, 55], b: [36, 82] },
    { t: 30, a: [50, 63], b: [36, 90] },
    { t: 60, a: [50, 55], b: [36, 82] },
  ]),
  animLine(6, 'legR', [
    { t: 0,  a: [50, 55], b: [64, 82] },
    { t: 30, a: [50, 63], b: [64, 90] },
    { t: 60, a: [50, 55], b: [64, 82] },
  ]),
]);

// ── SQUAT — body down 8px, legs compress (scaleY 0.82 at hip) ────────────────
// 78 frames = 2.6 s loop
const squat = buildAnim('squat', 79, [
  animCircle(1, 'head', [
    { t: 0,  pos: [50, 18] },
    { t: 39, pos: [50, 26] },
    { t: 78, pos: [50, 18] },
  ], 7),
  animLine(2, 'torso', [
    { t: 0,  a: [50, 25], b: [50, 55] },
    { t: 39, a: [50, 33], b: [50, 63] },
    { t: 78, a: [50, 25], b: [50, 55] },
  ]),
  animLine(3, 'armL', [
    { t: 0,  a: [50, 32], b: [32, 48] },
    { t: 39, a: [50, 40], b: [32, 56] },
    { t: 78, a: [50, 32], b: [32, 48] },
  ]),
  animLine(4, 'armR', [
    { t: 0,  a: [50, 32], b: [68, 48] },
    { t: 39, a: [50, 40], b: [68, 56] },
    { t: 78, a: [50, 32], b: [68, 48] },
  ]),
  // legs compressed: foot stays closer to hip (scaleY 0.82 of [82-63=19] ≈ 15.6 → y=78.6)
  animLine(5, 'legL', [
    { t: 0,  a: [50, 55], b: [36, 82] },
    { t: 39, a: [50, 63], b: [36, 79] },
    { t: 78, a: [50, 55], b: [36, 82] },
  ]),
  animLine(6, 'legR', [
    { t: 0,  a: [50, 55], b: [64, 82] },
    { t: 39, a: [50, 63], b: [64, 79] },
    { t: 78, a: [50, 55], b: [64, 82] },
  ]),
]);

// ── PLANK (isometric hold) — gentle breathing pulse ───────────────────────────
// 54 frames = 1.8 s loop
const plank = buildAnim('plank', 55, [
  animCircle(1, 'head', [
    { t: 0,  pos: [50, 18] },
    { t: 27, pos: [50, 21] },
    { t: 54, pos: [50, 18] },
  ], 7),
  animLine(2, 'torso', [
    { t: 0,  a: [50, 25], b: [50, 55] },
    { t: 27, a: [50, 28], b: [50, 58] },
    { t: 54, a: [50, 25], b: [50, 55] },
  ]),
  animLine(3, 'armL', [
    { t: 0,  a: [50, 32], b: [32, 48] },
    { t: 27, a: [50, 35], b: [32, 51] },
    { t: 54, a: [50, 32], b: [32, 48] },
  ]),
  animLine(4, 'armR', [
    { t: 0,  a: [50, 32], b: [68, 48] },
    { t: 27, a: [50, 35], b: [68, 51] },
    { t: 54, a: [50, 32], b: [68, 48] },
  ]),
  animLine(5, 'legL', [
    { t: 0,  a: [50, 55], b: [36, 82] },
    { t: 27, a: [50, 58], b: [36, 85] },
    { t: 54, a: [50, 55], b: [36, 82] },
  ]),
  animLine(6, 'legR', [
    { t: 0,  a: [50, 55], b: [64, 82] },
    { t: 27, a: [50, 58], b: [64, 85] },
    { t: 54, a: [50, 55], b: [64, 82] },
  ]),
]);

// ── CDYN (mountain climbers) — alternating knee lifts ────────────────────────
// 27 frames = 0.9 s loop, legs alternate opposite phase
const cdyn = buildAnim('cdyn', 28, [
  staticCircle(1, 'head', [50, 18], 7),
  staticLine(2, 'torso', [50, 25], [50, 55]),
  staticLine(3, 'armL', [50, 32], [32, 48]),
  staticLine(4, 'armR', [50, 32], [68, 48]),
  // left leg: extended at t=0, knee-up at t=14
  animLine(5, 'legL', [
    { t: 0,  a: [50, 55], b: [36, 82] },
    { t: 14, a: [50, 55], b: [44, 67] }, // knee toward chest
    { t: 27, a: [50, 55], b: [36, 82] },
  ]),
  // right leg: knee-up at t=0, extended at t=14 (opposite phase)
  animLine(6, 'legR', [
    { t: 0,  a: [50, 55], b: [56, 67] }, // knee up
    { t: 14, a: [50, 55], b: [64, 82] }, // extended
    { t: 27, a: [50, 55], b: [56, 67] },
  ]),
]);

// ── TWIST (russian twist / bicycle) — upper body rotates side to side ─────────
// 42 frames = 1.4 s loop
// -15 deg at t=0, +15 deg at t=21 (approximate geometry, origin at 50,45)
const twist = buildAnim('twist', 43, [
  animCircle(1, 'head', [
    { t: 0,  pos: [43, 19] },
    { t: 21, pos: [57, 19] },
    { t: 42, pos: [43, 19] },
  ], 7),
  animLine(2, 'torso', [
    { t: 0,  a: [45, 26], b: [53, 55] },
    { t: 21, a: [55, 26], b: [47, 55] },
    { t: 42, a: [45, 26], b: [53, 55] },
  ]),
  animLine(3, 'armL', [
    { t: 0,  a: [47, 33], b: [30, 50] },
    { t: 21, a: [53, 33], b: [30, 44] },
    { t: 42, a: [47, 33], b: [30, 50] },
  ]),
  animLine(4, 'armR', [
    { t: 0,  a: [47, 33], b: [70, 44] },
    { t: 21, a: [53, 33], b: [70, 50] },
    { t: 42, a: [47, 33], b: [70, 44] },
  ]),
  staticLine(5, 'legL', [50, 55], [36, 82]),
  staticLine(6, 'legR', [50, 55], [64, 82]),
]);

// ── CALF (calf raise) — whole body rises 6px ──────────────────────────────────
// 33 frames = 1.1 s loop
const calf = buildAnim('calf', 34, [
  animCircle(1, 'head', [
    { t: 0,  pos: [50, 18] },
    { t: 17, pos: [50, 12] },
    { t: 33, pos: [50, 18] },
  ], 7),
  animLine(2, 'torso', [
    { t: 0,  a: [50, 25], b: [50, 55] },
    { t: 17, a: [50, 19], b: [50, 49] },
    { t: 33, a: [50, 25], b: [50, 55] },
  ]),
  animLine(3, 'armL', [
    { t: 0,  a: [50, 32], b: [32, 48] },
    { t: 17, a: [50, 26], b: [32, 42] },
    { t: 33, a: [50, 32], b: [32, 48] },
  ]),
  animLine(4, 'armR', [
    { t: 0,  a: [50, 32], b: [68, 48] },
    { t: 17, a: [50, 26], b: [68, 42] },
    { t: 33, a: [50, 32], b: [68, 48] },
  ]),
  animLine(5, 'legL', [
    { t: 0,  a: [50, 55], b: [36, 82] },
    { t: 17, a: [50, 49], b: [36, 76] },
    { t: 33, a: [50, 55], b: [36, 82] },
  ]),
  animLine(6, 'legR', [
    { t: 0,  a: [50, 55], b: [64, 82] },
    { t: 17, a: [50, 49], b: [64, 76] },
    { t: 33, a: [50, 55], b: [64, 82] },
  ]),
]);

const ANIMATIONS: Record<MotionType, object> = { press, squat, plank, cdyn, twist, calf };

export function getAnimation(type: MotionType): object {
  return ANIMATIONS[type];
}
