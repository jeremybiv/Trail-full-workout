export type MotionType = 'press' | 'squat' | 'plank' | 'cdyn' | 'twist' | 'calf';

export interface Exercise {
  id: string;
  name: string;
  m: MotionType;
  desc: string;
  hold?: true;
}

export const UP: Exercise[] = [
  { id: 'pushup',      name: 'Pompes',                 m: 'press', desc: 'Mains sous les épaules, corps gainé.' },
  { id: 'diamond',     name: 'Pompes diamant',          m: 'press', desc: 'Mains en losange, focus triceps.' },
  { id: 'decline',     name: 'Pompes pieds surélevés',  m: 'press', desc: 'Pieds sur une marche, focus épaules.' },
  { id: 'dips',        name: 'Dips sur chaise',         m: 'press', desc: 'Mains en bord de chaise, fléchis-pousse.' },
  { id: 'pike',        name: 'Pike push-ups',           m: 'press', desc: 'Fessiers hauts, pompe quasi-verticale.' },
  { id: 'plank',       name: 'Gainage',                 m: 'plank', desc: 'Tête-talons alignés, respire lentement.', hold: true },
  { id: 'sideplank',   name: 'Gainage latéral',         m: 'plank', desc: 'Avant-bras, hanches hautes.', hold: true },
  { id: 'mountain',    name: 'Mountain climbers',       m: 'cdyn',  desc: 'Genoux vers la poitrine, rythme soutenu.' },
  { id: 'russian',     name: 'Russian twists',          m: 'twist', desc: 'Buste incliné, rotation gauche-droite.' },
  { id: 'bicycle',     name: 'Crunchs vélo',            m: 'twist', desc: 'Coude vers le genou opposé.' },
  { id: 'legraise',    name: 'Relevé de jambes',        m: 'cdyn',  desc: 'Jambes tendues, montée lente.' },
  { id: 'superman',    name: 'Superman',                m: 'plank', desc: 'Bras et jambes décollés, dos gainé.', hold: true },
  { id: 'shouldertap', name: 'Shoulder taps',           m: 'cdyn',  desc: "Planche, touche l'épaule opposée." },
];

export const LG: Exercise[] = [
  { id: 'squat',     name: 'Squats',              m: 'squat', desc: 'Hanches arrière, talons au sol.' },
  { id: 'lunge',     name: 'Fentes avant',        m: 'squat', desc: 'Grand pas avant, genou arrière bas.' },
  { id: 'rlunge',    name: 'Fentes arrière',      m: 'squat', desc: 'Pas arrière, descente contrôlée.' },
  { id: 'jumpsquat', name: 'Squats sautés',       m: 'squat', desc: 'Explosivité, atterrissage souple.' },
  { id: 'calf',      name: 'Extensions mollets',  m: 'calf',  desc: 'Pointes de pieds, descente lente.' },
  { id: 'wallsit',   name: 'Chaise',              m: 'plank', desc: 'Dos au mur, cuisses parallèles.', hold: true },
  { id: 'jlunge',    name: 'Fentes sautées',      m: 'squat', desc: "Alterne en l'air, amorti." },
];

export const ALL: Record<string, Exercise> = {};
[...UP, ...LG].forEach((e) => (ALL[e.id] = e));

export const EX_SEARCH: Record<string, string> = {
  pushup: 'push-up',
  diamond: 'close-grip push-up',
  decline: 'decline push-up',
  dips: 'dips',
  pike: 'pike push-up',
  plank: 'plank',
  sideplank: 'side plank',
  mountain: 'mountain climber',
  russian: 'russian twist',
  bicycle: 'bicycle crunch',
  legraise: 'leg raise',
  superman: 'superman',
  shouldertap: 'shoulder tap',
  squat: 'squat',
  lunge: 'forward lunge',
  rlunge: 'reverse lunge',
  jumpsquat: 'jump squat',
  calf: 'calf raise',
  wallsit: 'wall sit',
  jlunge: 'jump lunge',
};
