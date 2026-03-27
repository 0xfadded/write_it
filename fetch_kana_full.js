import fs from 'fs';
import path from 'path';
import https from 'https';
import zlib from 'zlib';

const KANJIVG_URL = 'https://github.com/KanjiVG/kanjivg/releases/download/r20220427/kanjivg-20220427.xml.gz';
const TMP_FILE = 'kanjivg.xml.gz';
const XML_FILE = 'kanjivg.xml';

// Basic Kana map to their unicode hex
const hiraganaMap = {
  'あ': '3042', 'い': '3044', 'う': '3046', 'え': '3048', 'お': '304a',
  'か': '304b', 'き': '304d', 'く': '304f', 'け': '3051', 'こ': '3053',
  'さ': '3055', 'し': '3057', 'す': '3059', 'せ': '305b', 'そ': '305d',
  'た': '305f', 'ち': '3061', 'つ': '3064', 'て': '3066', 'と': '3068',
  'な': '306a', 'に': '306b', 'ぬ': '306c', 'ね': '306d', 'の': '306e',
  'は': '306f', 'ひ': '3072', 'ふ': '3075', 'へ': '3078', 'ほ': '307b',
  'ま': '307e', 'み': '307f', 'む': '3080', 'め': '3081', 'も': '3082',
  'や': '3084', 'ゆ': '3086', 'よ': '3088',
  'ら': '3089', 'り': '308a', 'る': '308b', 'れ': '308c', 'ろ': '308d',
  'わ': '308f', 'を': '3092', 'ん': '3093'
};

const katakanaMap = {
  'ア': '30a2', 'イ': '30a4', 'ウ': '30a6', 'エ': '30a8', 'オ': '30aa',
  'カ': '30ab', 'キ': '30ad', 'ク': '30af', 'ケ': '30b1', 'コ': '30b3',
  'サ': '30b5', 'シ': '30b7', 'ス': '30b9', 'セ': '30bb', 'ソ': '30bd',
  'タ': '30bf', 'チ': '30c1', 'ツ': '30c4', 'テ': '30c6', 'ト': '30c8',
  'ナ': '30ca', 'ニ': '30cb', 'ヌ': '30cc', 'ネ': '30cd', 'ノ': '30ce',
  'ハ': '30cf', 'ヒ': '30d2', 'フ': '30d5', 'ヘ': '30d8', 'ホ': '30db',
  'マ': '30de', 'ミ': '30df', 'ム': '30e0', 'メ': '30e1', 'モ': '30e2',
  'ヤ': '30e4', 'ユ': '30e6', 'ヨ': '30e8',
  'ラ': '30e9', 'リ': '30ea', 'ル': '30eb', 'レ': '30ec', 'ロ': '30ed',
  'ワ': '30ef', 'ヲ': '30f2', 'ン': '30f3'
};

const romajiMap = {
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'を': 'wo', 'ん': 'n',
  'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o',
  'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
  'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so',
  'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu', 'テ': 'te', 'ト': 'to',
  'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
  'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho',
  'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
  'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
  'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
  'ワ': 'wa', 'ヲ': 'wo', 'ン': 'n'
};

function downloadAndExtract(url, destGz, destXml) {
  return new Promise((resolve, reject) => {
    console.log('Downloading KanjiVG data...');
    const file = fs.createWriteStream(destGz);
    https.get(url, function(response) {
      if (response.statusCode === 302) { // Handle redirect
         https.get(response.headers.location, function(redirectResponse) {
             redirectResponse.pipe(file);
             file.on('finish', () => {
                file.close(() => {
                    console.log('Extracting XML...');
                    const gzip = zlib.createGunzip();
                    const source = fs.createReadStream(destGz);
                    const destination = fs.createWriteStream(destXml);
                    source.pipe(gzip).pipe(destination).on('finish', resolve).on('error', reject);
                });
             });
         }).on('error', reject);
      } else {
          response.pipe(file);
          file.on('finish', () => {
            file.close(() => {
                console.log('Extracting XML...');
                const gzip = zlib.createGunzip();
                const source = fs.createReadStream(destGz);
                const destination = fs.createWriteStream(destXml);
                source.pipe(gzip).pipe(destination).on('finish', resolve).on('error', reject);
            });
          });
      }
    }).on('error', reject);
  });
}

function parseXMLAndExtractPaths(content, targetMap) {
  const results = [];

  for (const [char, hex] of Object.entries(targetMap)) {
    // Regex to find the <kanji id="kvg:kanji_XXXX"> block
    // KanjiVG format for hiragana/katakana is usually kvg:kanji_XXXX
    // sometimes it's kvg:kanji_0XXXX
    let blockRegex = new RegExp(`<kanji id="kvg:kanji_0?${hex}">([\\s\\S]*?)</kanji>`, 'i');
    let blockMatch = content.match(blockRegex);

    if (blockMatch) {
      const block = blockMatch[1];
      const paths = [];

      // Extract all 'd' attributes from <path> tags in this block
      const pathRegex = /<path[^>]*d="([^"]+)"/g;
      let pathMatch;
      while ((pathMatch = pathRegex.exec(block)) !== null) {
        paths.push(pathMatch[1]);
      }

      results.push({
        char,
        romaji: romajiMap[char],
        strokes: paths
      });
    } else {
        console.warn(`Could not find paths for ${char} (${hex})`);
    }
  }

  return results;
}

async function main() {
  if (!fs.existsSync(XML_FILE)) {
    await downloadAndExtract(KANJIVG_URL, TMP_FILE, XML_FILE);
  } else {
      console.log('KanjiVG XML already exists, skipping download.');
  }

  const content = fs.readFileSync(XML_FILE, 'utf8');

  console.log('Parsing Hiragana...');
  const hiraganaData = parseXMLAndExtractPaths(content, hiraganaMap);
  console.log(`Parsed ${hiraganaData.length} Hiragana.`);

  console.log('Parsing Katakana...');
  const katakanaData = parseXMLAndExtractPaths(content, katakanaMap);
  console.log(`Parsed ${katakanaData.length} Katakana.`);

  const output = `export interface Character {
  char: string;
  romaji: string;
  strokes: string[]; // SVG paths for strokes
}

export const hiragana: Character[] = ${JSON.stringify(hiraganaData, null, 2)};

export const katakana: Character[] = ${JSON.stringify(katakanaData, null, 2)};

export const japanese = {
  hiragana,
  katakana
};
`;

  fs.writeFileSync('constants/japanese.ts', output, 'utf8');
  console.log('Successfully written full dataset to constants/japanese.ts');

  // Cleanup
  if (fs.existsSync(TMP_FILE)) fs.unlinkSync(TMP_FILE);
  if (fs.existsSync(XML_FILE)) fs.unlinkSync(XML_FILE);
}

main().catch(console.error);