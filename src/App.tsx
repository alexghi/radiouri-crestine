import { createClient, Provider } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { fetchExchange } from 'urql';
import { RadioPlayer } from './components/RadioPlayer';
import { Footer } from './components/Footer';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { initGA, pageview } from './lib/analytics.ts';

const client = createClient({
  url: 'https://graphql.radio-crestin.com/v1/graphql',
  exchanges: [cacheExchange(), fetchExchange],
  fetchOptions: () => ({
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  }),
});

function App() {
  // Initialize Google Analytics
  useEffect(() => {
    initGA();
    pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <Provider value={client}>
      <RadioPlayer />
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
          },
        }}
        className="sonner-toaster"
      />
    </Provider>
  );
}

export default App;
