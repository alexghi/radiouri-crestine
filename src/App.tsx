import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { RadioPlayer } from './components/RadioPlayer';
import { Footer } from './components/Footer';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { ExtensionShowcase } from './components/ExtensionShowcase';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { initGA, pageview } from './lib/analytics.ts';

function HomePage() {
  return (
    <div className="relative">
      <RadioPlayer />
      <Footer />
    </div>
  );
}

function App() {
  // Initialize Google Analytics
  useEffect(() => {
    initGA();
    pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={import.meta.env.VITE_RECAPTCHA_KEY || ''}
      useEnterprise={true}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
        nonce: undefined,
      }}
    >
      <Router>
        <Routes>
          <Route
            path="/"
            element={<HomePage />}
          />
          <Route
            path="/privacy-policy"
            element={<PrivacyPolicy />}
          />
          <Route
            path="/extension"
            element={<ExtensionShowcase />}
          />
        </Routes>

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
      </Router>
    </GoogleReCaptchaProvider>
  );
}

export default App;
