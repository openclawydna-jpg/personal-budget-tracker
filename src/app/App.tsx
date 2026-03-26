import { RouterProvider } from 'react-router';
import { router } from './routes';
import { DataProvider } from './components/DataContext';
import { ThemeProvider } from './components/ThemeProvider';
import { LanguageProvider } from './components/LanguageContext';

/**
 * Main App Component
 * Sets up routing, data context, and theme management
 */
export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <DataProvider>
          <RouterProvider router={router} />
        </DataProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}