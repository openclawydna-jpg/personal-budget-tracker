import { useState } from 'react';
import { useData } from './DataContext';
import { Plus, Trash2, Edit2, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function RenovationTracker() {
  const { renovations, addRenovation, deleteRenovation, updateRenovation, settings } = useData();
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    category: 'materials',
    cost: '',
    supplier: '',
    status: 'pending' as 'paid' | 'pending' | 'partial',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = ['materials', 'labor', 'furniture', 'electronics', 'appliances', 'flooring', 'painting', 'plumbing', 'electrical', 'other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { category: formData.category, cost: parseFloat(formData.cost), supplier: formData.supplier, status: formData.status, date: formData.date };
    if (editingId) { updateRenovation(editingId, data); setEditingId(null); }
    else { addRenovation(data); }
    setFormData({ category: 'materials', cost: '', supplier: '', status: 'pending', date: new Date().toISOString().split('T')[0] });
    setShowForm(false);
  };

  const handleEdit = (r: typeof renovations[0]) => {
    setFormData({ category: r.category, cost: r.cost.toString(), supplier: r.supplier, status: r.status, date: r.date });
    setEditingId(r.id);
    setShowForm(true);
  };

  const totalSpent = renovations.reduce((s, r) => s + r.cost, 0);
  const totalPaid = renovations.filter(r => r.status === 'paid').reduce((s, r) => s + r.cost, 0);
  const totalPending = renovations.filter(r => r.status === 'pending').reduce((s, r) => s + r.cost, 0);
  const budget = settings.renovationBudget;
  const budgetUsed = budget > 0 ? (totalSpent / budget) * 100 : 0;
  const remaining = budget - totalSpent;

  const inputCls = "w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:border-foreground/20 outline-none transition-all text-sm";

  const statusColors: Record<string, string> = {
    paid: 'bg-[#2d7d6f]/10 text-[#2d7d6f] dark:bg-[#81b29a]/10 dark:text-[#81b29a]',
    pending: 'bg-[#e09f3e]/10 text-[#e09f3e]',
    partial: 'bg-[#3d5a80]/10 text-[#3d5a80] dark:bg-[#6d97b5]/10 dark:text-[#6d97b5]',
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', lineHeight: 1.2 }}>Renovation</h1>
          <p className="text-muted-foreground mt-1 text-sm">Track renovation costs and budget</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ category: 'materials', cost: '', supplier: '', status: 'pending', date: new Date().toISOString().split('T')[0] }); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-xl transition-all active:scale-95 text-sm"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Add expense'}
        </button>
      </div>

      {/* Budget bar */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-foreground text-background rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
          <div>
            <p className="text-xs opacity-50 tracking-wide uppercase mb-1">Budget</p>
            <p className="text-3xl tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>${budget.toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-3 gap-6 text-sm">
            <div><p className="opacity-50 text-xs mb-0.5">Spent</p><p style={{ fontFamily: 'var(--font-display)' }}>${totalSpent.toLocaleString()}</p></div>
            <div><p className="opacity-50 text-xs mb-0.5">Remaining</p><p style={{ fontFamily: 'var(--font-display)' }}>${remaining.toLocaleString()}</p></div>
            <div><p className="opacity-50 text-xs mb-0.5">Used</p><p style={{ fontFamily: 'var(--font-display)' }}>{budgetUsed.toFixed(1)}%</p></div>
          </div>
        </div>
        <div className="w-full bg-white/15 rounded-full h-2">
          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(budgetUsed, 100)}%` }} transition={{ duration: 0.8 }}
            className={`h-2 rounded-full ${budgetUsed > 100 ? 'bg-[#c4432b]' : budgetUsed > 80 ? 'bg-[#e09f3e]' : 'bg-[#81b29a]'}`} />
        </div>
        {budgetUsed > 80 && <p className="text-xs opacity-50 mt-3">{budgetUsed > 100 ? 'Budget exceeded' : 'Approaching budget limit'}</p>}
      </motion.div>

      {/* Status cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Paid', value: totalPaid, icon: CheckCircle, color: 'text-[#2d7d6f] dark:text-[#81b29a]' },
          { label: 'Pending', value: totalPending, icon: Clock, color: 'text-[#e09f3e]' },
          { label: 'Partial', value: renovations.filter(r => r.status === 'partial').reduce((s, r) => s + r.cost, 0), icon: AlertCircle, color: 'text-[#3d5a80] dark:text-[#6d97b5]' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2"><Icon size={16} className={s.color} /><span className="text-xs text-muted-foreground">{s.label}</span></div>
              <p className={`text-2xl tracking-tight ${s.color}`} style={{ fontFamily: 'var(--font-display)' }}>${s.value.toLocaleString()}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-sm text-muted-foreground tracking-wide uppercase mb-4">{editingId ? 'Edit expense' : 'New expense'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-xs text-muted-foreground mb-1.5">Category</label><select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className={inputCls}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div><label className="block text-xs text-muted-foreground mb-1.5">Cost ($)</label><input type="number" step="0.01" required value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} className={inputCls} placeholder="5000" /></div>
                <div><label className="block text-xs text-muted-foreground mb-1.5">Supplier</label><input type="text" required value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} className={inputCls} placeholder="ABC Construction" /></div>
                <div><label className="block text-xs text-muted-foreground mb-1.5">Status</label><select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className={inputCls}><option value="paid">Paid</option><option value="pending">Pending</option><option value="partial">Partial</option></select></div>
                <div className="md:col-span-2"><label className="block text-xs text-muted-foreground mb-1.5">Date</label><input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className={inputCls} /></div>
              </div>
              <button type="submit" className="px-6 py-2.5 bg-foreground text-background rounded-xl text-sm transition-all active:scale-95">{editingId ? 'Update' : 'Save expense'}</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="space-y-2">
        {renovations.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center"><p className="text-muted-foreground text-sm">No renovation expenses yet</p></div>
        ) : renovations.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="bg-card border border-border rounded-xl px-5 py-4 flex items-center justify-between gap-4 hover:border-foreground/10 transition-colors">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 bg-secondary text-muted-foreground rounded-lg text-xs capitalize">{r.category}</span>
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs capitalize ${statusColors[r.status]}`}>{r.status}</span>
                  <span className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <p className="text-sm">{r.supplier}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="tabular-nums" style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>${r.cost.toLocaleString()}</span>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(r)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"><Edit2 size={14} /></button>
                <button onClick={() => deleteRenovation(r.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-[#c4432b] hover:bg-[#c4432b]/10 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
