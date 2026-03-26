import { useState } from 'react';
import { useData } from './DataContext';
import { Plus, Trash2, Edit2, CreditCard, Calendar, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function MortgageTracker() {
  const { mortgages, addMortgage, deleteMortgage, updateMortgage } = useData();
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '', amount: '', rate: '', term: '', monthlyPayment: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  const calculateMonthlyPayment = (principal: number, annualRate: number, months: number) => {
    if (annualRate === 0) return principal / months;
    const r = annualRate / 100 / 12;
    return principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  };

  const handleAutoCalculate = () => {
    const p = parseFloat(formData.amount), r = parseFloat(formData.rate), m = parseFloat(formData.term);
    if (p && !isNaN(r) && m) setFormData({ ...formData, monthlyPayment: calculateMonthlyPayment(p, r, m).toFixed(2) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name: formData.name, amount: parseFloat(formData.amount), rate: parseFloat(formData.rate), term: parseFloat(formData.term), monthlyPayment: parseFloat(formData.monthlyPayment), startDate: formData.startDate };
    if (editingId) { updateMortgage(editingId, data); setEditingId(null); }
    else { addMortgage(data); }
    setFormData({ name: '', amount: '', rate: '', term: '', monthlyPayment: '', startDate: new Date().toISOString().split('T')[0] });
    setShowForm(false);
  };

  const handleEdit = (m: typeof mortgages[0]) => {
    setFormData({ name: m.name, amount: m.amount.toString(), rate: m.rate.toString(), term: m.term.toString(), monthlyPayment: m.monthlyPayment.toString(), startDate: m.startDate });
    setEditingId(m.id); setShowForm(true);
  };

  const getMortgageDetails = (m: typeof mortgages[0]) => {
    const start = new Date(m.startDate);
    const monthsPassed = Math.max(0, Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    const totalInterest = (m.monthlyPayment * m.term) - m.amount;
    const principalPaid = Math.min(monthsPassed * m.monthlyPayment, m.amount);
    const remaining = Math.max(0, m.amount - principalPaid);
    const progress = ((Math.min(monthsPassed, m.term)) / m.term) * 100;
    const next = new Date(start); next.setMonth(next.getMonth() + monthsPassed + 1);
    return { monthsPassed: Math.min(monthsPassed, m.term), totalInterest, remaining, progress, next, done: monthsPassed >= m.term };
  };

  const totalRemaining = mortgages.reduce((s, m) => s + getMortgageDetails(m).remaining, 0);
  const totalMonthly = mortgages.reduce((s, m) => s + m.monthlyPayment, 0);

  const inputCls = "w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:border-foreground/20 outline-none transition-all text-sm";

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', lineHeight: 1.2 }}>Mortgage & Loans</h1>
          <p className="text-muted-foreground mt-1 text-sm">Track payments and progress</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: '', amount: '', rate: '', term: '', monthlyPayment: '', startDate: new Date().toISOString().split('T')[0] }); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-xl transition-all active:scale-95 text-sm">
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Add loan'}
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Remaining', value: `$${totalRemaining.toLocaleString()}`, icon: CreditCard, color: 'text-[#c4432b] dark:text-[#e07a5f]' },
          { label: 'Monthly', value: `$${totalMonthly.toLocaleString()}`, icon: Calendar, color: 'text-[#3d5a80] dark:text-[#6d97b5]' },
          { label: 'Active loans', value: mortgages.length.toString(), color: 'text-[#2d7d6f] dark:text-[#81b29a]' },
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
            <h2 className="text-sm text-muted-foreground tracking-wide uppercase mb-4">{editingId ? 'Edit loan' : 'New loan'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><label className="block text-xs text-muted-foreground mb-1.5">Loan Name</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputCls} placeholder="Home Mortgage" /></div>
                <div><label className="block text-xs text-muted-foreground mb-1.5">Amount ($)</label><input type="number" step="0.01" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className={inputCls} placeholder="250000" /></div>
                <div><label className="block text-xs text-muted-foreground mb-1.5">Rate (%)</label><input type="number" step="0.01" required value={formData.rate} onChange={e => setFormData({...formData, rate: e.target.value})} className={inputCls} placeholder="3.5" /></div>
                <div><label className="block text-xs text-muted-foreground mb-1.5">Term (months)</label><input type="number" required value={formData.term} onChange={e => setFormData({...formData, term: e.target.value})} className={inputCls} placeholder="360" /></div>
                <div><label className="block text-xs text-muted-foreground mb-1.5">Start Date</label><input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className={inputCls} /></div>
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-muted-foreground">Monthly Payment ($)</label>
                    <button type="button" onClick={handleAutoCalculate} className="text-xs text-muted-foreground hover:text-foreground underline transition-colors">Auto calculate</button>
                  </div>
                  <input type="number" step="0.01" required value={formData.monthlyPayment} onChange={e => setFormData({...formData, monthlyPayment: e.target.value})} className={inputCls} placeholder="1200" />
                </div>
              </div>
              <button type="submit" className="px-6 py-2.5 bg-foreground text-background rounded-xl text-sm transition-all active:scale-95">{editingId ? 'Update' : 'Save loan'}</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="space-y-4">
        {mortgages.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center"><p className="text-muted-foreground text-sm">No loans yet</p></div>
        ) : mortgages.map((m, i) => {
          const d = getMortgageDetails(m);
          return (
            <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-2xl p-6 hover:border-foreground/10 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>{m.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-lg">{m.rate}% APR</span>
                    {d.done && <span className="text-xs text-[#2d7d6f] dark:text-[#81b29a] bg-[#2d7d6f]/10 dark:bg-[#81b29a]/10 px-2 py-0.5 rounded-lg">Paid off</span>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(m)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => deleteMortgage(m.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-[#c4432b] hover:bg-[#c4432b]/10 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Progress</span>
                  <span>{d.monthsPassed} / {m.term} months ({d.progress.toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${d.progress}%` }} transition={{ duration: 0.8 }}
                    className="h-1.5 rounded-full bg-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { l: 'Original', v: `$${m.amount.toLocaleString()}` },
                  { l: 'Remaining', v: `$${d.remaining.toLocaleString()}` },
                  { l: 'Total Interest', v: `$${d.totalInterest.toLocaleString()}` },
                  { l: 'Monthly', v: `$${m.monthlyPayment.toLocaleString()}` },
                ].map(item => (
                  <div key={item.l} className="bg-secondary rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">{item.l}</p>
                    <p style={{ fontFamily: 'var(--font-display)' }}>{item.v}</p>
                  </div>
                ))}
              </div>

              {!d.done && (
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar size={14} />
                  <span>Next: {d.next.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} &mdash; ${m.monthlyPayment.toLocaleString()}</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
