import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Type definitions
export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  note: string;
  createdAt: number;
}

export interface Budget {
  [category: string]: number;
}

export interface Settings {
  darkMode: boolean;
  currency: string;
}

export interface AppData {
  expenses: Expense[];
  budgets: Budget;
  settings: Settings;
  savingsBalance: number;
  lastUpdated: string;
}

interface DataContextType {
  data: AppData;
  loading: boolean;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  deleteExpense: (id: string) => void;
  updateBudget: (category: string, amount: number) => void;
  addSavings: (amount: number) => void;
  exportToCSV: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Default data
const defaultData: AppData = {
  expenses: [],
  budgets: {
    food: 500,
    transport: 200,
    shopping: 300,
    entertainment: 150,
    utilities: 200,
    health: 100,
    other: 100
  },
  settings: {
    darkMode: false,
    currency: '$'
  },
  savingsBalance: 1000, // Starting savings
  lastUpdated: new Date().toISOString()
};

export function SimpleDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => {
    // Try to load from localStorage first
    const saved = localStorage.getItem('simple-budget-data');
    return saved ? JSON.parse(saved) : defaultData;
  });
  
  const [loading, setLoading] = useState(false);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('simple-budget-data', JSON.stringify(data));
  }, [data]);

  // Expense operations
  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: Date.now()
    };
    
    const newData = {
      ...data,
      expenses: [newExpense, ...data.expenses],
      savingsBalance: Math.max(0, data.savingsBalance - expense.amount),
      lastUpdated: new Date().toISOString()
    };
    
    setData(newData);
  };

  const deleteExpense = (id: string) => {
    const expenseToDelete = data.expenses.find(e => e.id === id);
    const newSavingsBalance = expenseToDelete 
      ? data.savingsBalance + expenseToDelete.amount
      : data.savingsBalance;
    
    const newData = {
      ...data,
      expenses: data.expenses.filter(exp => exp.id !== id),
      savingsBalance: newSavingsBalance,
      lastUpdated: new Date().toISOString()
    };
    
    setData(newData);
  };

  const updateBudget = (category: string, amount: number) => {
    const newData = {
      ...data,
      budgets: { ...data.budgets, [category]: amount },
      lastUpdated: new Date().toISOString()
    };
    
    setData(newData);
  };

  const addSavings = (amount: number) => {
    const newData = {
      ...data,
      savingsBalance: data.savingsBalance + amount,
      lastUpdated: new Date().toISOString()
    };
    
    setData(newData);
  };

  const exportToCSV = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const headers = ['Date,Amount,Category,Note,Savings Balance'];
    
    const expenseRows = data.expenses.map(e => 
      `${e.date},${e.amount},${e.category},"${e.note}",`
    );
    
    const summaryRow = [`${timestamp},,TOTAL SAVINGS:,"$${data.savingsBalance.toFixed(2)}"`];
    
    const csvContent = [
      ...headers,
      ...expenseRows,
      ...summaryRow
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-${timestamp}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const value: DataContextType = {
    data,
    loading,
    addExpense,
    deleteExpense,
    updateBudget,
    addSavings,
    exportToCSV
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useSimpleData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useSimpleData must be used within SimpleDataProvider');
  }
  return context;
}