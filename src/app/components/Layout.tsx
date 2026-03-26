import { Outlet, Link, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Receipt, 
  TrendingUp, 
  Home, 
  CreditCard, 
  Settings as SettingsIcon,
  Menu,
  X,
  Sun,
  Moon,
  Languages
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BudgetBuddy } from './BudgetBuddy';

export function Layout() {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: t.dashboard },
    { path: '/expenses', icon: Receipt, label: t.expenses },
    { path: '/investments', icon: TrendingUp, label: t.investments },
    { path: '/renovation', icon: Home, label: t.renovation },
    { path: '/mortgage', icon: CreditCard, label: t.mortgage },
    { path: '/settings', icon: SettingsIcon, label: t.settings },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-5 py-4">
          <span className="tracking-tight" style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>
            {t.budgetTracker}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-accent transition-colors"
              title={language === 'en' ? '中文' : 'English'}
            >
              <Languages size={18} />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-accent transition-colors"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full hover:bg-accent transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-card border-r border-border z-50 shadow-2xl"
            >
              <div className="p-6 pt-8">
                <span className="tracking-tight" style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
                  {t.budgetTracker}
                </span>
              </div>
              <nav className="px-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-foreground text-background'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-60 bg-card border-r border-border">
        <div className="px-6 pt-8 pb-6">
          <span className="tracking-tight" style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
            {t.budgetTracker}
          </span>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-[0.9rem]">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-4 pb-6 space-y-3">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
          >
            <Languages size={18} strokeWidth={1.5} />
            <span className="text-[0.9rem]">{language === 'en' ? '中文' : 'English'}</span>
          </button>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
          >
            {isDark ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
            <span className="text-[0.9rem]">{isDark ? t.lightMode : t.darkMode}</span>
          </button>
          <div className="mx-2 border-t border-border" />
          <p className="px-2 text-xs text-muted-foreground/60 italic leading-relaxed">
            {t.quote}
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-60 pt-16 lg:pt-0 min-h-screen">
        <div className="max-w-6xl mx-auto px-5 py-8 lg:py-10">
          <Outlet />
        </div>
      </main>

      {/* Virtual Pet Buddy */}
      <BudgetBuddy />
    </div>
  );
}