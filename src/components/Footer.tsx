import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import NewsletterForm from './NewsletterForm.tsx';

export function Footer() {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={import.meta.env.VITE_RECAPTCHA_KEY}
      useEnterprise={true}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
        nonce: undefined,
      }}
    >
      <div>
        <footer className="bg-black/90 backdrop-blur-lg border-t border-white/5">
          <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
              <div>
                <h3 className="text-white font-bold mb-6 text-xl">
                  Radio Creștin
                </h3>
                <p className="text-gray-100 leading-relaxed">
                  „Iubesc pe Domnul, căci El aude glasul meu, cererile mele. Da,
                  El Și-a plecat urechea spre mine, de aceea-L voi chema toată
                  viața mea." - Psalmii 116:1-2
                </p>
              </div>
              <NewsletterForm />
            </div>

            <div className="border-t border-white/10 pt-8">
              <div className="text-center space-y-2">
                <p className="text-gray-200">
                  © {new Date().getFullYear()} Radio Creștin. All rights
                  reserved.
                </p>
                <p className="text-gray-200">
                  Made with <span className="text-red-500">❤️</span> in
                  Transylvania
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </GoogleReCaptchaProvider>
  );
}
