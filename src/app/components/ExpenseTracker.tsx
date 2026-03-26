import { useState } from 'react';
import { useData } from './DataContext';
import { useLanguage } from './LanguageContext';
import { Plus, Search, Trash2, Edit2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ExpenseTracker() {
  const { expenses, addExpense, deleteExpense, updateExpense, budgets } = useData();
  const { language, t } = useLanguage();
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [formData, setFormData] = useState({
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const categories = ['food', 'transport', 'shopping', 'entertainment', 'utilities', 'health', 'other'];

  // Helper to translate category names
  const translateCategory = (category: string) => {
    const categoryMap: Record<string, string> = {
      food: t.food,
      transport: t.transport,
      shopping: t.shopping,
      entertainment: t.entertainment,
      utilities: t.utilities,
      health: t.health,
      other: t.other,
    };
    return categoryMap[category.toLowerCase()] || category;
  };

  const autoCategorize = (note: string) => {
    const keywords: Record<string, string[]> = {
      food: ['food', 'restaurant', 'grocery', 'lunch', 'dinner', 'breakfast', 'cafe', 'meal'],
      transport: ['uber', 'taxi', 'bus', 'train', 'gas', 'fuel', 'parking', 'metro'],
      shopping: ['shop', 'store', 'mall', 'amazon', 'clothes', 'shoes'],
      entertainment: ['movie', 'concert', 'game', 'netflix', 'spotify', 'ticket'],
      utilities: ['electric', 'water', 'internet', 'phone', 'bill', 'rent'],
      health: ['doctor', 'medicine', 'pharmacy', 'hospital', 'gym', 'fitness']
    };
    const lowerNote = note.toLowerCase();
    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => lowerNote.includes(word))) return category;
    }
    return 'other';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const category = formData.note ? autoCategorize(formData.note) : formData.category;
    const expenseData = {
      amount: parseFloat(formData.amount),
      category,
      date: formData.date,
      note: formData.note
    };

    if (editingId) {
      updateExpense(editingId, expenseData);
      setEditingId(null);
    } else {
      addExpense(expenseData);
    }

    setFormData({ amount: '', category: 'food', date: new Date().toISOString().split('T')[0], note: '' });
    setShowForm(false);
  };

  const handleEdit = (expense: typeof expenses[0]) => {
    setFormData({
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
      note: expense.note
    });
    setEditingId(expense.id);
    setShowForm(true);
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryColors: Record<string, string> = {
    food: '#c4432b', transport: '#2d7d6f', shopping: '#3d5a80',
    entertainment: '#e09f3e', utilities: '#9b5de5', health: '#e07a5f', other: '#8a8578'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', lineHeight: 1.2 }}>{t.expenses}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{t.trackYourSpending}</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ amount: '', category: 'food', date: new Date().toISOString().split('T')[0], note: '' });
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-xl transition-all active:scale-95 text-sm"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? t.cancel : t.addExpense}
        </button>
      </div>

      {/* Category pills */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {categories.slice(0, 5).map(cat => {
          const total = categoryTotals[cat] || 0;
          const budget = budgets[cat] || 1000;
          const pct = Math.min((total / budget) * 100, 100);
          return (
            <div key={cat} className="shrink-0 bg-card border border-border rounded-xl px-4 py-3 min-w-[120px]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColors[cat] }} />
                <span className="text-xs text-muted-foreground capitalize">{translateCategory(cat)}</span>
              </div>
              <p className="text-lg tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>${total.toFixed(0)}</p>
              <div className="w-full bg-secondary rounded-full h-1 mt-2">
                <div className="h-1 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: categoryColors[cat] }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <h2 className="text-sm text-muted-foreground tracking-wide uppercase mb-4">
              {editingId ? t.editExpense : t.newExpense}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">{t.amount}</label>
                  <input
                    type="number" step="0.01" required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:border-foreground/20 outline-none transition-all text-sm"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">{t.category}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:border-foreground/20 outline-none transition-all text-sm"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{translateCategory(cat)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">{t.date}</label>
                  <input
                    type="date" required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:border-foreground/20 outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">{t.note} ({t.autoCategorizes.toLowerCase()})</label>
                  <input
                    type="text"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:border-foreground/20 outline-none transition-all text-sm"
                    placeholder={language === 'zh' ? '例如：餐廳午餐' : 'e.g. Lunch at restaurant'}
                  />
                </div>
              </div>
              <button type="submit" className="px-6 py-2.5 bg-foreground text-background rounded-xl text-sm transition-all active:scale-95">
                {editingId ? t.update : t.saveExpense}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search / Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text" placeholder={t.search + '...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:border-foreground/20 outline-none transition-all text-sm"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-card border border-border focus:border-foreground/20 outline-none transition-all text-sm"
        >
          <option value="all">{t.all}</option>
          {categories.map(cat => <option key={cat} value={cat}>{translateCategory(cat)}</option>)}
        </select>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filteredExpenses.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <p className="text-muted-foreground text-sm">{t.noExpenses}. {t.startTracking}!</p>
          </div>
        ) : (
          filteredExpenses.map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-card border border-border rounded-xl px-5 py-4 flex items-center justify-between gap-4 hover:border-foreground/10 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: categoryColors[expense.category] || '#8a8578' }} />
                <div className="min-w-0">
                  <p className="text-sm truncate">{expense.note || t.noNote}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{translateCategory(expense.category)}</span>
                    <span className="text-xs text-muted-foreground/40">&middot;</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="tabular-nums" style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
                  ${expense.amount.toFixed(2)}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-[#c4432b] hover:bg-[#c4432b]/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}