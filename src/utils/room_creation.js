const ADJECTIVES = [
  'Happy',
  'Glamurous',
  'Affectionate',
  'Ambitious',
  'Compassionate',
  'Courageous',
  'Empathetic',
  'Exuberant',
  'Generous',
  'Inventive',
  'Philosofical',
  'Sensible',
  'Sympathetic',
  'Witty',
];
const THINGS = [
  '🐞',
  '🐠',
  '🐢',
  '🐦',
  '🐨',
  '🐬',
  '🐭',
  '🐮',
  '🐯',
  '🐰',
  '🐱',
  '🐲',
  '🐵',
  '🐶',
  '🐷',
  '🐸',
  '🐹',
  '🐻',
];

const colorsArray = [
  '#e6194B', // red
  '#f58231', // orange
  '#ffe119', // yellow
  '#bfef45', // lime
  '#3cb44b', // green
  '#42d4f4', // cyan
  '#4363d8', // blue
  '#911eb4', // purple
  '#f032e6', // magenta
  '#a9a9a9', // grey
];

function generateName() {
  return `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} ${
    THINGS[Math.floor(Math.random() * THINGS.length)]
  }`;
}

module.exports = {
  generateName,
  colorsArray,
};
