import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'zh';

interface Translations {
  // Navigation
  dashboard: string;
  expenses: string;
  investments: string;
  renovation: string;
  mortgage: string;
  settings: string;
  
  // Common
  budgetTracker: string;
  lightMode: string;
  darkMode: string;
  add: string;
  cancel: string;
  save: string;
  edit: string;
  delete: string;
  amount: string;
  date: string;
  category: string;
  description: string;
  name: string;
  
  // Dashboard
  currentSavings: string;
  addSavings: string;
  totalExpenses: string;
  totalInvestments: string;
  monthlyExpenses: string;
  portfolioReturns: string;
  renovationCosts: string;
  mortgageRemaining: string;
  expenseBreakdown: string;
  spendingTrend: string;
  budgetAlerts: string;
  viewAll: string;
  lastMonthComparison: string;
  spendingUp: string;
  spendingDown: string;
  fromLastMonth: string;
  recentActivity: string;
  expense: string;
  investment: string;
  noActivity: string;
  quote: string;
  
  // Expense Tracker
  expenseTracker: string;
  totalSpent: string;
  thisMonth: string;
  addExpense: string;
  categoryBudgets: string;
  remaining: string;
  over: string;
  noBudgetSet: string;
  setBudget: string;
  budgetLimit: string;
  recentExpenses: string;
  noExpenses: string;
  deleteExpense: string;
  confirmDeleteExpense: string;
  
  // Investment Tracker
  investmentTracker: string;
  totalInvested: string;
  totalReturn: string;
  addInvestment: string;
  expectedReturn: string;
  actualReturn: string;
  myInvestments: string;
  noInvestments: string;
  deleteInvestment: string;
  confirmDeleteInvestment: string;
  
  // Renovation Tracker
  renovationTracker: string;
  totalCost: string;
  addRenovation: string;
  cost: string;
  status: string;
  myRenovations: string;
  noRenovations: string;
  deleteRenovation: string;
  confirmDeleteRenovation: string;
  
  // Status
  planned: string;
  inProgress: string;
  completed: string;
  
  // Mortgage Tracker
  mortgageTracker: string;
  totalRemaining: string;
  monthlyPayment: string;
  addMortgage: string;
  startDate: string;
  principal: string;
  interestRate: string;
  term: string;
  myMortgages: string;
  noMortgages: string;
  deleteMortgage: string;
  confirmDeleteMortgage: string;
  paid: string;
  years: string;
  months: string;
  
  // Settings
  settingsTitle: string;
  appearance: string;
  themeMode: string;
  language: string;
  dataManagement: string;
  exportData: string;
  exportDescription: string;
  importData: string;
  importDescription: string;
  clearData: string;
  clearDataWarning: string;
  about: string;
  version: string;
  
  // Categories
  food: string;
  transport: string;
  entertainment: string;
  utilities: string;
  healthcare: string;
  other: string;
  shopping: string;
  health: string;
  
  // Additional UI
  all: string;
  search: string;
  update: string;
  note: string;
  noNote: string;
  newExpense: string;
  editExpense: string;
  saveExpense: string;
  trackYourSpending: string;
  startTracking: string;
  autoCategorizes: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    expenses: 'Expenses',
    investments: 'Investments',
    renovation: 'Renovation',
    mortgage: 'Mortgage',
    settings: 'Settings',
    
    // Common
    budgetTracker: 'Budget Tracker',
    lightMode: 'Light mode',
    darkMode: 'Dark mode',
    add: 'Add',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    amount: 'Amount',
    date: 'Date',
    category: 'Category',
    description: 'Description',
    name: 'Name',
    
    // Dashboard
    currentSavings: 'Current Savings',
    addSavings: 'Add Savings',
    totalExpenses: 'Total Expenses',
    totalInvestments: 'Total Investments',
    monthlyExpenses: 'Monthly Expenses',
    portfolioReturns: 'Portfolio Returns',
    renovationCosts: 'Renovation Costs',
    mortgageRemaining: 'Mortgage Remaining',
    expenseBreakdown: 'Expense Breakdown',
    spendingTrend: 'Spending Trend',
    budgetAlerts: 'Budget Alerts',
    viewAll: 'View All',
    lastMonthComparison: 'Last Month Comparison',
    spendingUp: 'Spending up',
    spendingDown: 'Spending down',
    fromLastMonth: 'from last month',
    recentActivity: 'Recent Activity',
    expense: 'Expense',
    investment: 'Investment',
    noActivity: 'No recent activity',
    quote: '"A budget is telling your money where to go."',
    
