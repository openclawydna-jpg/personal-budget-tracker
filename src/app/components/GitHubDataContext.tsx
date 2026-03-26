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

export interface AppData {
  expenses: Expense[];
  investments: Investment[];
  renovations: Renovation[];
  mortgages: Mortgage[];
  budgets: Budget;
  settings: Settings;
  savingsBalance: number;
  lastUpdated: string;
}

interface DataContextType {
  data: AppData;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addInvestment: (investment: Omit<Investment, 'id' | 'createdAt'>) => Promise<void>;
  updateInvestment: (id: string, investment: Partial<Investment>) => Promise<void>;
  deleteInvestment: (id: string) => Promise<void>;
  addRenovation: (renovation: Omit<Renovation, 'id' | 'createdAt'>) => Promise<void>;
  updateRenovation: (id: string, renovation: Partial<Renovation>) => Promise<void>;
  deleteRenovation: (id: string) => Promise<void>;
  addMortgage: (mortgage: Omit<Mortgage, 'id' | 'createdAt'>) => Promise<void>;
  updateMortgage: (id: string, mortgage: Partial<Mortgage>) => Promise<void>;
  deleteMortgage: (id: string) => Promise<void>;
  updateBudget: (category: string, amount: number) => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  addSavings: (amount: number) => Promise<void>;
  exportToCSV: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// GitHub configuration
const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/{USERNAME}/{REPO}/main/data.json';
const GITHUB_API_URL = 'https://api.github.com/repos/{USERNAME}/{REPO}/contents/data.json';

// Default data
const defaultData: AppData = {
  expenses: [],
  investments: [],
  renovations: [],
  mortgages: [],
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
    password: '',
    currency: '$',
    renovationBudget: 50000
  },
  savingsBalance: 0,
  lastUpdated: new Date().toISOString()
};

