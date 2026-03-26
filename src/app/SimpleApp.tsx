import { SimpleDataProvider } from './components/SimpleDataContext';
import { SimpleExpenseTracker } from './components/SimpleExpenseTracker';

export default function SimpleApp() {
  return (
    <SimpleDataProvider>
      <div className="min-h-screen bg-gray-50">
        <SimpleExpenseTracker />
        
        {/* Footer */}
        <div className="mt-8 p-4 text-center text-sm text-gray-600">
          <p>Your budget data is saved locally in your browser.</p>
          <p className="mt-1">Message me to add expenses: "Spent $15 on lunch"</p>
        </div>
      </div>
    </SimpleDataProvider>
  );
}