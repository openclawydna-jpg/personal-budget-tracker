import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from './DataContext';
import { useLanguage } from './LanguageContext';
import { Sparkles, Heart, HeartCrack, Coins, X } from 'lucide-react';

export function BudgetBuddy() {
  const { savingsBalance, expenses, budgets } = useData();
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [greeting, setGreeting] = useState('');

  const xp = expenses.length * 10 + (savingsBalance > 0 ? 50 : 0);
  const level = Math.floor(xp / 100) + 1;
  const xpProgress = xp % 100;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyExpenses = expenses
    .filter(e => {
      const date = new Date(e.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const totalBudget = Object.values(budgets).reduce((sum, val) => sum + val, 0);
  const budgetHealth = totalBudget > 0 ? monthlyExpenses / totalBudget : 0;

  let mood = 'happy';
  let face = '\u{1F638}';
  let message = language === 'zh' ? '你做得很好！繼續加油！' : "You're doing great! Keep it up!";

  if (savingsBalance <= 0 && expenses.length > 0) {
    mood = 'sad';
    face = '\u{1F63F}';
    message = language === 'zh' ? '糟糕，儲蓄用完了！快來多存點吧。' : "Oh no, we're out of savings! Let's save some more.";
  } else if (budgetHealth > 0.9) {
    mood = 'worried';
    face = '\u{1F640}';
    message = language === 'zh' ? '注意，我們快要達到預算上限了！' : "Watch out, we are getting close to the budget limit!";
  } else if (budgetHealth < 0.5 && savingsBalance > 0) {
    mood = 'excited';
    face = '\u{1F63B}';
    message = language === 'zh' ? '哇，你的儲蓄看起來很棒！' : "Wow, your savings are looking amazing!";
  }

  useEffect(() => {
    if (isOpen) {
      const greetings = language === 'zh' 
        ? [
            "喵！來看看我們的財務狀況吧！",
            "呼嚕嚕...今天感覺很有錢呢？",
            "我喜歡和你一起追蹤預算！",
            "是時候來點財務魔法了！",
          ]
        : [
            "Meow! Let's check those finances!",
            "Purrr... feeling wealthy today?",
            "I love tracking budgets with you!",
            "Time for some financial magic!",
          ];
      setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
    }
  }, [isOpen, language]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            className="mb-3 w-72 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
          >
            <div className="bg-foreground text-background p-4 relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 p-1 hover:bg-white/10 rounded-full transition-colors opacity-60 hover:opacity-100"
              >
                <X size={14} />
              </button>
              <div className="flex items-center gap-2 text-sm">
                <Sparkles size={14} className="opacity-60" />
                <span className="opacity-60">{language === 'zh' ? '預算小夥伴' : 'Budget Buddy'}</span>
                <span className="ml-auto text-xs opacity-40">{language === 'zh' ? `等級 ${level}` : `Lv.${level}`}</span>
              </div>
              <p className="text-xs opacity-40 mt-1 italic">{greeting}</p>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl bg-secondary p-2 rounded-xl">{face}</div>
                <p className="text-sm text-muted-foreground leading-snug">{message}</p>
              </div>

              {/* XP Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{language === 'zh' ? '經驗值' : 'XP'}</span>
                  <span>{xpProgress}/100</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    className="h-full bg-[#2d7d6f] dark:bg-[#81b29a] rounded-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 bg-secondary text-muted-foreground p-2 rounded-lg">
                  <Coins size={13} />
                  <span>{savingsBalance > 0 ? (language === 'zh' ? '儲蓄安全' : 'Savings safe') : (language === 'zh' ? '需要儲蓄' : 'Need savings')}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-secondary text-muted-foreground p-2 rounded-lg">
                  {mood === 'worried' || mood === 'sad' ? <HeartCrack size={13} /> : <Heart size={13} />}
                  <span>{budgetHealth > 0.9 ? (language === 'zh' ? '預算緊張' : 'Budget tight') : (language === 'zh' ? '預算正常' : 'Budget OK')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-14 h-14 bg-foreground text-background rounded-full shadow-lg transition-shadow duration-300 hover:shadow-xl"
      >
        <span className="text-2xl translate-y-[1px]">{face}</span>
        <div className="absolute -bottom-1.5 -right-1.5 bg-[#2d7d6f] dark:bg-[#81b29a] text-white dark:text-[#141210] text-[10px] px-1.5 py-0.5 rounded-full border-2 border-background">
          {level}
        </div>
        {mood === 'sad' && (
          <span className="absolute flex h-3 w-3 -top-0.5 -right-0.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c4432b] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#c4432b]" />
          </span>
        )}
      </motion.button>
    </div>
  );
}