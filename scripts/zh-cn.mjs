import * as OpenCC from 'opencc-js';

// Traditional (Taiwan, with phrase conversion) → Simplified (Mainland).
// Phrase conversion would also rewrite official names, so those are restored afterwards.
const convert = OpenCC.Converter({ from: 'twp', to: 'cn' });
const PROTECTED = [
  ['数学暨信息教育学系', '数学暨资讯教育学系'],
];

export function toZhCn(text) {
  let out = convert(text);
  for (const [converted, official] of PROTECTED) out = out.replaceAll(converted, official);
  return out;
}
