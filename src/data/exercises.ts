export type MotionType = 'press' | 'squat' | 'plank' | 'cdyn' | 'twist' | 'calf';

export interface Exercise {
  id: string;
  name: string;
  m: MotionType;
  desc: string;
  hold?: true;
  unilateral?: true;
}

export const UP: Exercise[] = [
  { id: 'pushup',      name: 'Pompes',                 m: 'press', desc: 'Mains sous les épaules, corps gainé.' },
  { id: 'diamond',     name: 'Pompes diamant',          m: 'press', desc: 'Mains en losange, focus triceps.' },
  { id: 'decline',     name: 'Pompes pieds surélevés',  m: 'press', desc: 'Pieds sur une marche, focus épaules.' },
  { id: 'dips',        name: 'Dips sur chaise',         m: 'press', desc: 'Mains en bord de chaise, fléchis-pousse.' },
  { id: 'pike',        name: 'Pike push-ups',           m: 'press', desc: 'Fessiers hauts, pompe quasi-verticale.' },
  { id: 'plank',       name: 'Gainage',                 m: 'plank', desc: 'Tête-talons alignés, respire lentement.', hold: true },
  { id: 'sideplank',   name: 'Gainage latéral',         m: 'plank', desc: 'Avant-bras, hanches hautes.', hold: true, unilateral: true },
  { id: 'mountain',    name: 'Mountain climbers',       m: 'cdyn',  desc: 'Genoux vers la poitrine, rythme soutenu.' },
  { id: 'russian',     name: 'Russian twists',          m: 'twist', desc: 'Buste incliné, rotation gauche-droite.' },
  { id: 'bicycle',     name: 'Crunchs vélo',            m: 'twist', desc: 'Coude vers le genou opposé.' },
  { id: 'legraise',    name: 'Relevé de jambes',        m: 'cdyn',  desc: 'Jambes tendues, montée lente.' },
  { id: 'superman',    name: 'Superman',                m: 'plank', desc: 'Bras et jambes décollés, dos gainé.', hold: true },
  { id: 'shouldertap', name: 'Shoulder taps',           m: 'cdyn',  desc: "Planche, touche l'épaule opposée." },
  { id: 'flutter',     name: 'Flutter Kicks',           m: 'cdyn',  desc: 'Dos au sol, jambes tendues, battements alternatifs.' },
  { id: 'splitcrunch', name: 'Split Crunch',            m: 'cdyn',  desc: 'Jambes en ciseaux, crunch synchronisé.' },
  { id: 'splanrot',    name: 'Rotation gainage latéral', m: 'twist', desc: 'Gainage latéral, rotation du buste vers le sol.', unilateral: true },
  { id: 'swimmer',     name: 'Swimmers',                m: 'plank', desc: 'À plat ventre, bras-jambe opposés alternés.' },
  { id: 'birddog',     name: 'Plank Bird-Dog',          m: 'plank', desc: 'Planche, bras et jambe opposés tendus.' },
];

export const LG: Exercise[] = [
  { id: 'squat',      name: 'Squats',                      m: 'squat', desc: 'Hanches arrière, talons au sol.' },
  { id: 'lunge',      name: 'Fentes avant',                m: 'squat', desc: 'Grand pas avant, genou arrière bas.' },
  { id: 'rlunge',     name: 'Fentes arrière',              m: 'squat', desc: 'Pas arrière, descente contrôlée.' },
  { id: 'jumpsquat',  name: 'Squats sautés',               m: 'squat', desc: 'Explosivité, atterrissage souple.' },
  { id: 'calf',       name: 'Extensions mollets',          m: 'calf',  desc: 'Pointes de pieds, descente lente.' },
  { id: 'wallsit',    name: 'Chaise',                      m: 'plank', desc: 'Dos au mur, cuisses parallèles.', hold: true },
  { id: 'jlunge',     name: 'Fentes sautées',              m: 'squat', desc: "Alterne en l'air, amorti." },
  { id: 'fswing',     name: 'Balancés frontaux',           m: 'cdyn',  desc: 'Jambe tendue, balancé avant-arrière, hanche souple.' },
  { id: 'lswing',     name: 'Balancés latéraux',           m: 'cdyn',  desc: 'Jambe tendue, balancé dedans-dehors, hanche stable.' },
  { id: 'swingdrive', name: 'Swing drives',                m: 'cdyn',  desc: 'Montée genou + extension explosive, alterné.' },
  { id: 'pogo',       name: 'Pogo Jumps',                  m: 'calf',  desc: 'Petits bonds rapides, réception sur les pointes.' },
  { id: 'highknee',   name: 'Genoux hauts',                m: 'cdyn',  desc: 'Course sur place, genoux à hauteur de hanche.' },
  { id: 'buttkick',   name: 'Talons-fesses',               m: 'cdyn',  desc: 'Course sur place, talons vers les fessiers.' },
  { id: 'dynowalk',   name: 'Dyno Walks',                  m: 'squat', desc: 'Fente latérale dynamique, pas chassés.' },
  { id: 'askip',      name: 'A-Skips',                     m: 'cdyn',  desc: 'Montée de genou rythmée, bras coordinés.' },
  { id: 'cskip',      name: 'C-Skips',                     m: 'cdyn',  desc: 'Skip circulaire, rotation de hanche amplifiée.' },
  { id: 'clamshell',  name: 'Coquillages debout',          m: 'squat', desc: 'Sur une jambe, ouvre la hanche en rotation externe.', unilateral: true },
  { id: 'janefonda',  name: 'Jane Fonda debout',           m: 'squat', desc: 'Abduction latérale jambe tendue, contrôle du bassin.', unilateral: true },
  { id: 'monwalk',    name: 'Monster Walks',               m: 'squat', desc: 'Marche latérale en position basse, tension constante.' },
  { id: 'hamslide',   name: 'Ischio-jambiers excentriques', m: 'squat', desc: 'Glissé au sol, descente lente, remontée contrôlée.' },
  { id: 'pulsesquat', name: 'Pulse Squats',                m: 'squat', desc: 'Squat bas, micro-pulsions sans remonter.' },
  { id: 'pulselunge', name: 'Pulse Fentes',                m: 'squat', desc: 'Fente basse, pulses en bas de la course.' },
  { id: 'lungewall',  name: 'Fente + Drive mur',           m: 'squat', desc: 'Fente arrière + drive genou vers le mur.' },
  { id: 'runjump',    name: 'Runner Jump',                 m: 'squat', desc: 'Saut unilatéral explosif, réception mono-appui.' },
];

export const ALL: Record<string, Exercise> = {};
[...UP, ...LG].forEach((e) => (ALL[e.id] = e));
