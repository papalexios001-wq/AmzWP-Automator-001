import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { ErrorBoundary } from 'react-error-boundary';
import { AppProviders } from './providers/app-providers';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 30,
    },
  },
});

const rootElement = document.getElementById('root')!;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div className="min-h-screen bg-dark-950 flex items-center justify-center p-8">
          <div className="bg-dark-900 border border-red-500/30 rounded-3xl p-8 max-w-lg text-center">
            <h1 className="text-2xl font-black text-white mb-4">Application Error</h1>
            <p className="text-gray-400 mb-6">{error.message}</p>
            <button
              onClick={resetErrorBoundary}
              className="bg-white text-dark-950 px-6 py-3 rounded-xl font-bold hover:bg-brand-500 hover:text-white transition-all"
            >
              Try again
            </button>
          </div>
        </div>
      )}
    >
      <QueryClientProvider client={queryClient}>
        <AppProviders>
          <App />
          <Toaster richColors position="top-right" />
        </AppProviders>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
