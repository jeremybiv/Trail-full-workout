// Compact Lottie animation builder — generates stick-figure animations per motion type.
// Lottie coordinate system: 100×100, 30 fps.

type V2 = [number, number];
type RGBA = [number, number, number, number];

const INK: RGBA = [0.953, 0.937, 0.894, 1]; // #f3efe4

const ease = { i: { x: 0.5, y: 1 }, o: { x: 0.5, y: 0 } };

function linePath(a: V2, b: V2) {
  return { i: [[0, 0], [0, 0]], o: [[0, 0], [0, 0]], v: [a, b], c: false };
}

function baseKs() {
  return {
    o: { a: 0, k: 100 }, r: { a: 0, k: 0 },
    p: { a: 0, k: [0, 0, 0] }, a: { a: 0, k: [0, 0, 0] },
    s: { a: 0, k: [100, 100, 100] },
  };
}

function strokeSh(c: RGBA = INK, w = 3.5) {
  return { ty: 'st', c: { a: 0, k: c }, o: { a: 0, k: 100 }, w: { a: 0, k: w }, lc: 2, lj: 2 };
}

function baseLayer(ind: number, nm: string, shapes: object[]) {
  return {
    ddd: 0, ind, ty: 4, nm, sr: 1, ao: 0, ip: 0, op: 900, st: 0, bm: 0,
    ks: baseKs(),
    shapes,
  };
}

export function staticLine(ind: number, nm: string, a: V2, b: V2): object {
  return baseLayer(ind, nm, [
    { ty: 'sh', ks: { a: 0, k: linePath(a, b) } },
    strokeSh(),
  ]);
}

export function animLine(
  ind: number,
  nm: string,
  kfs: { t: number; a: V2; b: V2 }[],
): object {
  return baseLayer(ind, nm, [
    {
      ty: 'sh',
      ks: {
        a: 1,
        k: kfs.map((kf, i) => ({
          ...(i < kfs.length - 1 ? ease : {}),
          t: kf.t,
          s: [linePath(kf.a, kf.b)],
        })),
      },
    },
    strokeSh(),
  ]);
}

export function staticCircle(ind: number, nm: string, pos: V2, r: number): object {
  return {
    ddd: 0, ind, ty: 4, nm, sr: 1, ao: 0, ip: 0, op: 900, st: 0, bm: 0,
    ks: { ...baseKs(), p: { a: 0, k: [...pos, 0] } },
    shapes: [
      { ty: 'el', d: 1, s: { a: 0, k: [r * 2, r * 2] }, p: { a: 0, k: [0, 0] } },
      strokeSh(),
      { ty: 'fl', c: { a: 0, k: [0, 0, 0, 0] }, o: { a: 0, k: 0 } },
    ],
  };
}

export function animCircle(
  ind: number,
  nm: string,
  kfs: { t: number; pos: V2 }[],
  r: number,
): object {
  return {
    ddd: 0, ind, ty: 4, nm, sr: 1, ao: 0, ip: 0, op: 900, st: 0, bm: 0,
    ks: {
      ...baseKs(),
      p: {
        a: 1,
        k: kfs.map((kf, i) => ({
          ...(i < kfs.length - 1 ? ease : {}),
          t: kf.t,
          s: [...kf.pos, 0],
        })),
      },
    },
    shapes: [
      { ty: 'el', d: 1, s: { a: 0, k: [r * 2, r * 2] }, p: { a: 0, k: [0, 0] } },
      strokeSh(),
      { ty: 'fl', c: { a: 0, k: [0, 0, 0, 0] }, o: { a: 0, k: 0 } },
    ],
  };
}

export function buildAnim(nm: string, op: number, layers: object[]): object {
  return { v: '5.7.4', fr: 30, ip: 0, op, w: 100, h: 100, nm, ddd: 0, assets: [], layers };
}
