import { useState } from 'react';
import { useData } from './DataContext';
import { useTheme } from './ThemeProvider';
import { Moon, Sun, Download, Lock, Home, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

export function Settings() {
  const { budgets, updateBudget, exportToCSV, settings, updateSettings } = useData();
  const { isDark, toggleTheme } = useTheme();
  
  const [tempBudgets, setTempBudgets] = useState(budgets);
  const [tempRenovationBudget, setTempRenovationBudget] = useState(settings.renovationBudget);
  const [password, setPassword] = useState(settings.password);
  const [showPassword, setShowPassword] = useState(false);

  const categories = ['food', 'transport', 'shopping', 'entertainment', 'utilities', 'health', 'other'];

  const handleSaveBudgets = () => {
    Object.entries(tempBudgets).forEach(([cat, amt]) => updateBudget(cat, amt));
    updateSettings({ renovationBudget: tempRenovationBudget });
    toast.success('Budgets saved!');
  };

  const handleSavePassword = () => { updateSettings({ password }); toast.success('Password updated'); };
  const handleExport = () => { exportToCSV(); toast.success('Data exported'); };

  const inputCls = "w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:border-foreground/20 outline-none transition-all text-sm";

  return (
    <div className="space-y-8">
      <Toaster position="top-right" richColors />
      
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', lineHeight: 1.2 }}>Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Customize your budget tracker</p>
      </div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-sm text-muted-foreground tracking-wide uppercase mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm">Dark Mode</p>
            <p className="text-xs text-muted-foreground">Switch between light and dark themes</p>
          </div>
          <button onClick={toggleTheme}
            className={`relative w-14 h-7 rounded-full transition-all ${isDark ? 'bg-foreground' : 'bg-border'}`}>
            <motion.div animate={{ x: isDark ? 28 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`absolute top-1 w-5 h-5 rounded-full shadow flex items-center justify-center ${isDark ? 'bg-background' : 'bg-card'}`}>
              {isDark ? <Moon size={11} /> : <Sun size={11} />}
            </motion.div>
          </button>
        </div>
      </motion.div>

      {/* Category Budgets */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm text-muted-foreground tracking-wide uppercase">Category Budgets</h2>
          <button onClick={() => {
            setTempBudgets({ food: 600, transport: 250, shopping: 350, entertainment: 200, utilities: 250, health: 150, other: 150 });
            toast.success('Suggestions applied');
          }} className="text-xs text-muted-foreground hover:text-foreground underline transition-colors">Auto-suggest</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {categories.map(cat => (
            <div key={cat}>
              <label className="block text-xs text-muted-foreground mb-1.5 capitalize">{cat}</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <input type="number" value={tempBudgets[cat] || 0}
                  onChange={e => setTempBudgets({ ...tempBudgets, [cat]: parseFloat(e.target.value) || 0 })}
                  className={`${inputCls} pl-7`} />
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleSaveBudgets} className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-sm transition-all active:scale-95">
          <Save size={14} /> Save budgets
        </button>
      </motion.div>

      {/* Renovation Budget */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-sm text-muted-foreground tracking-wide uppercase mb-4">Renovation Budget</h2>
        <div className="mb-4">
          <label className="block text-xs text-muted-foreground mb-1.5">Total budget</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <input type="number" value={tempRenovationBudget}
              onChange={e => setTempRenovationBudget(parseFloat(e.target.value) || 0)}
              className={`${inputCls} pl-7`} />
          </div>
        </div>
        <button onClick={handleSaveBudgets} className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-sm transition-all active:scale-95">
          <Home size={14} /> Save
        </button>
      </motion.div>

      {/* Password */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-sm text-muted-foreground tracking-wide uppercase mb-4">Password Protection</h2>
        <p className="text-xs text-muted-foreground mb-4">Set a simple password for basic privacy. Stored locally only.</p>
        <div className="mb-4 relative">
          <input type={showPassword ? 'text' : 'password'} value={password}
            onChange={e => setPassword(e.target.value)} className={inputCls} placeholder="Enter password" />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <button onClick={handleSavePassword} className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-sm transition-all active:scale-95">
          <Lock size={14} /> Save password
        </button>
      </motion.div>

      {/* Export */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-sm text-muted-foreground tracking-wide uppercase mb-2">Export Data</h2>
        <p className="text-xs text-muted-foreground mb-4">Download all financial data as CSV for backup or analysis.</p>
        <button onClick={handleExport} className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-sm transition-all active:scale-95">
          <Download size={14} /> Export to CSV
        </button>
      </motion.div>

      {/* Info */}
      <div className="bg-secondary rounded-2xl p-5">
        <p className="text-xs text-muted-foreground leading-relaxed">
          All data is stored locally in your browser. Nothing is sent to any server. Use the export feature for backups.
        </p>
      </div>
    </div>
  );
}
