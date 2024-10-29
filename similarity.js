function myFunction() {
  const parseNum = (onmei, i) => {
    let num = 0;
    switch (onmei.charAt(0)) {
      case 'C': num = 0; break;
      case 'D': num = 2; break;
      case 'E': num = 4; break;
      case 'F': num = 5; break;
      case 'G': num = 7; break;
      case 'A': num = 9; break;
      case 'B': num = 11; break;
      default : num = null;
    }
    num += i;
    if (onmei.includes('#')) {
      num += 1;
    }
    if (onmei.includes('b')) {
      num -= 1;
    }
  num = num % 12;
  return num;
  }
  const transpose = (chord, i) => {

  }
  const parseTriad = (chordName) => {
    let result = chordName.replace('add9', '');
    result = chordName.replace('M9', '');
    result = chordName.replace('+9', '');
    result = chordName.replace('M7', '');
    result = chordName.replace('7', '');
    result = chordName.replace('69', '');
    result = chordName.replace('9', '');
    result = chordName.replace('dim', 'm-5');
    return result;
  }
  const kouseion = (chord) => {
    const chordName = parseTriad(chord);
    // それぞれの音が何回含まれるか配列でカウントする
    let count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    if (chordName.includes('/')) {
      // 分数コードの場合
      const root = chordName.split('/')[1];
      count[parseNum(root, 0)] += 1;
      const bunshi = parseTriad(chordName.split('/')[0]);

      if (bunshi.includes('sus2')) {
        count[parseNum(bunshi.replace('sus2'), 0)] += 1;
        count[parseNum(bunshi.replace('sus2'), 2)] += 1;
        count[parseNum(bunshi.replace('sus2'), 7)] += 1;

      } else if (bunshi.includes('sus4')) {
        count[parseNum(bunshi.replace('sus4'), 0)] += 1;
        count[parseNum(bunshi.replace('sus4'), 5)] += 1;
        count[parseNum(bunshi.replace('sus4'), 7)] += 1;

      } else if (bunshi.includes('aug')) {
        count[parseNum(bunshi.replace('aug'), 0)] += 1;
        count[parseNum(bunshi.replace('aug'), 4)] += 1;
        count[parseNum(bunshi.replace('aug'), 8)] += 1;

      } else if (bunshi.includes('m-5')) {
        count[parseNum(bunshi.replace('m-5'), 0)] += 1;
        count[parseNum(bunshi.replace('m-5'), 3)] += 1;
        count[parseNum(bunshi.replace('m-5'), 6)] += 1;

      } else if (bunshi.includes('-5')) {
        count[parseNum(bunshi.replace('-5'), 0)] += 1;
        count[parseNum(bunshi.replace('-5'), 4)] += 1;
        count[parseNum(bunshi.replace('-5'), 6)] += 1;

      } else if (bunshi.includes('m')) {
        count[parseNum(bunshi.replace('m'), 0)] += 1;
        count[parseNum(bunshi.replace('m'), 3)] += 1;
        count[parseNum(bunshi.replace('m'), 7)] += 1;

      } else {
        count[parseNum(bunshi, 0)] += 1;
        count[parseNum(bunshi, 4)] += 1;
        count[parseNum(bunshi, 7)] += 1;

      }
    } else {
      // 分数コード以外の場合
      const bunshi = chordName;

      if (bunshi.includes('sus2')) {
        count[parseNum(bunshi.replace('sus2'), 0)] += 2;
        count[parseNum(bunshi.replace('sus2'), 2)] += 1;
        count[parseNum(bunshi.replace('sus2'), 7)] += 1;

      } else if (bunshi.includes('sus4')) {
        count[parseNum(bunshi.replace('sus4'), 0)] += 2;
        count[parseNum(bunshi.replace('sus4'), 5)] += 1;
        count[parseNum(bunshi.replace('sus4'), 7)] += 1;

      } else if (bunshi.includes('aug')) {
        count[parseNum(bunshi.replace('aug'), 0)] += 2;
        count[parseNum(bunshi.replace('aug'), 4)] += 1;
        count[parseNum(bunshi.replace('aug'), 8)] += 1;

      } else if (bunshi.includes('m-5')) {
        count[parseNum(bunshi.replace('m-5'), 0)] += 2;
        count[parseNum(bunshi.replace('m-5'), 3)] += 1;
        count[parseNum(bunshi.replace('m-5'), 6)] += 1;

      } else if (bunshi.includes('-5')) {
        count[parseNum(bunshi.replace('-5'), 0)] += 2;
        count[parseNum(bunshi.replace('-5'), 4)] += 1;
        count[parseNum(bunshi.replace('-5'), 6)] += 1;

      } else if (bunshi.includes('m')) {
        count[parseNum(bunshi.replace('m'), 0)] += 2;
        count[parseNum(bunshi.replace('m'), 3)] += 1;
        count[parseNum(bunshi.replace('m'), 7)] += 1;

      } else {
        count[parseNum(bunshi, 0)] += 2;
        count[parseNum(bunshi, 4)] += 1;
        count[parseNum(bunshi, 7)] += 1;

      }
    }
    return count;
  }
  const chordSimilarity = (chord1, chord2) => {
    const kousei1 = kouseion(chord1);
    const kousei2 = kouseion(chord2);
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += (kousei1[i] - kousei2 [i]) ** 2;
    }
    return 1 - Math.sqrt(sum / 12);
  }
  const chordProgressionSimilarity = (a, b) => {
    let chordP1 = a;
    let chordP2 = b;
    let result = 0;
    for (let i = 0; i < 8; i++) {
      if (chordP1[i] == '') {
        chordP1[i] = chordP1[i - 1]
      }
      if (chordP2[i] == '') {
        chordP2[i] = chordP2[i - 1]
      }
      result += chordSimilarity(chordP1[i], chordP2[i]);
    }
    return result / 8;
  }
  console.log(chordSimilarity('Am', 'Cm/Eb'));
  const chordP1 = ['C/E','F' , 'G','G#dim' , 'Am', 'G', 'F','Fm/G'];
  const chordP2 = ['C', '' ,'G', 'G#dim', 'Am', '' , 'Gm', 'C'];
  console.log('[' + chordP1 + '] と\n[' + chordP2 + '] の\nコード進行の類似度は\n' + chordProgressionSimilarity(chordP1, chordP2))
}
