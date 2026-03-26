import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Type definitions for all data structures
export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  note: string;
  createdAt: number;
}

export interface Investment {
  id: string;
  amount: number;
  date: string;
  type: string;
  expectedReturn: number;
  actualReturn: number;
  createdAt: number;
}

export interface Renovation {
  id: string;
  category: string;
  cost: number;
  supplier: string;
  status: 'paid' | 'pending' | 'partial';
  date: string;
  createdAt: number;
}

export interface Mortgage {
  id: string;
  name: string;
  amount: number;
  rate: number;
  term: number; // months
  monthlyPayment: number;
  startDate: string;
  createdAt: number;
}

export interface Budget {
  [category: string]: number;
}

export interface Settings {
  darkMode: boolean;
  password: string;
  currency: string;
  renovationBudget: number;
}

interface DataContextType {
  expenses: Expense[];
  investments: Investment[];
  renovations: Renovation[];
  mortgages: Mortgage[];
  budgets: Budget;
  settings: Settings;
  savingsBalance: number;
  addSavings: (amount: number) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addInvestment: (investment: Omit<Investment, 'id' | 'createdAt'>) => void;
  updateInvestment: (id: string, investment: Partial<Investment>) => void;
  deleteInvestment: (id: string) => void;
  addRenovation: (renovation: Omit<Renovation, 'id' | 'createdAt'>) => void;
  updateRenovation: (id: string, renovation: Partial<Renovation>) => void;
  deleteRenovation: (id: string) => void;
  addMortgage: (mortgage: Omit<Mortgage, 'id' | 'createdAt'>) => void;
  updateMortgage: (id: string, mortgage: Partial<Mortgage>) => void;
  deleteMortgage: (id: string) => void;
  updateBudget: (category: string, amount: number) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  exportToCSV: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage or defaults
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('budgetTracker_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [investments, setInvestments] = useState<Investment[]>(() => {
    const saved = localStorage.getItem('budgetTracker_investments');
    return saved ? JSON.parse(saved) : [];
  });

  const [renovations, setRenovations] = useState<Renovation[]>(() => {
    const saved = localStorage.getItem('budgetTracker_renovations');
    return saved ? JSON.parse(saved) : [];
  });

  const [mortgages, setMortgages] = useState<Mortgage[]>(() => {
    const saved = localStorage.getItem('budgetTracker_mortgages');
    return saved ? JSON.parse(saved) : [];
  });

  const [budgets, setBudgets] = useState<Budget>(() => {
    const saved = localStorage.getItem('budgetTracker_budgets');
    return saved ? JSON.parse(saved) : {
      food: 500,
      transport: 200,
      shopping: 300,
      entertainment: 150,
      utilities: 200,
      other: 100
    };
  });

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('budgetTracker_settings');
    return saved ? JSON.parse(saved) : {
      darkMode: false,
      password: '',
      currency: '$',
      renovationBudget: 50000
    };
  });

  const [savingsBalance, setSavingsBalance] = useState<number>(() => {
    const saved = localStorage.getItem('budgetTracker_savings');
    return saved ? JSON.parse(saved) : 0;
  });

  // Auto-save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('budgetTracker_savings', JSON.stringify(savingsBalance));
  }, [savingsBalance]);
  useEffect(() => {
    localStorage.setItem('budgetTracker_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('budgetTracker_investments', JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    localStorage.setItem('budgetTracker_renovations', JSON.stringify(renovations));
  }, [renovations]);

  useEffect(() => {
    localStorage.setItem('budgetTracker_mortgages', JSON.stringify(mortgages));
  }, [mortgages]);

  useEffect(() => {
    localStorage.setItem('budgetTracker_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('budgetTracker_settings', JSON.stringify(settings));
  }, [settings]);

  // Savings operations
  const addSavings = (amount: number) => {
    setSavingsBalance(prev => prev + amount);
  };

  // Expense CRUD operations
  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: Date.now()
    };
    setExpenses(prev => [newExpense, ...prev]);
    // Automatically deduct expense from savings balance
    setSavingsBalance(prev => Math.max(0, prev - expense.amount));
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(prev => {
      const oldExpense = prev.find(e => e.id === id);
      if (oldExpense && updates.amount !== undefined) {
        const difference = updates.amount - oldExpense.amount;
        setSavingsBalance(s => Math.max(0, s - difference));
      }
      return prev.map(exp => exp.id === id ? { ...exp, ...updates } : exp);
    });
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => {
      const expenseToDelete = prev.find(e => e.id === id);
      if (expenseToDelete) {
        setSavingsBalance(s => s + expenseToDelete.amount);
      }
      return prev.filter(exp => exp.id !== id);
    });
  };

  // Investment CRUD operations
  const addInvestment = (investment: Omit<Investment, 'id' | 'createdAt'>) => {
    const newInvestment: Investment = {
      ...investment,
      id: Date.now().toString(),
      createdAt: Date.now()
    };
    setInvestments(prev => [newInvestment, ...prev]);
  };

  const updateInvestment = (id: string, updates: Partial<Investment>) => {
    setInvestments(prev => prev.map(inv => inv.id === id ? { ...inv, ...updates } : inv));
  };

  const deleteInvestment = (id: string) => {
    setInvestments(prev => prev.filter(inv => inv.id !== id));
  };

  // Renovation CRUD operations
  const addRenovation = (renovation: Omit<Renovation, 'id' | 'createdAt'>) => {
    const newRenovation: Renovation = {
      ...renovation,
      id: Date.now().toString(),
      createdAt: Date.now()
    };
    setRenovations(prev => [newRenovation, ...prev]);
  };

  const updateRenovation = (id: string, updates: Partial<Renovation>) => {
    setRenovations(prev => prev.map(ren => ren.id === id ? { ...ren, ...updates } : ren));
  };

  const deleteRenovation = (id: string) => {
    setRenovations(prev => prev.filter(ren => ren.id !== id));
  };

  // Mortgage CRUD operations
  const addMortgage = (mortgage: Omit<Mortgage, 'id' | 'createdAt'>) => {
    const newMortgage: Mortgage = {
      ...mortgage,
      id: Date.now().toString(),
      createdAt: Date.now()
    };
    setMortgages(prev => [newMortgage, ...prev]);
  };

  const updateMortgage = (id: string, updates: Partial<Mortgage>) => {
    setMortgages(prev => prev.map(mtg => mtg.id === id ? { ...mtg, ...updates } : mtg));
  };

  const deleteMortgage = (id: string) => {
    setMortgages(prev => prev.filter(mtg => mtg.id !== id));
  };

  // Budget management
  const updateBudget = (category: string, amount: number) => {
    setBudgets(prev => ({ ...prev, [category]: amount }));
  };

  // Settings management
  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  // Export all data to CSV
  const exportToCSV = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    
    // Export expenses
    const expenseHeaders = ['Type,Amount,Category,Date,Note'];
    const expenseRows = expenses.map(e => 
      `Expense,${e.amount},${e.category},${e.date},"${e.note}"`
    );
    
    // Export investments
    const investmentRows = investments.map(i => 
      `Investment,${i.amount},${i.type},${i.date},"Expected: ${i.expectedReturn}% Actual: ${i.actualReturn}%"`
    );
    
    // Export renovations
    const renovationRows = renovations.map(r => 
      `Renovation,${r.cost},${r.category},${r.date},"${r.supplier} - ${r.status}"`
    );
    
    // Export mortgages
    const mortgageRows = mortgages.map(m => 
      `Mortgage,${m.amount},${m.name},${m.startDate},"Rate: ${m.rate}% Term: ${m.term} months Payment: ${m.monthlyPayment}"`
    );
    
    const csvContent = [
      ...expenseHeaders,
      ...expenseRows,
      ...investmentRows,
      ...renovationRows,
      ...mortgageRows
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-tracker-${timestamp}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const value: DataContextType = {
    expenses,
    investments,
    renovations,
    mortgages,
    budgets,
    settings,
    savingsBalance,
    addSavings,
    addExpense,
    updateExpense,
    deleteExpense,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    addRenovation,
    updateRenovation,
    deleteRenovation,
    addMortgage,
    updateMortgage,
    deleteMortgage,
    updateBudget,
    updateSettings,
    exportToCSV
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
