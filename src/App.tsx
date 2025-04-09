import { createClient, Provider } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { fetchExchange } from "urql";
import { RadioPlayer } from "./components/RadioPlayer";
import { Footer } from "./components/Footer";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const client = createClient({
  url: "https://graphql.radio-crestin.com/v1/graphql",
  exchanges: [cacheExchange(), fetchExchange],
  fetchOptions: () => ({
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  }),
});

function App() {
  return (
    <Provider value={client}>
      <RadioPlayer />
      <GoogleReCaptchaProvider
        reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} // Replace with your actual site key
        scriptProps={{
          async: true,
          defer: true,
          appendTo: "head",
        }}
        container={{
          element: "recaptcha-container", // This should match the ID of the div in NewsletterForm
          parameters: {
            badge: "bottomright", // Position of the badge
            theme: "light",
          },
        }}
      >
        <Footer />
      </GoogleReCaptchaProvider>
    </Provider>
  );
}

export default App;
