import * as OpenCC from 'opencc-js';

// Traditional (Taiwan, with phrase conversion) → Simplified (Mainland).
// Phrase conversion would also rewrite official names, so those are restored afterwards.
const convert = OpenCC.Converter({ from: 'twp', to: 'cn' });
const PROTECTED = [
  ['数学暨信息教育学系', '数学暨资讯教育学系'],
  ['帐册', '账册'],   // 帳冊 (ledger): 账 is the Mainland form for account books
  ['目录档', '目录文件'],
  ['来源档', '来源文件'],
  ['设置框架', '设定框架'],
  ['脱机', '离线'],
  ['统计进程', '统计程序'],
  ['万用', '通用'],
  ['测试品质', '测试质量'],
  ['语意', '语义'],
  ['终端机', '终端'],
  ['音档', '音频文件'],
  ['同侪审查', '同行评审'],
  ['履历', '简历'],
  ['回传', '返回'],
  ['透过', '通过'],
  ['建置', '构建'],
  ['导览', '导航'],
  ['印出', '显示'],
  ['预先登录', '预先注册'],
  ['示范', '演示'],
  ['扩充', '扩展'],
  ['课纲', '课程大纲'],
  ['视频', '影片'],
];

export function toZhCn(text) {
  let out = convert(text);
  for (const [converted, official] of PROTECTED) out = out.replaceAll(converted, official);
  return out;
}
