// GitHub Configuration from environment variables
// These values are set in .env file for security

export const getGitHubConfig = () => {
  return {
    username: import.meta.env.VITE_GITHUB_USERNAME || 'openclawydna-jpg',
    repo: import.meta.env.VITE_GITHUB_REPO || 'personal-budget-tracker',
    token: import.meta.env.VITE_GITHUB_TOKEN || undefined, // undefined if no token (read-only mode)
  };
};

// App configuration
export const APP_CONFIG = {
  title: import.meta.env.VITE_APP_TITLE || 'Personal Budget Tracker',
  defaultSavings: parseInt(import.meta.env.VITE_DEFAULT_SAVINGS || '1000', 10),
};