    // Expense Tracker
    expenseTracker: 'Expense Tracker',
    totalSpent: 'Total Spent',
    thisMonth: 'This Month',
    addExpense: 'Add Expense',
    categoryBudgets: 'Category Budgets',
    remaining: 'remaining',
    over: 'over budget',
    noBudgetSet: 'No budget set',
    setBudget: 'Set Budget',
    budgetLimit: 'Budget Limit',
    recentExpenses: 'Recent Expenses',
    noExpenses: 'No expenses yet',
    deleteExpense: 'Delete Expense',
    confirmDeleteExpense: 'Are you sure you want to delete this expense?',
    
    // Investment Tracker
    investmentTracker: 'Investment Tracker',
    totalInvested: 'Total Invested',
    totalReturn: 'Total Return',
    addInvestment: 'Add Investment',
    expectedReturn: 'Expected Return',
    actualReturn: 'Actual Return',
    myInvestments: 'My Investments',
    noInvestments: 'No investments yet',
    deleteInvestment: 'Delete Investment',
    confirmDeleteInvestment: 'Are you sure you want to delete this investment?',
    
    // Renovation Tracker
    renovationTracker: 'Renovation Tracker',
    totalCost: 'Total Cost',
    addRenovation: 'Add Renovation',
    cost: 'Cost',
    status: 'Status',
    myRenovations: 'My Renovations',
    noRenovations: 'No renovations yet',
    deleteRenovation: 'Delete Renovation',
    confirmDeleteRenovation: 'Are you sure you want to delete this renovation?',
    
    // Status
    planned: 'Planned',
    inProgress: 'In Progress',
    completed: 'Completed',
    
    // Mortgage Tracker
    mortgageTracker: 'Mortgage Tracker',
    totalRemaining: 'Total Remaining',
    monthlyPayment: 'Monthly Payment',
    addMortgage: 'Add Mortgage',
    startDate: 'Start Date',
    principal: 'Principal',
    interestRate: 'Interest Rate',
    term: 'Term',
    myMortgages: 'My Mortgages',
    noMortgages: 'No mortgages yet',
    deleteMortgage: 'Delete Mortgage',
    confirmDeleteMortgage: 'Are you sure you want to delete this mortgage?',
    paid: 'Paid',
    years: 'years',
    months: 'months',
    
    // Settings
    settingsTitle: 'Settings',
    appearance: 'Appearance',
    themeMode: 'Theme Mode',
    language: 'Language',
    dataManagement: 'Data Management',
    exportData: 'Export Data',
    exportDescription: 'Download all your data as a JSON file',
    importData: 'Import Data',
    importDescription: 'Upload a previously exported JSON file',
    clearData: 'Clear All Data',
    clearDataWarning: 'This will permanently delete all your data',
    about: 'About',
    version: 'Version',
    
    // Categories
    food: 'Food',
    transport: 'Transport',
    entertainment: 'Entertainment',
    utilities: 'Utilities',
    healthcare: 'Healthcare',
    other: 'Other',
    shopping: 'Shopping',
    health: 'Health',
    
    // Additional UI
    all: 'All',
    search: 'Search',
    update: 'Update',
    note: 'Note',
    noNote: 'No Note',
    newExpense: 'New Expense',
    editExpense: 'Edit Expense',
    saveExpense: 'Save Expense',
    trackYourSpending: 'Track Your Spending',
    startTracking: 'Start Tracking',
    autoCategorizes: 'Auto Categorizes',
    
    // Budget Buddy
    buddyGreeting: 'Hi! I\'m here to help you manage your budget!',
    buddyTipSaving: 'Tip: Try to save at least 20% of your income!',
    buddyTipBudget: 'Great job tracking your expenses!',
    buddyTipInvesting: 'Consider investing for long-term growth!',
    buddyEncouragement: 'You\'re doing great! Keep it up!',
    
