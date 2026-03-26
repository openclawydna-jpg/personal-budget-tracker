import { useState } from 'react';
import { useData } from './DataContext';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageContext';
import { 
  TrendingDown, 
  TrendingUp, 
  Home as HomeIcon, 
  CreditCard,
  AlertCircle,
  PiggyBank,
  Plus,
  Eye,
  EyeOff,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

export function Dashboard() {
  const { expenses, investments, renovations, mortgages, budgets, savingsBalance, addSavings } = useData();
  const { isDark } = useTheme();
  const { language, t } = useLanguage();
  
  const [savingsInput, setSavingsInput] = useState('');
  const [showSavings, setShowSavings] = useState(true);

  const handleAddSavings = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(savingsInput);
    if (!isNaN(amount) && amount > 0) {
      addSavings(amount);
      setSavingsInput('');
    }
  };

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalInvestments = investments.reduce((sum, i) => sum + i.amount, 0);
  const totalInvestmentReturns = investments.reduce((sum, i) => {
    return sum + (i.amount * i.actualReturn) / 100;
  }, 0);
  const totalRenovation = renovations.reduce((sum, r) => sum + r.cost, 0);
  const totalMortgageRemaining = mortgages.reduce((sum, m) => {
    const monthsPassed = Math.floor(
      (Date.now() - new Date(m.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    const totalPaid = Math.min(monthsPassed * m.monthlyPayment, m.amount);
    return sum + (m.amount - totalPaid);
  }, 0);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyExpenses = expenses.filter(e => {
    const date = new Date(e.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).reduce((sum, e) => sum + e.amount, 0);

  // Expense breakdown by category for pie chart
  const expensesByCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  const COLORS = ['#c4432b', '#2d7d6f', '#3d5a80', '#e09f3e', '#9b5de5', '#e07a5f'];

  // Monthly trend (last 6 months)
  const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (5 - i));
    const month = date.getMonth();
    const year = date.getFullYear();
    
    const monthExp = expenses.filter(e => {
      const eDate = new Date(e.date);
      return eDate.getMonth() === month && eDate.getFullYear() === year;
    }).reduce((sum, e) => sum + e.amount, 0);

    return {
      name: date.toLocaleDateString('en-US', { month: 'short' }),
      amount: monthExp
    };
  });

  // Budget warnings
  const budgetWarnings = Object.entries(budgets).map(([category, limit]) => {
    const spent = expensesByCategory[category] || 0;
    const percentage = (spent / limit) * 100;
    return { category, spent, limit, percentage };
  }).filter(w => w.percentage > 80);

  // Last month comparison
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const lastMonthExpenses = expenses.filter(e => {
    const date = new Date(e.date);
    return date.getMonth() === lastMonthDate.getMonth() && date.getFullYear() === lastMonthDate.getFullYear();
  }).reduce((sum, e) => sum + e.amount, 0);
  
  const monthlyChange = lastMonthExpenses > 0 
    ? ((monthlyExpenses - lastMonthExpenses) / lastMonthExpenses * 100)
    : 0;

  // Get current greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.goodMorning;
    if (hour < 18) return t.goodAfternoon;
    return t.goodEvening;
  };

  // Helper to translate category names
  const translateCategory = (category: string) => {
    const categoryMap: Record<string, string> = {
      food: t.food,
      transport: t.transport,
      entertainment: t.entertainment,
      utilities: t.utilities,
      healthcare: t.healthcare,
      other: t.other,
    };
    return categoryMap[category.toLowerCase()] || category;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', lineHeight: 1.2 }}>
          {getGreeting()}
        </h1>
        <p className="text-muted-foreground mt-1">
          {new Date().toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Savings Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-foreground text-background p-6 md:p-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <PiggyBank size={20} className="opacity-60" />
              <span className="text-sm opacity-60 tracking-wide uppercase">{t.currentSavings}</span>
              <button
                onClick={() => setShowSavings(!showSavings)}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors opacity-60 hover:opacity-100"
                title={showSavings ? 'Hide balance' : 'Show balance'}
              >
                {showSavings ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={showSavings ? 'shown' : 'hidden'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                style={{ fontFamily: 'var(--font-display)' }}
                className="text-5xl md:text-6xl tracking-tight"
              >
                {showSavings ? `$${savingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$ ******'}
              </motion.div>
            </AnimatePresence>
            <p className="text-sm opacity-50">
              {language === 'zh' ? '記錄支出時自動減少' : 'Automatically decreases when you log an expense'}
            </p>
          </div>

          <form onSubmit={handleAddSavings} className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40">$</span>
              <input
                type="number"
                value={savingsInput}
                onChange={(e) => setSavingsInput(e.target.value)}
                placeholder="0.00"
                className="w-36 pl-7 pr-3 py-2.5 bg-white/10 border border-white/15 rounded-xl text-background placeholder:text-background/30 focus:bg-white/15 focus:border-white/25 outline-none transition-all"
                required
                min="0.01"
                step="0.01"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-white/15 hover:bg-white/25 border border-white/15 rounded-xl transition-all active:scale-95"
            >
              <Plus size={16} />
              <span className="text-sm">{t.add}</span>
            </button>
          </form>
        </div>
      </motion.div>

      {/* Metric Cards - 2x2 grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: t.thisMonth,
            value: `$${monthlyExpenses.toLocaleString()}`,
            icon: TrendingDown,
            change: monthlyChange,
            accent: 'bg-[#c4432b]/10 text-[#c4432b] dark:bg-[#e07a5f]/10 dark:text-[#e07a5f]'
          },
          {
            label: t.investments,
            value: `$${(totalInvestments + totalInvestmentReturns).toLocaleString()}`,
            icon: TrendingUp,
            change: totalInvestments > 0 ? (totalInvestmentReturns / totalInvestments) * 100 : 0,
            accent: 'bg-[#2d7d6f]/10 text-[#2d7d6f] dark:bg-[#81b29a]/10 dark:text-[#81b29a]'
          },
          {
            label: t.renovation,
            value: `$${totalRenovation.toLocaleString()}`,
            icon: HomeIcon,
            accent: 'bg-[#3d5a80]/10 text-[#3d5a80] dark:bg-[#6d97b5]/10 dark:text-[#6d97b5]'
          },
          {
            label: language === 'zh' ? '剩餘貸款' : 'Mortgage left',
            value: `$${totalMortgageRemaining.toLocaleString()}`,
            icon: CreditCard,
            accent: 'bg-[#9b5de5]/10 text-[#9b5de5] dark:bg-[#b892e0]/10 dark:text-[#b892e0]'
          }
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-card border border-border rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground tracking-wide uppercase">{card.label}</span>
                <div className={`p-2 rounded-lg ${card.accent}`}>
                  <Icon size={16} />
                </div>
              </div>
              <p className="text-2xl tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                {card.value}
              </p>
              {card.change !== undefined && (
                <div className={`flex items-center gap-1 text-xs ${card.change >= 0 ? 'text-[#c4432b] dark:text-[#e07a5f]' : 'text-[#2d7d6f] dark:text-[#81b29a]'}`}>
                  {card.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  <span>{Math.abs(card.change).toFixed(1)}% {t.vsLastMonth}</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Budget Alerts */}
      {budgetWarnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#e09f3e]/8 border border-[#e09f3e]/20 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={18} className="text-[#e09f3e]" />
            <span className="text-sm tracking-wide uppercase text-[#e09f3e]">{t.budgetAlerts}</span>
          </div>
          <div className="space-y-3">
            {budgetWarnings.map(w => (
              <div key={w.category} className="flex items-center gap-4">
                <span className="text-sm w-28 shrink-0">{translateCategory(w.category)}</span>
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#e09f3e] rounded-full transition-all"
                    style={{ width: `${Math.min(w.percentage, 100)}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-20 text-right">
                  {w.percentage.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm text-muted-foreground tracking-wide uppercase">{t.spendingTrend}</h2>
            <span className="text-xs text-muted-foreground">{language === 'zh' ? '過去6個月' : 'Last 6 months'}</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isDark ? '#e07a5f' : '#c4432b'} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={isDark ? '#e07a5f' : '#c4432b'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: isDark ? '#8a8578' : '#8a8578' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#8a8578' }}
                width={50}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1c1a17' : '#ffffff',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, language === 'zh' ? '已花費' : 'Spent']}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke={isDark ? '#e07a5f' : '#c4432b'}
                strokeWidth={2}
                fill="url(#areaGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-card border border-border rounded-2xl p-6"
        >
          <h2 className="text-sm text-muted-foreground tracking-wide uppercase mb-4">{t.byCategory}</h2>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    strokeWidth={0}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1c1a17' : '#ffffff',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                      borderRadius: '12px',
                      fontSize: '0.85rem'
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-2">
                {pieData.slice(0, 4).map((entry, i) => (
                  <div key={entry.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-muted-foreground">{translateCategory(entry.name.toLowerCase())}</span>
                    </div>
                    <span>${entry.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[240px] flex items-center justify-center text-muted-foreground text-sm">
              {t.noDataYet}
            </div>
          )}
        </motion.div>
      </div>

      {/* Summary row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-3 gap-4"
      >
        {[
          { label: t.totalTransactions, value: expenses.length + investments.length + renovations.length },
          { label: t.investmentROI, value: totalInvestments > 0 ? `${((totalInvestmentReturns / totalInvestments) * 100).toFixed(1)}%` : '0%' },
          { label: t.activeMortgages, value: mortgages.length },
        ].map(item => (
          <div key={item.label} className="bg-card border border-border rounded-2xl p-5 text-center">
            <p className="text-3xl tracking-tight mb-1" style={{ fontFamily: 'var(--font-display)' }}>{item.value}</p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}