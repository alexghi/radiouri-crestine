import { useState, useEffect, useCallback, useRef } from "react";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Mail } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { executeRecaptcha } = useGoogleReCaptcha();
  const recaptchaRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    "idle" | "success" | "error" | "captcha-error"
  >("idle");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Don't proceed if form is already submitting
    if (loading) return;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
      return;
    }

    // Check if reCAPTCHA is available
    if (!executeRecaptcha) {
      setMessage("reCAPTCHA not available yet");
      return;
    }

    try {
      setLoading(true);
      setMessage("Submitting...");

      // Execute reCAPTCHA with action name
      const captchaToken = await executeRecaptcha("newsletterSubmit");

      // Send the form data and token to your backend
      // First verify the reCAPTCHA token
      console.log("first verify", captchaToken);
      const captchaResponse = await fetch("/api/subscribe-newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recaptchaToken: captchaToken }),
      });

      const data = await captchaResponse.json();

      if (captchaResponse.ok) {
        setMessage("Thank you for subscribing!");
        setEmail("");
      } else {
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
      console.error("Newsletter submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
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
                viața mea.” - Psalmii 116:1-2
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-6 text-xl">
                Abonează-te la newsletter
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full bg-white/5 hover:bg-white/10 focus:bg-white/10 text-white placeholder-gray-300 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 ring-purple-500 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl py-3 transition-all transform hover:scale-[1.02] ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe to Newsletter"}
                </button>

                {subscriptionStatus === "success" && (
                  <div className="bg-green-500/20 text-green-200 px-4 py-3 rounded-xl">
                    Thank you for subscribing!
                  </div>
                )}
                {subscriptionStatus === "error" && (
                  <div className="bg-red-500/20 text-red-200 px-4 py-3 rounded-xl">
                    Something went wrong. Please try again.
                  </div>
                )}
                {subscriptionStatus === "captcha-error" && (
                  <div className="bg-yellow-500/20 text-yellow-200 px-4 py-3 rounded-xl">
                    reCAPTCHA verification failed. Please try again.
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <div className="text-center space-y-2">
              <p className="text-gray-200">
                © {new Date().getFullYear()} Radio Creștin. All rights reserved.
              </p>
              <p className="text-gray-200">
                Made with <span className="text-red-500">❤️</span> in
                Transylvania
              </p>
            </div>
          </div>
        </div>
      </footer>
       {/* This div is used as a placeholder for reCAPTCHA */}
       <div id="recaptcha-container" ref={recaptchaRef}></div>
    </div>      
  );
}
