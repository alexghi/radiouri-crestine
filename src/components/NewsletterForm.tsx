import { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Mail } from 'lucide-react';
import * as yup from 'yup';
import { toast } from 'sonner';
import { newsletterValidationSchema } from './utils/validators.ts';
import { trackNewsletterSubscribe } from '../lib/analytics.ts';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [subscriptionStatus, setSubscriptionStatus] = useState<
    'idle' | 'success' | 'error' | 'captcha-error'
  >('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      await newsletterValidationSchema.validate(
        { email },
        { abortEarly: false },
      );
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errorMessage = error.errors[0];
        toast.error(errorMessage, {
          style: {
            background: '#fecaca',
            color: '#7f1d1d',
            border: '1px solid #f87171',
          },
        });
      }
      return;
    }

    if (!executeRecaptcha) {
      toast.error('reCAPTCHA not ready. Please try again.', {
        style: {
          background: '#fecaca',
          color: '#7f1d1d',
          border: '1px solid #f87171',
        },
      });
      return;
    }

    try {
      setLoading(true);
      toast('Submitting...', {
        style: {
          background: '#581c87',
          color: '#ffffff',
          border: '1px solid #7c3aed',
        },
      });

      // Execute reCAPTCHA when form is submitted
      const recaptchaToken = await executeRecaptcha('newsletterSubmit');
      console.log('reCAPTCHA token:', recaptchaToken);

      const response = await fetch('/api/subscribe-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recaptchaToken: recaptchaToken,
          email: email,
        }),
      });

      // Analytics will be tracked after successful response

      let data;
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text:', responseText);
        toast.error('Server error. Please try again later.', {
          style: {
            background: '#fecaca',
            color: '#7f1d1d',
            border: '1px solid #f87171',
          },
        });
        setSubscriptionStatus('error');
        trackNewsletterSubscribe(false, email);
        return;
      }

      if (response.ok) {
        toast.success('Thank you for subscribing!', {
          style: {
            background: '#9333ea',
            color: '#ffffff',
            border: '1px solid #9333ea',
          },
        });
        setEmail('');
        setSubscriptionStatus('success');
        trackNewsletterSubscribe(true, email);
      } else {
        toast.error(
          data.message ||
            data.error ||
            'Something went wrong. Please try again.',
          {
            style: {
              background: '#fecaca',
              color: '#7f1d1d',
              border: '1px solid #f87171',
            },
          },
        );
        setSubscriptionStatus('error');
        trackNewsletterSubscribe(false, email);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.', {
        style: {
          background: '#fecaca',
          color: '#7f1d1d',
          border: '1px solid #f87171',
        },
      });
      console.error('Newsletter submission error:', error);
      setSubscriptionStatus('error');
      trackNewsletterSubscribe(false, email);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-white font-bold mb-6 text-xl">
        Abonează-te la newsletter
      </h3>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="relative">
          <Mail
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200"
          />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="w-full bg-white/5 hover:bg-white/10 focus:bg-white/10 text-white placeholder-gray-300 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 ring-purple-500 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl py-3 transition-all transform hover:scale-[1.02] ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Subscribing...' : 'Subscribe to Newsletter'}
        </button>

        {subscriptionStatus === 'success' && (
          <div className="bg-green-500/20 text-green-200 px-4 py-3 rounded-xl">
            Thank you for subscribing!
          </div>
        )}
        {subscriptionStatus === 'error' && (
          <div className="bg-red-500/20 text-red-200 px-4 py-3 rounded-xl">
            Something went wrong. Please try again.
          </div>
        )}
        {subscriptionStatus === 'captcha-error' && (
          <div className="bg-yellow-500/20 text-yellow-200 px-4 py-3 rounded-xl">
            reCAPTCHA verification failed. Please try again.
          </div>
        )}
      </form>
    </div>
  );
};

export function Footer() {
  return (
    <div>
      <footer className="bg-black/90 backdrop-blur-lg border-t border-white/5">
        <div className="container mx-auto px-4 py-16">
          {/* SEO Content Section */}
          <div className="mb-12 bg-white/5 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-white font-bold mb-6 text-2xl">
              Radio Creștin - Posturi Radio Creștine Online
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-white/80 leading-relaxed">
              <div>
                <p className="mb-4">
                  <strong>Radio Creștin</strong> este platforma ta de încredere
                  pentru <strong>radiouri creștine online</strong>. Oferim acces
                  gratuit la cele mai bune{' '}
                  <strong>posturi radio creștine</strong> din România și din
                  întreaga lume.
                </p>
                <p className="mb-4">
                  Fiecare <strong>post radio creștin</strong> din colecția
                  noastră este selectat cu grijă pentru a-ți oferi cea mai bună
                  experiență de ascultare a muzicii creștine, predicilor și
                  emisiunilor spirituale.
                </p>
              </div>
              <div>
                <p className="mb-4">
                  Platforma noastră îți permite să asculți{' '}
                  <strong>radio creștin live</strong> 24/7, să salvezi{' '}
                  <strong>posturile creștine</strong> preferate și să descoperi
                  noi
                  <strong>radiouri creștine</strong> care să-ți îmbogățească
                  viața spirituală.
                </p>
                <p>
                  Indiferent dacă preferi muzica creștină contemporană sau
                  tradițională, vei găsi <strong>posturi radio</strong>{' '}
                  potrivite pentru fiecare moment al zilei.
                </p>
              </div>
            </div>
          </div>

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
              <p className="text-gray-400 text-sm mt-4">
                Cuvinte cheie: radio crestin, radiouri crestine, posturi radio,
                posturi crestine, radio crestin online, radiouri crestine live
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default NewsletterForm;
