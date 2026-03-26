// Expense Parser for Budget Tracker
// This script parses natural language expense messages and updates the data.json file

const fs = require('fs');
const path = require('path');

// Load data
const dataPath = path.join(__dirname, 'data.json');
let data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Category mapping from keywords
const CATEGORY_KEYWORDS = {
  food: ['food', 'restaurant', 'lunch', 'dinner', 'breakfast', 'cafe', 'coffee', 'meal', 'groceries', 'snack', 'eat', 'drink', '麦当劳', '餐廳', '午餐', '晚餐', '早餐', '咖啡', '食物'],
  transport: ['uber', 'taxi', 'bus', 'train', 'subway', 'metro', 'gas', 'fuel', 'petrol', 'parking', 'transport', 'commute', '地鐵', '巴士', '的士', '交通', '油費'],
  shopping: ['shop', 'store', 'mall', 'amazon', 'clothes', 'shoes', 'electronics', 'gadget', 'buy', 'purchase', '購物', '買', '商店', '網購'],
  entertainment: ['movie', 'cinema', 'concert', 'game', 'netflix', 'spotify', 'youtube', 'music', 'entertainment', 'fun', 'hobby', '電影', '音樂', '遊戲', '娛樂'],
  utilities: ['electric', 'electricity', 'water', 'internet', 'phone', 'bill', 'rent', 'mortgage', 'utility', '電費', '水費', '上網', '電話', '租金'],
  health: ['doctor', 'hospital', 'medicine', 'pharmacy', 'drug', 'health', 'medical', 'gym', 'fitness', 'exercise', '醫生', '醫院', '藥', '健身'],
  other: ['other', 'misc', 'miscellaneous', '其他', '雜項']
};

// Parse natural language expense message
function parseExpenseMessage(message) {
  console.log('Parsing message:', message);
  
  // Extract amount (look for $ followed by numbers, or numbers followed by $)
  const amountMatch = message.match(/\$?(\d+(?:\.\d{1,2})?)/) || message.match(/(\d+(?:\.\d{1,2})?)\s*(?:dollars|dollar|usd|hkd)/i);
  if (!amountMatch) {
    throw new Error('Could not find amount in message');
  }
  
  const amount = parseFloat(amountMatch[1]);
  
  // Determine category from keywords
  let category = 'other';
  const lowerMessage = message.toLowerCase();
  
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      category = cat;
      break;
    }
  }
  
  // Extract note (try to get context)
  let note = message.trim();
  
  // Generate a friendly note if none provided
  if (note.length < 20) {
    const today = new Date();
    const timeOfDay = today.getHours() < 12 ? 'morning' : 
                     today.getHours() < 18 ? 'afternoon' : 'evening';
    note = `Expense on ${category} (${timeOfDay})`;
  }
  
  return {
    amount,
    category,
    date: new Date().toISOString().split('T')[0], // Today's date
    note: note.substring(0, 100) // Limit note length
  };
}

// Add expense to data
function addExpense(expenseData) {
  const newExpense = {
    id: Date.now().toString(),
    amount: expenseData.amount,
    category: expenseData.category,
    date: expenseData.date,
    note: expenseData.note,
    createdAt: Date.now()
  };
  
  // Add to expenses array
  data.expenses.unshift(newExpense); // Add to beginning
  
  // Update savings balance (deduct expense)
  data.savingsBalance = Math.max(0, data.savingsBalance - expenseData.amount);
  
  // Update lastUpdated timestamp
  data.lastUpdated = new Date().toISOString();
  
  // Save to file
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  
  console.log('Expense added:', newExpense);
  console.log('New savings balance:', data.savingsBalance);
  
  return newExpense;
}

// Get summary
function getSummary() {
  const categoryTotals = data.expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  
  const totalSpent = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
  
  return {
    savingsBalance: data.savingsBalance,
    totalSpent,
    categoryTotals,
    expenseCount: data.expenses.length,
    lastUpdated: data.lastUpdated
  };
}

// Reset data (for testing)
function resetData() {
  data = {
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
    savingsBalance: 1000,
    lastUpdated: new Date().toISOString()
  };
  
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  console.log('Data reset to defaults');
}

// Command line interface
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'add':
      const message = process.argv.slice(3).join(' ');
      try {
        const expense = parseExpenseMessage(message);
        const result = addExpense(expense);
        console.log(`✅ Added: $${result.amount} for ${result.category} - "${result.note}"`);
        console.log(`💰 New savings: $${data.savingsBalance.toFixed(2)}`);
      } catch (error) {
        console.error('❌ Error:', error.message);
      }
      break;
      
    case 'summary':
      const summary = getSummary();
      console.log('📊 Budget Summary:');
      console.log(`💰 Savings: $${summary.savingsBalance.toFixed(2)}`);
      console.log(`💸 Total Spent: $${summary.totalSpent.toFixed(2)}`);
      console.log(`📝 Expenses: ${summary.expenseCount}`);
      console.log('📈 By Category:');
      Object.entries(summary.categoryTotals).forEach(([cat, total]) => {
        console.log(`  ${cat}: $${total.toFixed(2)}`);
      });
      break;
      
    case 'reset':
      resetData();
      console.log('✅ Data reset to defaults');
      break;
      
    case 'list':
      console.log('📋 Recent Expenses (last 10):');
      data.expenses.slice(0, 10).forEach(exp => {
        console.log(`  ${exp.date} - $${exp.amount.toFixed(2)} - ${exp.category} - "${exp.note}"`);
      });
      break;
      
    default:
      console.log('Usage:');
      console.log('  node expense-parser.js add "Spent $15 on lunch at McDonald\'s"');
      console.log('  node expense-parser.js summary');
      console.log('  node expense-parser.js list');
      console.log('  node expense-parser.js reset');
  }
}

module.exports = {
  parseExpenseMessage,
  addExpense,
  getSummary,
  resetData
};