export function GitHubDataProvider({ children, githubToken, username, repo }: { 
  children: ReactNode;
  githubToken?: string;
  username: string;
  repo: string;
}) {
  const [data, setData] = useState<AppData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from GitHub
  const fetchData = async () => {
    try {
      setLoading(true);
      const url = GITHUB_RAW_URL.replace('{USERNAME}', username).replace('{REPO}', repo);
      const response = await fetch(url + `?t=${Date.now()}`); // Cache bust
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      const fetchedData = await response.json();
      setData(fetchedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Keep using existing data or default
    } finally {
      setLoading(false);
    }
  };

  // Update data on GitHub
  const updateGitHubData = async (newData: AppData): Promise<boolean> => {
    if (!githubToken) {
      console.warn('No GitHub token provided, data will not be saved to GitHub');
      return false;
    }

    try {
      const apiUrl = GITHUB_API_URL.replace('{USERNAME}', username).replace('{REPO}', repo);
      
      // First, get the current file to get its SHA
      const getResponse = await fetch(apiUrl, {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      let sha: string | undefined;
      if (getResponse.ok) {
        const fileInfo = await getResponse.json();
        sha = fileInfo.sha;
      }

      // Update the data
      const updatedData = {
        ...newData,
        lastUpdated: new Date().toISOString()
      };

      // Create or update the file
      const updateResponse = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Update budget data: ${new Date().toLocaleString()}`,
          content: btoa(JSON.stringify(updatedData, null, 2)),
          sha: sha
        })
      });

      if (!updateResponse.ok) {
        throw new Error(`Failed to update GitHub: ${updateResponse.status}`);
      }

      // Update local state
      setData(updatedData);
      return true;
    } catch (err) {
      console.error('Error updating GitHub data:', err);
      setError(err instanceof Error ? err.message : 'Failed to update GitHub');
      return false;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
    
    // Refresh every 30 seconds to get updates
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [username, repo]);

  // Expense operations
  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: Date.now()
    };
    
    const newData = {
      ...data,
      expenses: [newExpense, ...data.expenses],
      savingsBalance: Math.max(0, data.savingsBalance - expense.amount)
    };
    
    await updateGitHubData(newData);
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    const oldExpense = data.expenses.find(e => e.id === id);
    let newSavingsBalance = data.savingsBalance;
    
    if (oldExpense && updates.amount !== undefined) {
      const difference = updates.amount - oldExpense.amount;
      newSavingsBalance = Math.max(0, data.savingsBalance - difference);
    }
    
    const newData = {
      ...data,
      expenses: data.expenses.map(exp => 
        exp.id === id ? { ...exp, ...updates } : exp
      ),
      savingsBalance: newSavingsBalance
    };
    
    await updateGitHubData(newData);
  };

  const deleteExpense = async (id: string) => {
    const expenseToDelete = data.expenses.find(e => e.id === id);
    const newSavingsBalance = expenseToDelete 
      ? data.savingsBalance + expenseToDelete.amount
      : data.savingsBalance;
    
    const newData = {
      ...data,
      expenses: data.expenses.filter(exp => exp.id !== id),
      savingsBalance: newSavingsBalance
    };
    
    await updateGitHubData(newData);
  };

  // Other CRUD operations (simplified for brevity)
  const addInvestment = async (investment: Omit<Investment, 'id' | 'createdAt'>) => {
    const newInvestment: Investment = {
      ...investment,
      id: Date.now().toString(),
      createdAt: Date.now()
    };
    
    const newData = {
      ...data,
      investments: [newInvestment, ...data.investments]
    };
    
    await updateGitHubData(newData);
  };

  const updateInvestment = async (id: string, updates: Partial<Investment>) => {
    const newData = {
      ...data,
      investments: data.investments.map(inv => 
        inv.id === id ? { ...inv, ...updates } : inv
      )
    };
    
    await updateGitHubData(newData);
  };

  const deleteInvestment = async (id: string) => {
    const newData = {
      ...data,
      investments: data.investments.filter(inv => inv.id !== id)
    };
    
    await updateGitHubData(newData);
  };

  const addRenovation = async (renovation: Omit<Renovation, 'id' | 'createdAt'>) => {
    const newRenovation: Renovation = {
      ...renovation,
      id: Date.now().toString(),
      createdAt: Date.now()
    };
    
    const newData = {
      ...data,
      renovations: [newRenovation, ...data.renovations]
    };
    
    await updateGitHubData(newData);
  };

  const updateRenovation = async (id: string, updates: Partial<Renovation>) => {
    const newData = {
      ...data,
      renovations: data.renovations.map(ren => 
        ren.id === id ? { ...ren, ...updates } : ren
      )
    };
    
    await updateGitHubData(newData);
  };

  const deleteRenovation = async (id: string) => {
    const newData = {
      ...data,
      renovations: data.renovations.filter(ren => ren.id !== id)
    };
    
    await updateGitHubData(newData);
  };

  const addMortgage = async (mortgage: Omit<Mortgage, 'id' | 'createdAt'>) => {
    const newMortgage: Mortgage = {
      ...mortgage,
      id: Date.now().toString(),
      createdAt: Date.now()
    };
    
    const newData = {
      ...data,
      mortgages: [newMortgage, ...data.mortgages]
    };
    
    await updateGitHubData(newData);
  };

  const updateMortgage = async (id: string, updates: Partial<Mortgage>) => {
    const newData = {
      ...data,
      mortgages: data.mortgages.map(mtg => 
        mtg.id === id ? { ...mtg, ...updates } : mtg
      )
    };
    
    await updateGitHubData(newData);
  };

  const deleteMortgage = async (id: string) => {
    const newData = {
      ...data,
      mortgages: data.mortgages.filter(mtg => mtg.id !== id)
    };
    
    await updateGitHubData(newData);
  };

  const updateBudget = async (category: string, amount: number) => {
    const newData = {
      ...data,
      budgets: { ...data.budgets, [category]: amount }
    };
    
    await updateGitHubData(newData);
  };

  const updateSettings = async (updates: Partial<Settings>) => {
    const newData = {
      ...data,
      settings: { ...data.settings, ...updates }
    };
    
    await updateGitHubData(newData);
  };

  const addSavings = async (amount: number) => {
    const newData = {
      ...data,
      savingsBalance: data.savingsBalance + amount
    };
    
    await updateGitHubData(newData);
  };

  const exportToCSV = () => {
    // Same export logic as before
    const timestamp = new Date().toISOString().split('T')[0];
    
    const expenseHeaders = ['Type,Amount,Category,Date,Note'];
    const expenseRows = data.expenses.map(e => 
      `Expense,${e.amount},${e.category},${e.date},"${e.note}"`
    );
    
    const investmentRows = data.investments.map(i => 
      `Investment,${i.amount},${i.type},${i.date},"Expected: ${i.expectedReturn}% Actual: ${i.actualReturn}%"`
    );
    
    const renovationRows = data.renovations.map(r => 
      `Renovation,${r.cost},${r.category},${r.date},"${r.supplier} - ${r.status}"`
    );
    
    const mortgageRows = data.mortgages.map(m => 
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
    data,
    loading,
    error,
    refreshData: fetchData,
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
    addSavings,
    exportToCSV
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useGitHubData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useGitHubData must be used within GitHubDataProvider');
  }
  return context;
}