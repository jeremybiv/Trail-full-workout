export type MotionType = 'press' | 'squat' | 'plank' | 'cdyn' | 'twist' | 'calf';

export interface Exercise {
  id: string;
  m: MotionType;
  desc: string;
  level: 1 | 2 | 3;
  hold?: true;
  unilateral?: true;
  photo?: true;
  video?: string;
}

export const UP: Exercise[] = [
  { id: 'pushup',      m: 'press', desc: 'Mains sous les épaules, corps gainé.', level: 2, photo: true },
  { id: 'diamond',     m: 'press', desc: 'Mains en losange, focus triceps.', level: 3, photo: true },
  { id: 'decline',     m: 'press', desc: 'Pieds sur une marche, focus épaules.', level: 3, photo: true },
  { id: 'dips',        m: 'press', desc: 'Mains en bord de chaise, fléchis-pousse.', level: 3, photo: true },
  { id: 'pike',        m: 'press', desc: 'Fessiers hauts, pompe quasi-verticale.', level: 3, photo: true, video: 'https://share.gemini.google/HgmS7j4QN0ap' },
  { id: 'plank',       m: 'plank', desc: 'Tête-talons alignés, respire lentement.', level: 1, hold: true, photo: true },
  { id: 'sideplank',   m: 'plank', desc: 'Avant-bras, hanches hautes.', level: 2, hold: true, unilateral: true, photo: true },
  { id: 'mountain',    m: 'cdyn',  desc: 'Genoux vers la poitrine, rythme soutenu.', level: 2, photo: true },
  { id: 'russian',     m: 'twist', desc: 'Buste incliné, rotation gauche-droite.', level: 2, photo: true },
  { id: 'bicycle',     m: 'twist', desc: 'Coude vers le genou opposé.', level: 2, photo: true },
  { id: 'legraise',    m: 'cdyn',  desc: 'Jambes tendues, montée lente.', level: 1, photo: true },
  { id: 'superman',    m: 'plank', desc: 'Bras et jambes décollés, dos gainé.', level: 1, hold: true, photo: true },
  { id: 'shouldertap', m: 'cdyn',  desc: "Planche, touche l'épaule opposée.", level: 1, photo: true },
  { id: 'flutter',     m: 'cdyn',  desc: 'Dos au sol, jambes tendues, battements alternatifs.', level: 1, photo: true },
  { id: 'splitcrunch', m: 'cdyn',  desc: 'Jambes en ciseaux, crunch synchronisé.', level: 2, photo: true },
  { id: 'splanrot',    m: 'twist', desc: 'Gainage latéral, rotation du buste vers le sol.', level: 2, unilateral: true },
  { id: 'swimmer',     m: 'plank', desc: 'À plat ventre, bras-jambe opposés alternés.', level: 2 },
  { id: 'birddog',     m: 'plank', desc: 'Planche, bras et jambe opposés tendus.', level: 1, photo: true },
];

export const LG: Exercise[] = [
  { id: 'squat',      m: 'squat', desc: 'Hanches arrière, talons au sol.', level: 1, photo: true },
  { id: 'lunge',      m: 'squat', desc: 'Grand pas avant, genou arrière bas.', level: 2, photo: true },
  { id: 'rlunge',     m: 'squat', desc: 'Pas arrière, descente contrôlée.', level: 2, photo: true },
  { id: 'jumpsquat',  m: 'squat', desc: 'Explosivité, atterrissage souple.', level: 3, photo: true },
  { id: 'calf',       m: 'calf',  desc: 'Pointes de pieds, descente lente.', level: 1, photo: true },
  { id: 'wallsit',    m: 'plank', desc: 'Dos au mur, cuisses parallèles.', level: 1, hold: true },
  { id: 'jlunge',     m: 'squat', desc: "Alterne en l'air, amorti.", level: 3, photo: true },
  { id: 'fswing',     m: 'cdyn',  desc: 'Jambe tendue, balancé avant-arrière, hanche souple.', level: 1, photo: true },
  { id: 'lswing',     m: 'cdyn',  desc: 'Jambe tendue, balancé dedans-dehors, hanche stable.', level: 1 },
  { id: 'swingdrive', m: 'cdyn',  desc: 'Montée genou + extension explosive, alterné.', level: 2, photo: true },
  { id: 'pogo',       m: 'calf',  desc: 'Petits bonds rapides, réception sur les pointes.', level: 3, photo: true },
  { id: 'highknee',   m: 'cdyn',  desc: 'Course sur place, genoux à hauteur de hanche.', level: 2, photo: true },
  { id: 'buttkick',   m: 'cdyn',  desc: 'Course sur place, talons vers les fessiers.', level: 2 },
  { id: 'dynowalk',   m: 'squat', desc: 'Fente latérale dynamique, pas chassés.', level: 2 },
  { id: 'askip',      m: 'cdyn',  desc: 'Montée de genou rythmée, bras coordinés.', level: 2 },
  { id: 'cskip',      m: 'cdyn',  desc: 'Skip circulaire, rotation de hanche amplifiée.', level: 2 },
  { id: 'clamshell',  m: 'squat', desc: 'Sur une jambe, ouvre la hanche en rotation externe.', level: 1, unilateral: true, photo: true },
  { id: 'janefonda',  m: 'squat', desc: 'Abduction latérale jambe tendue, contrôle du bassin.', level: 1, unilateral: true, photo: true },
  { id: 'monwalk',    m: 'squat', desc: 'Marche latérale en position basse, tension constante.', level: 2, photo: true },
  { id: 'hamslide',   m: 'squat', desc: 'Glissé au sol, descente lente, remontée contrôlée.', level: 2, photo: true },
  { id: 'pulsesquat', m: 'squat', desc: 'Squat bas, micro-pulsions sans remonter.', level: 2, photo: true },
  { id: 'pulselunge', m: 'squat', desc: 'Fente basse, pulses en bas de la course.', level: 2, photo: true },
  { id: 'lungewall',  m: 'squat', desc: 'Fente arrière + drive genou vers le mur.', level: 3 },
  { id: 'runjump',    m: 'squat', desc: 'Saut unilatéral explosif, réception mono-appui.', level: 3, photo: true },
];

export const ALL: Record<string, Exercise> = {};
[...UP, ...LG].forEach((e) => (ALL[e.id] = e));
