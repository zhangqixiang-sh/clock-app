import type { Language } from '../types';

// 格式化数字时间为数字显示
export function formatTimeDigital(h: number, m: number): string {
  let mInt = Math.round(m);
  let hInt = Math.round(h);
  if (mInt < 0 || mInt >= 60) {
    hInt += Math.floor(mInt / 60);
    mInt = ((mInt % 60) + 60) % 60;
  }
  const hNorm = ((hInt % 12) + 12) % 12;
  const h12 = hNorm === 0 ? 12 : hNorm;
  return String(h12) + ':' + String(mInt).padStart(2, '0');
}

const zhDigits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

function formatTimeZh(h: number, m: number): string {
  let mInt = Math.round(m);
  let hInt = Math.round(h);
  if (mInt < 0 || mInt >= 60) {
    hInt += Math.floor(mInt / 60);
    mInt = ((mInt % 60) + 60) % 60;
  }
  const hNorm = ((hInt % 12) + 12) % 12;
  const hh = hNorm === 0 ? 12 : hNorm;
  const hStr = zhDigits[hh];
  if (mInt === 0) return hStr + '点整';
  if (mInt === 15) return hStr + '点十五分';
  if (mInt === 30) return hStr + '点半';
  if (mInt === 45) return hStr + '点四十五分';
  if (mInt < 10) return hStr + '点零' + zhDigits[mInt] + '分';
  if (mInt <= 10) return hStr + '点' + zhDigits[mInt] + '分';
  if (mInt < 20) return hStr + '点十' + (mInt - 10 > 0 ? zhDigits[mInt - 10] : '') + '分';
  if (mInt === 20) return hStr + '点二十分';
  const tens = Math.floor(mInt / 10);
  const ones = mInt % 10;
  const tensStr = ['', '十', '二十', '三十', '四十', '五十'][tens];
  return hStr + '点' + tensStr + (ones > 0 ? zhDigits[ones] : '') + '分';
}

const enOnes = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
  'eighteen', 'nineteen'];
const enTens = ['', '', 'twenty', 'thirty', 'forty', 'fifty'];

function numberToEn(n: number): string {
  if (n < 20) return enOnes[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return enTens[t] + (o > 0 ? '-' + enOnes[o] : '');
}

function formatTimeEn(h: number, m: number): string {
  let mInt = Math.round(m);
  let hInt = Math.round(h);
  if (mInt < 0 || mInt >= 60) {
    hInt += Math.floor(mInt / 60);
    mInt = ((mInt % 60) + 60) % 60;
  }
  const hNorm = ((hInt % 12) + 12) % 12;
  const hh = hNorm === 0 ? 12 : hNorm;
  const hStr = enOnes[hh];
  if (mInt === 0) return hStr + " o'clock";
  if (mInt === 15) return 'quarter past ' + hStr;
  if (mInt === 30) return 'half past ' + hStr;
  if (mInt === 45) {
    const next = hh === 12 ? 1 : hh + 1;
    return 'quarter to ' + enOnes[next];
  }
  if (mInt < 10) return hStr + ' oh ' + enOnes[mInt];
  return hStr + ' ' + numberToEn(mInt);
}

export function formatTimeWords(h: number, m: number, lang: Language): string {
  return lang === 'zh' ? formatTimeZh(h, m) : formatTimeEn(h, m);
}