    // Greetings
    goodMorning: 'Good Morning!',
    goodAfternoon: 'Good Afternoon!',
    goodEvening: 'Good Evening!',
    autoDecreaseNote: 'Note: The budget will automatically decrease if you exceed the limit.',
    vsLastMonth: 'vs Last Month',
    lastMonths: 'Last Month\'s',
    byCategory: 'By Category',
    noDataYet: 'No data yet',
    totalTransactions: 'Total Transactions',
    investmentROI: 'Investment ROI',
    activeMortgages: 'Active Mortgages',
  },
  zh: {
    // Navigation
    dashboard: '儀表板',
    expenses: '支出',
    investments: '投資',
    renovation: '裝修',
    mortgage: '貸款',
    settings: '設定',
    
    // Common
    budgetTracker: '預算追蹤器',
    lightMode: '淺色模式',
    darkMode: '深色模式',
    add: '新增',
    cancel: '取消',
    save: '儲存',
    edit: '編輯',
    delete: '刪除',
    amount: '金額',
    date: '日期',
    category: '類別',
    description: '說明',
    name: '名稱',
    
    // Dashboard
    currentSavings: '目前儲蓄',
    addSavings: '新增儲蓄',
    totalExpenses: '總支出',
    totalInvestments: '總投資',
    monthlyExpenses: '本月支出',
    portfolioReturns: '投資組合回報',
    renovationCosts: '裝修成本',
    mortgageRemaining: '剩餘貸款',
    expenseBreakdown: '支出明細',
    spendingTrend: '支出趨勢',
    budgetAlerts: '預算警告',
    viewAll: '查看全部',
    lastMonthComparison: '上月比較',
    spendingUp: '支出增加',
    spendingDown: '支出減少',
    fromLastMonth: '與上月相比',
    recentActivity: '最近活動',
    expense: '支出',
    investment: '投資',
    noActivity: '目前無活動',
    quote: '「預算是告訴你的錢該往哪裡去。」',
    
    // Expense Tracker
    expenseTracker: '支出追蹤',
    totalSpent: '總花費',
    thisMonth: '本月',
    addExpense: '新增支出',
    categoryBudgets: '類別預算',
    remaining: '剩餘',
    over: '超出預算',
    noBudgetSet: '未設定預算',
    setBudget: '設定預算',
    budgetLimit: '預算限額',
    recentExpenses: '最近支出',
    noExpenses: '目前無支出紀錄',
    deleteExpense: '刪除支出',
    confirmDeleteExpense: '確定要刪除此支出嗎？',
    
    // Investment Tracker
    investmentTracker: '投資追蹤',
    totalInvested: '總投資',
    totalReturn: '總回報',
    addInvestment: '新增投資',
    expectedReturn: '預期回報',
    actualReturn: '實際回報',
    myInvestments: '我的投資',
    noInvestments: '目前無投資紀錄',
    deleteInvestment: '刪除投資',
    confirmDeleteInvestment: '確定要刪除此投資嗎？',
    
    // Renovation Tracker
    renovationTracker: '裝修追蹤',
    totalCost: '總成本',
    addRenovation: '新增裝修',
    cost: '成本',
    status: '狀態',
    myRenovations: '我的裝修',
    noRenovations: '目前無裝修紀錄',
    deleteRenovation: '刪除裝修',
    confirmDeleteRenovation: '確定要刪除此裝修嗎？',
    
    // Status
    planned: '計劃中',
    inProgress: '進行中',
    completed: '已完成',
    
    // Mortgage Tracker
    mortgageTracker: '貸款追蹤',
    totalRemaining: '剩餘總額',
    monthlyPayment: '每月還款',
    addMortgage: '新增貸款',
    startDate: '開始日期',
    principal: '本金',
    interestRate: '利率',
    term: '期限',
    myMortgages: '我的貸款',
    noMortgages: '目前無貸款紀錄',
    deleteMortgage: '刪除貸款',
    confirmDeleteMortgage: '確定要刪除此貸款嗎？',
    paid: '已付',
    years: '年',
    months: '個月',
    
    // Settings
    settingsTitle: '設定',
    appearance: '外觀',
    themeMode: '主題模式',
    language: '語言',
    dataManagement: '資料管理',
    exportData: '匯出資料',
    exportDescription: '下載所有資料為JSON檔案',
    importData: '匯入資料',
    importDescription: '上傳先前匯出的JSON檔案',
    clearData: '清除所有資料',
    clearDataWarning: '這將永久刪除所有資料',
    about: '關於',
    version: '版本',
    
    // Categories
    food: '飲食',
    transport: '交通',
    entertainment: '娛樂',
    utilities: '水電',
    healthcare: '醫療',
    other: '其他',
    shopping: '購物',
    health: '健康',
    
    // Additional UI
    all: '全部',
    search: '搜尋',
    update: '更新',
    note: '備註',
    noNote: '無備註',
    newExpense: '新增支出',
    editExpense: '編輯支出',
    saveExpense: '儲存支出',
    trackYourSpending: '追蹤你的支出',
    startTracking: '開始追蹤',
    autoCategorizes: '自動分類',
    
    // Budget Buddy
    buddyGreeting: '嗨！我是來幫助你管理預算的！',
    buddyTipSaving: '小提示：試著儲蓄至少20%的收入！',
    buddyTipBudget: '很棒！繼續追蹤你的支出！',
    buddyTipInvesting: '考慮投資以實現長期增長！',
    buddyEncouragement: '你做得很好！繼續加油！',
    
    // Greetings
    goodMorning: '早上好！',
    goodAfternoon: '下午好！',
    goodEvening: '晚上好！',
    autoDecreaseNote: '注意：如果超出預算，預算將自動減少。',
    vsLastMonth: '與上月相比',
    lastMonths: '上個月的',
    byCategory: '按類別',
    noDataYet: '尚無資料',
    totalTransactions: '總交易數',
    investmentROI: '投資報酬率',
    activeMortgages: '活動中的貸款',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'zh' ? 'zh' : 'en') as Language;
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}