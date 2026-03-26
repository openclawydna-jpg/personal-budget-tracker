import { useState } from 'react';
import { useSimpleData } from './SimpleDataContext';
import { Plus, Trash2 } from 'lucide-react';

export function SimpleExpenseTracker() {
  const { data, addExpense, deleteExpense } = useSimpleData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const categories = ['food', 'transport', 'shopping', 'entertainment', 'utilities', 'health', 'other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    addExpense({
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      note: formData.note || `Expense on ${formData.category}`
    });

    // Reset form
    setFormData({
      amount: '',
      category: 'food',
      date: new Date().toISOString().split('T')[0],
      note: ''
    });
    setShowForm(false);
  };

  const categoryColors: Record<string, string> = {
    food: '#c4432b',
    transport: '#2d7d6f',
    shopping: '#3d5a80',
    entertainment: '#e09f3e',
    utilities: '#9b5de5',
    health: '#e07a5f',
    other: '#8a8578'
  };

  const categoryTotals = data.expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalSpent = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Personal Budget Tracker</h1>
          <p className="text-gray-600">Track your expenses easily</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Savings Balance</div>
          <div className="text-2xl font-bold text-green-600">${data.savingsBalance.toFixed(2)}</div>
        </div>
      </div>

      {/* Add Expense Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        {showForm ? 'Cancel' : 'Add New Expense'}
      </button>

      {/* Expense Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Add Expense</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
                <input
                  type="text"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="What was this for?"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Save Expense
            </button>
          </form>
        </div>
      )}

      {/* Category Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map(cat => {
          const total = categoryTotals[cat] || 0;
          const budget = data.budgets[cat] || 100;
          const percentage = Math.min((total / budget) * 100, 100);
          
          return (
            <div key={cat} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: categoryColors[cat] }}
                />
                <span className="text-sm font-medium text-gray-700 capitalize">{cat}</span>
              </div>
              <div className="text-lg font-bold">${total.toFixed(2)}</div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full transition-all"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: categoryColors[cat]
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ${total.toFixed(0)} / ${budget}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Expenses */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Recent Expenses</h2>
          <p className="text-sm text-gray-600">Total spent: ${totalSpent.toFixed(2)}</p>
        </div>
        
        {data.expenses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No expenses yet. Add your first expense above!
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {data.expenses.slice(0, 10).map((expense) => (
              <div key={expense.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: categoryColors[expense.category] }}
                  />
                  <div>
                    <div className="font-medium">{expense.note}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="capitalize">{expense.category}</span>
                      <span>•</span>
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-lg font-bold">${expense.amount.toFixed(2)}</div>
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete expense"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {data.expenses.length > 10 && (
          <div className="px-6 py-3 border-t border-gray-200 text-center text-sm text-gray-600">
            Showing 10 of {data.expenses.length} expenses
          </div>
        )}
      </div>

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {new Date(data.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
}