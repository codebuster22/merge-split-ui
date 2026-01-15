import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { config } from './config/wagmi';
import { WalletModeProvider } from './contexts/WalletModeContext';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletModeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </WalletModeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
