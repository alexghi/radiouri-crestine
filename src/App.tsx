import { RadioPlayer } from './components/RadioPlayer';
import { Footer } from './components/Footer';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { initGA, pageview } from './lib/analytics.ts';

function App() {
  // Initialize Google Analytics
  useEffect(() => {
    initGA();
    pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <div className="relative">
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
    </div>
  );
}

export default App;
