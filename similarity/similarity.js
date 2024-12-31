function transposeChord(chord, semitones) {
  const NOTE_MAP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const FLAT_TO_SHARP = { 'Cb': 'B', 'Db': 'C#', 'Eb': 'D#', 'Fb': 'E', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#' };
  const SHARP_TO_FLAT = { 'B': 'Cb', 'C#': 'Db', 'D#': 'Eb', 'E': 'Fb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb' };

  // コード名を解析してルート音を取得する
  const match = chord.match(/^([A-G][b#]{0,2})(.*)$/);
  if (!match) {
    throw new Error(`Invalid chord format: ${chord}`);
  }

  let [_, root, suffix] = match;

  // フラット記号やダブルフラットをシャープ記号に変換
  root = FLAT_TO_SHARP[root] || root;

  // 現在のルート音のインデックスを取得
  let currentIndex = NOTE_MAP.indexOf(root.replace('##', '').replace('bb', ''));
  if (currentIndex === -1) {
    throw new Error(`Invalid root note: ${root}`);
  }

  // ダブルシャープやダブルフラットを考慮
  currentIndex += (root.match(/#/g) || []).length; // シャープの数を加算
  currentIndex -= (root.match(/b/g) || []).length; // フラットの数を減算

  // 半音移調した新しいルート音を計算
  const newIndex = (currentIndex + semitones + 12) % 12;
  let newRoot = NOTE_MAP[newIndex];

  // 必要に応じてフラット表記に戻す
  if (Object.values(FLAT_TO_SHARP).includes(newRoot)) {
    newRoot = Object.keys(SHARP_TO_FLAT).includes(newRoot) ? SHARP_TO_FLAT[newRoot] : newRoot;
  }

  // 新しいコードを組み立てて返す
  return newRoot + suffix;
}

function similarity(song1, song2) {
    const NOTE_MAP = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
    
    const parseNum = (onmei, i) => {
      let num = NOTE_MAP[onmei.charAt(0)] ?? null;
      if (num === null) return null;
  
      num += i + (onmei.includes('#') ? 1 : 0) - (onmei.includes('b') ? 1 : 0) ;
      return num % 12;
    }
  
    const parseTriad = (chordName) => {
      return chordName.replace(/(add9|M9|\+9|M7|7|69|9|dim)/g, match => (match === 'dim' ? 'm-5' : ''));
    }
  
    const PATTERN_MAP = {
      'sus2': [0, 2, 7],
      'sus4': [0, 5, 7],
      'aug': [0, 4, 8],
      'm-5': [0, 3, 6],
      '-5': [0, 4, 6],
      'm': [0, 3, 7],
      'default': [0, 4, 7],
    };
  
  const kouseion = (chord) => {
    const chordName = parseTriad(chord);
    let count = Array(12).fill(0);

    if (chordName.includes('/')) {
      // 分数コードの場合
      const [baseChord, root] = chordName.split('/');
      count[parseNum(root, 0)] += 1;

      const pattern = Object.keys(PATTERN_MAP).find(key => baseChord.includes(key)) || 'default';
      PATTERN_MAP[pattern].forEach((interval, index) => {
        count[parseNum(baseChord.replace(pattern, ''), interval)] += index === 0 ? 2 : 1; // ルート音だけ2カウント
      });
    } else {
      // 分数コード以外の場合
      const pattern = Object.keys(PATTERN_MAP).find(key => chordName.includes(key)) || 'default';
      PATTERN_MAP[pattern].forEach((interval, index) => {
        count[parseNum(chordName.replace(pattern, ''), interval)] += index === 0 ? 2 : 1; // ルート音だけ2カウント
      });
    }

    return count;
  }

  const chordSimilarity = (chord1, chord2) => {
    const kousei1 = kouseion(chord1);
    const kousei2 = kouseion(chord2);
    return 1 - Math.sqrt(kousei1.reduce((sum, count, i) => sum + (count - kousei2[i]) ** 2, 0) / 12);
  }

  const chordProgressionSimilarity = (a, b) => {
    // 空白（''）を前のコードで埋める処理
    const filledChordP1 = a.chord.map((chord, i) => {
      let transposed = '';
      if (chord !== '') {
        transposed = transposeChord(chord, a.key * -1);
      };
      if (i > 0) {
        transposed = a.chord[i - 1]
      };
      return transposed;
    });

    const filledChordP2 = b.chord.map((chord, i) => {
      let transposed = '';
      if (chord !== '') {
        transposed = transposeChord(chord, b.key * -1);
      };
      if (i > 0) {
        transposed = b.chord[i - 1]
      };
      return transposed;
    });

    return filledChordP1.reduce((sum, chord, i) => sum + chordSimilarity(chord, filledChordP2[i]), 0) / filledChordP1.length;
  }

  const a = song1;
  const b = song2;
    return chordProgressionSimilarity(a, b);
    
  }