export interface Character {
  char: string;
  romaji: string;
  strokes: string[]; // SVG paths for strokes
}

export const hanzi: Character[] = [
  {
    char: '一',
    romaji: 'yi1',
    strokes: [
      'M20,50 L80,50'
    ]
  },
  {
    char: '二',
    romaji: 'er4',
    strokes: [
      'M30,30 L70,30',
      'M20,70 L80,70'
    ]
  },
  {
    char: '三',
    romaji: 'san1',
    strokes: [
      'M30,25 L70,25',
      'M35,50 L65,50',
      'M20,75 L80,75'
    ]
  }
];

export const chinese = {
  hanzi
};