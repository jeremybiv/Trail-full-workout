export type MotionType = 'press' | 'squat' | 'plank' | 'cdyn' | 'twist' | 'calf';

export interface Exercise {
  id: string;
  m: MotionType;
  desc: string;
  hold?: true;
  unilateral?: true;
  photo?: true;
}

export const UP: Exercise[] = [
  { id: 'pushup',      m: 'press', desc: 'Mains sous les épaules, corps gainé.', photo: true },
  { id: 'diamond',     m: 'press', desc: 'Mains en losange, focus triceps.', photo: true },
  { id: 'decline',     m: 'press', desc: 'Pieds sur une marche, focus épaules.', photo: true },
  { id: 'dips',        m: 'press', desc: 'Mains en bord de chaise, fléchis-pousse.', photo: true },
  { id: 'pike',        m: 'press', desc: 'Fessiers hauts, pompe quasi-verticale.', photo: true },
  { id: 'plank',       m: 'plank', desc: 'Tête-talons alignés, respire lentement.', hold: true, photo: true },
  { id: 'sideplank',   m: 'plank', desc: 'Avant-bras, hanches hautes.', hold: true, unilateral: true, photo: true },
  { id: 'mountain',    m: 'cdyn',  desc: 'Genoux vers la poitrine, rythme soutenu.', photo: true },
  { id: 'russian',     m: 'twist', desc: 'Buste incliné, rotation gauche-droite.', photo: true },
  { id: 'bicycle',     m: 'twist', desc: 'Coude vers le genou opposé.', photo: true },
  { id: 'legraise',    m: 'cdyn',  desc: 'Jambes tendues, montée lente.', photo: true },
  { id: 'superman',    m: 'plank', desc: 'Bras et jambes décollés, dos gainé.', hold: true, photo: true },
  { id: 'shouldertap', m: 'cdyn',  desc: "Planche, touche l'épaule opposée.", photo: true },
  { id: 'flutter',     m: 'cdyn',  desc: 'Dos au sol, jambes tendues, battements alternatifs.', photo: true },
  { id: 'splitcrunch', m: 'cdyn',  desc: 'Jambes en ciseaux, crunch synchronisé.', photo: true },
  { id: 'splanrot',    m: 'twist', desc: 'Gainage latéral, rotation du buste vers le sol.', unilateral: true },
  { id: 'swimmer',     m: 'plank', desc: 'À plat ventre, bras-jambe opposés alternés.' },
  { id: 'birddog',     m: 'plank', desc: 'Planche, bras et jambe opposés tendus.', photo: true },
];

export const LG: Exercise[] = [
  { id: 'squat',      m: 'squat', desc: 'Hanches arrière, talons au sol.', photo: true },
  { id: 'lunge',      m: 'squat', desc: 'Grand pas avant, genou arrière bas.', photo: true },
  { id: 'rlunge',     m: 'squat', desc: 'Pas arrière, descente contrôlée.', photo: true },
  { id: 'jumpsquat',  m: 'squat', desc: 'Explosivité, atterrissage souple.', photo: true },
  { id: 'calf',       m: 'calf',  desc: 'Pointes de pieds, descente lente.', photo: true },
  { id: 'wallsit',    m: 'plank', desc: 'Dos au mur, cuisses parallèles.', hold: true },
  { id: 'jlunge',     m: 'squat', desc: "Alterne en l'air, amorti.", photo: true },
  { id: 'fswing',     m: 'cdyn',  desc: 'Jambe tendue, balancé avant-arrière, hanche souple.', photo: true },
  { id: 'lswing',     m: 'cdyn',  desc: 'Jambe tendue, balancé dedans-dehors, hanche stable.' },
  { id: 'swingdrive', m: 'cdyn',  desc: 'Montée genou + extension explosive, alterné.', photo: true },
  { id: 'pogo',       m: 'calf',  desc: 'Petits bonds rapides, réception sur les pointes.', photo: true },
  { id: 'highknee',   m: 'cdyn',  desc: 'Course sur place, genoux à hauteur de hanche.', photo: true },
  { id: 'buttkick',   m: 'cdyn',  desc: 'Course sur place, talons vers les fessiers.' },
  { id: 'dynowalk',   m: 'squat', desc: 'Fente latérale dynamique, pas chassés.' },
  { id: 'askip',      m: 'cdyn',  desc: 'Montée de genou rythmée, bras coordinés.' },
  { id: 'cskip',      m: 'cdyn',  desc: 'Skip circulaire, rotation de hanche amplifiée.' },
  { id: 'clamshell',  m: 'squat', desc: 'Sur une jambe, ouvre la hanche en rotation externe.', unilateral: true, photo: true },
  { id: 'janefonda',  m: 'squat', desc: 'Abduction latérale jambe tendue, contrôle du bassin.', unilateral: true, photo: true },
  { id: 'monwalk',    m: 'squat', desc: 'Marche latérale en position basse, tension constante.', photo: true },
  { id: 'hamslide',   m: 'squat', desc: 'Glissé au sol, descente lente, remontée contrôlée.', photo: true },
  { id: 'pulsesquat', m: 'squat', desc: 'Squat bas, micro-pulsions sans remonter.', photo: true },
  { id: 'pulselunge', m: 'squat', desc: 'Fente basse, pulses en bas de la course.', photo: true },
  { id: 'lungewall',  m: 'squat', desc: 'Fente arrière + drive genou vers le mur.' },
  { id: 'runjump',    m: 'squat', desc: 'Saut unilatéral explosif, réception mono-appui.', photo: true },
];

export const ALL: Record<string, Exercise> = {};
[...UP, ...LG].forEach((e) => (ALL[e.id] = e));
