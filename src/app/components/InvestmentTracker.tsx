import { useState } from 'react';
import { useData } from './DataContext';
import { Plus, Trash2, Edit2, TrendingUp, TrendingDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function InvestmentTracker() {
  const { investments, addInvestment, deleteInvestment, updateInvestment } = useData();
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'stock',
    expectedReturn: '',
    actualReturn: ''
  });

  const investmentTypes = ['stock', 'fund', 'business', 'crypto', 'real estate', 'bonds', 'other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      amount: parseFloat(formData.amount),
      date: formData.date,
      type: formData.type,
      expectedReturn: parseFloat(formData.expectedReturn),
      actualReturn: parseFloat(formData.actualReturn)
    };
    if (editingId) {
      updateInvestment(editingId, data);
      setEditingId(null);
    } else {
      addInvestment(data);
    }
    setFormData({ amount: '', date: new Date().toISOString().split('T')[0], type: 'stock', expectedReturn: '', actualReturn: '' });
    setShowForm(false);
  };

  const handleEdit = (inv: typeof investments[0]) => {
    setFormData({
      amount: inv.amount.toString(),
      date: inv.date,
      type: inv.type,
      expectedReturn: inv.expectedReturn.toString(),
      actualReturn: inv.actualReturn.toString()
    });
    setEditingId(inv.id);
    setShowForm(true);
  };

  const totalInvested = investments.reduce((s, i) => s + i.amount, 0);
  const totalReturns = investments.reduce((s, i) => s + (i.amount * i.actualReturn) / 100, 0);
  const totalValue = totalInvested + totalReturns;
  const overallROI = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;

  const inputCls = "w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:border-foreground/20 outline-none transition-all text-sm";

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', lineHeight: 1.2 }}>Investments</h1>
          <p className="text-muted-foreground mt-1 text-sm">Track your portfolio performance</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ amount: '', date: new Date().toISOString().split('T')[0], type: 'stock', expectedReturn: '', actualReturn: '' }); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-xl transition-all active:scale-95 text-sm"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Add investment'}
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Invested', value: `$${totalInvested.toLocaleString()}`, color: 'text-[#3d5a80] dark:text-[#6d97b5]' },
          { label: 'Returns', value: `$${totalReturns.toLocaleString()}`, color: totalReturns >= 0 ? 'text-[#2d7d6f] dark:text-[#81b29a]' : 'text-[#c4432b] dark:text-[#e07a5f]' },
          { label: 'Total Value', value: `$${totalValue.toLocaleString()}`, color: 'text-[#9b5de5] dark:text-[#b892e0]' },
          { label: 'ROI', value: `${overallROI.toFixed(1)}%`, color: overallROI >= 0 ? 'text-[#2d7d6f] dark:text-[#81b29a]' : 'text-[#c4432b] dark:text-[#e07a5f]' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="bg-card border border-border rounded-2xl p-5">
            <p className="text-xs text-muted-foreground tracking-wide uppercase mb-2">{s.label}</p>
            <p className={`text-2xl tracking-tight ${s.color}`} style={{ fontFamily: 'var(--font-display)' }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-sm text-muted-foreground tracking-wide uppercase mb-4">{editingId ? 'Edit investment' : 'New investment'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div><label className="block text-xs text-muted-foreground mb-1.5">Amount ($)</label><input type="number" step="0.01" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className={inputCls} placeholder="10000" /></div>
                <div><label className="block text-xs text-muted-foreground mb-1.5">Type</label><select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className={inputCls}>{investmentTypes.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                <div><label className="block text-xs text-muted-foreground mb-1.5">Date</label><input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className={inputCls} /></div>
                <div><label className="block text-xs text-muted-foreground mb-1.5">Expected Return (%)</label><input type="number" step="0.01" required value={formData.expectedReturn} onChange={e => setFormData({...formData, expectedReturn: e.target.value})} className={inputCls} placeholder="15.5" /></div>
                <div><label className="block text-xs text-muted-foreground mb-1.5">Actual Return (%)</label><input type="number" step="0.01" required value={formData.actualReturn} onChange={e => setFormData({...formData, actualReturn: e.target.value})} className={inputCls} placeholder="12.3" /></div>
              </div>
              <button type="submit" className="px-6 py-2.5 bg-foreground text-background rounded-xl text-sm transition-all active:scale-95">{editingId ? 'Update' : 'Save investment'}</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="space-y-2">
        {investments.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center"><p className="text-muted-foreground text-sm">No investments yet</p></div>
        ) : investments.map((inv, index) => {
          const ret = (inv.amount * inv.actualReturn) / 100;
          const perf = inv.actualReturn - inv.expectedReturn;
          return (
            <motion.div key={inv.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}
              className="bg-card border border-border rounded-xl p-5 hover:border-foreground/10 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-secondary text-muted-foreground rounded-lg text-xs capitalize">{inv.type}</span>
                    <span className="text-xs text-muted-foreground">{new Date(inv.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div><p className="text-xs text-muted-foreground mb-0.5">Invested</p><p style={{ fontFamily: 'var(--font-display)' }}>${inv.amount.toLocaleString()}</p></div>
                    <div><p className="text-xs text-muted-foreground mb-0.5">Value</p><p style={{ fontFamily: 'var(--font-display)' }}>${(inv.amount + ret).toLocaleString()}</p></div>
                    <div><p className="text-xs text-muted-foreground mb-0.5">P/L</p><p className={ret >= 0 ? 'text-[#2d7d6f] dark:text-[#81b29a]' : 'text-[#c4432b] dark:text-[#e07a5f]'} style={{ fontFamily: 'var(--font-display)' }}>{ret >= 0 ? '+' : ''}${ret.toLocaleString()}</p></div>
                    <div><p className="text-xs text-muted-foreground mb-0.5">ROI</p><div className="flex items-center gap-1"><span style={{ fontFamily: 'var(--font-display)' }} className={inv.actualReturn >= 0 ? 'text-[#2d7d6f] dark:text-[#81b29a]' : 'text-[#c4432b] dark:text-[#e07a5f]'}>{inv.actualReturn.toFixed(1)}%</span>{inv.actualReturn >= inv.expectedReturn ? <TrendingUp size={14} className="text-[#2d7d6f]" /> : <TrendingDown size={14} className="text-[#c4432b]" />}</div></div>
                  </div>
                  <div className="text-xs text-muted-foreground bg-secondary rounded-lg px-3 py-2 inline-flex gap-2">
                    <span>Expected: {inv.expectedReturn}%</span>
                    <span className="opacity-30">|</span>
                    <span className={perf >= 0 ? 'text-[#2d7d6f] dark:text-[#81b29a]' : 'text-[#c4432b] dark:text-[#e07a5f]'}>{perf >= 0 ? '+' : ''}{perf.toFixed(1)}% vs expected</span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => handleEdit(inv)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => deleteInvestment(inv.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-[#c4432b] hover:bg-[#c4432b]/10 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
