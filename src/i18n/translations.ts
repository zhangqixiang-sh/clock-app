import type { Language } from '../types';

export const translations: Record<string, Record<Language, string>> = {
  'app.title': { zh: '🕰时钟教学', en: 'Fun Clock Learning' },
  'nav.learn': { zh: '📖 认识时钟', en: '📖 Learn' },
  'nav.practice': { zh: '🖐️ 自由练习', en: '🖐️ Practice' },
  'nav.quiz': { zh: '🎯 测验', en: '🎯 Quiz' },
  'learn.prev': { zh: '◀ 上一步', en: '◀ Back' },
  'learn.next': { zh: '下一步 ▶', en: 'Next ▶' },
  'practice.reset': { zh: '🔄 重置', en: '🔄 Reset' },
  'practice.now': { zh: '⏰ 当前时间', en: '⏰ Now' },
  'practice.snap': { zh: '吸附到5分钟', en: 'Snap to 5 min' },
  'practice.showTime': { zh: '显示时间', en: 'Show Time' },
  // Learn steps
  'learn.s1.title': { zh: '认识钟面', en: 'The Clock Face' },
  'learn.s1.text': { zh: '这是一个钟面！它是圆形的，上面有1到12这12个数字，均匀地排列在一圈上。最上面是12，最下面是6，右边是3，左边是9。钟面上还有很多小刻度线，一共有60条小格子。', en: "This is a clock face! It's round with numbers 1 to 12 arranged in a circle. 12 is at the top, 6 at the bottom, 3 on the right, and 9 on the left. There are also 60 small tick marks around the edge." },
  'learn.s2.title': { zh: '时针 — 短粗的灰色指针', en: 'Hour Hand — Short Gray One' },
  'learn.s2.text': { zh: '看，这根短短的、粗粗的灰色指针叫做"时针"。它走得最慢，它指向哪个数字，就表示现在是几点钟。比如它指向 3，就是 3 点。时针走完一圈要 12 个小时呢！', en: 'See this short, thick gray pointer? It\'s called the "hour hand". It moves the slowest. The number it points to tells us what hour it is. For example, if it points to 3, it\'s 3 o\'clock. It takes 12 hours to go all the way around!' },
  'learn.s3.title': { zh: '分针 — 细长的绿色指针', en: 'Minute Hand — Long Green One' },
  'learn.s3.text': { zh: '这根长长的绿色指针叫做"分针"。它比时针走得快。分针指向12的时候表示"整点"，指向6表示"30分"（半点）。分针走完一圈是60分钟，也就是1个小时，这时候时针就会走一格。', en: 'This long green pointer is the "minute hand". It moves faster than the hour hand. When it points to 12, it means "o\'clock" (exact hour). When it points to 6, it means 30 minutes (half past). One full turn = 60 minutes = 1 hour!' },
  'learn.s4.title': { zh: '秒针 — 最细的红色指针', en: 'Second Hand — Thin Red One' },
  'learn.s4.text': { zh: '最细的那根红色指针叫做"秒针"，它跑得最快！你看它一直在走。秒针走一圈是 60 秒，也就是 1 分钟。当秒针走完一圈的时候，分针就会往前走一小格。', en: 'The thinnest red pointer is the "second hand" — it\'s the fastest! Watch it go! One full turn = 60 seconds = 1 minute. Every time the second hand completes a turn, the minute hand moves forward one tick.' },
  'learn.s5.title': { zh: '时间的秘密', en: 'Time Secrets' },
  'learn.s5.text': { zh: '⏱️ 60秒 = 1分钟（秒针走一圈）\n⏱️ 60分钟 = 1小时（分针走一圈）\n⏱️ 12小时 = 时针走一圈\n⏱️ 24小时 = 1天（时针走两圈）\n\n所以一天里，时针要转两圈，上午一圈，下午一圈！', en: '⏱️ 60 seconds = 1 minute (second hand goes around once)\n⏱️ 60 minutes = 1 hour (minute hand goes around once)\n⏱️ 12 hours = hour hand goes around once\n⏱️ 24 hours = 1 day (hour hand goes around TWICE)\n\nSo in one day, the hour hand makes two trips around the clock!' },
  // Quiz
  'quiz.title': { zh: '测验模式', en: 'Quiz Mode' },
  'quiz.modeA': { zh: '🔍 看钟说时间', en: '🔍 Read Clock' },
  'quiz.modeB': { zh: '🖐️ 拨钟设时间', en: '🖐️ Set Clock' },
  'quiz.start': { zh: '🚀 开始测验', en: '🚀 Start Quiz' },
  'quiz.again': { zh: '🔄 再来一次', en: '🔄 Try Again' },
  'quiz.back': { zh: '◀ 返回设置', en: '◀ Back' },
  'quiz.submit': { zh: '✅ 确认提交', en: '✅ Submit' },
  'quiz.next': { zh: '下一题 ▶', en: 'Next ▶' },
  'quiz.question.a': { zh: '这个时钟显示几点？', en: 'What time does this clock show?' },
  'quiz.question.b': { zh: '请把时钟拨到：', en: 'Set the clock to:' },
  'quiz.correct': { zh: '答对了！', en: 'Correct!' },
  'quiz.wrong': { zh: '再想想哦～', en: 'Try again~' },
  'quiz.answer': { zh: '正确答案是：', en: 'The answer is: ' },
  'quiz.diff.minute': { zh: '1分钟', en: '1-min' },
  'quiz.diff.medium': { zh: '半点', en: 'Half' },
  'quiz.diff.hard': { zh: '15分钟', en: 'Quarter' },
  'quiz.diff.expert': { zh: '5分钟', en: '5-min' },
  'quiz.difficulty': { zh: '选择难度：', en: 'Difficulty:' },
  'quiz.selectMode': { zh: '选择模式：', en: 'Select Mode:' },
  // Summary
  'summary.perfect': { zh: '太棒了！你是时钟小天才！🎉', en: "Amazing! You're a Clock Master! 🎉" },
  'summary.great': { zh: '做得很好！继续加油！⭐', en: 'Great job! Keep it up! ⭐' },
  'summary.ok': { zh: '不错的尝试，多练习会更好！💪', en: 'Nice try, practice makes perfect! 💪' },
  'summary.try': { zh: '没关系，我们再试一次吧！😊', en: "It's OK, let's try again! 😊" },
  'summary.score': { zh: '你答对了 {n}/10 题', en: 'You got {n}/10 correct' },
};

export function t(key: string, lang: Language, params?: Record<string, string | number>): string {
  const entry = translations[key];
  if (!entry) return key;
  let text = entry[lang] || entry.zh;
  if (params) {
    Object.keys(params).forEach(k => {
      text = text.replace('{' + k + '}', String(params[k]));
    });
  }
  return text;
}
