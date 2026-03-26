# Personal Budget Tracker

A simple web app to track personal expenses with natural language input via OpenClaw.

## Features

- 📱 **Simple Interface** - Easy expense tracking
- 💬 **Natural Language Input** - Message OpenClaw: "Spent $15 on lunch"
- 📊 **Category Budgets** - Track spending by category
- 💰 **Savings Balance** - Automatic savings tracking
- 🌐 **Access Anywhere** - Deployed on Vercel

## How It Works

1. **Add Expenses**: Message OpenClaw with your expenses
   - "Spent $15 on lunch at McDonald's"
   - "Bought groceries for $45.50"
   - "Paid $30 for Uber ride"

2. **View Budget**: Visit the web app anytime
   - See all expenses
   - Check category budgets
   - Monitor savings balance

3. **Data Storage**: Expenses stored in GitHub
   - Secure and private
   - Accessible from anywhere
   - Automatic backups

## Deployment

This app is deployed on Vercel: **https://personal-budget-tracker.vercel.app**

### Local Development
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
```

## OpenClaw Integration

The app integrates with OpenClaw via a custom skill:
- Parses natural language expense messages
- Updates data.json in GitHub repository
- Triggers Vercel redeploy for live updates

## Data Structure

All data is stored in `data.json`:
```json
{
  "expenses": [],
  "budgets": {},
  "settings": {},
  "savingsBalance": 1000,
  "lastUpdated": "2026-03-27T00:00:00.000Z"
}
```

## Security

- GitHub token stored securely in OpenClaw workspace
- No sensitive data in repository
- Private expense tracking

## License

MIT