export interface Character {
  char: string;
  romaji: string;
  strokes: string[]; // SVG paths for strokes
}

export const hangul: Character[] = [
  {
    char: '가',
    romaji: 'ga',
    strokes: [
      'M25,25 l30,0',
      'M55,25 l-10,50',
      'M70,15 l0,70',
      'M70,45 l20,0'
    ]
  },
  {
    char: '나',
    romaji: 'na',
    strokes: [
      'M30,20 l0,40',
      'M30,60 l30,0',
      'M70,15 l0,70',
      'M70,45 l20,0'
    ]
  }
];

export const korean = {
  hangul
};