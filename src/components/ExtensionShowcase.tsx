import { ExternalLink, Chrome, Download } from 'lucide-react';

export function ExtensionShowcase() {
  const chromeExtensionUrl = 'https://chromewebstore.google.com/detail/radio-crestin-player/jlonffcobidjifacnlcpifpocknmchnk';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Radio Creștin Browser Extension
          </h1>
          <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto">
            Ascultă posturile tale favorite de radio creștine direct din browser cu extensia noastră Chrome
          </p>
          
          <a
            href={chromeExtensionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 text-lg"
          >
            <Chrome className="w-6 h-6" />
            Instalează din Chrome Web Store
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">
              Experiența completă în browser
            </h2>
            <p className="text-purple-200 text-lg leading-relaxed">
              Extensia Radio Creștin Player îți oferă acces direct la toate posturile de radio creștine preferate, 
              direct din bara de instrumente a browser-ului. Streamează în HD, gestionează favoritele și controlează 
              redarea fără să părăsești pagina curentă.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-purple-200">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Streaming HD de înaltă calitate</span>
              </div>
              <div className="flex items-center gap-3 text-purple-200">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Gestionare favoritel</span>
              </div>
              <div className="flex items-center gap-3 text-purple-200">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Interfață simplă și intuitivă</span>
              </div>
              <div className="flex items-center gap-3 text-purple-200">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Acces rapid din bara de instrumente</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="/images/marquee_promo_resized.png" 
              alt="Radio Creștin Player Extension Preview"
              className="w-full rounded-lg shadow-2xl"
            />
          </div>
        </div>

        {/* Feature Screenshots Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Caracteristici principale
          </h2>
          
          {/* Main Player Interface */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">
                Player Principal
              </h3>
              <p className="text-purple-200 text-lg leading-relaxed">
                Interfață elegantă cu toate controalele necesare: play/pause, control volum, 
                informații despre melodia curentă și numărul de ascultători în timp real.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-purple-200">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span>Display pentru melodia curentă</span>
                </div>
                <div className="flex items-center gap-3 text-purple-200">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span>Controale audio intuitive</span>
                </div>
                <div className="flex items-center gap-3 text-purple-200">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span>Numărul de ascultători live</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/images/1_resized.png" 
                alt="Main Player Interface"
                className="w-full max-w-md mx-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>

          {/* Favorites Management */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative md:order-2">
              <img 
                src="/images/2_resized.png" 
                alt="Favorites Management"
                className="w-full max-w-md mx-auto rounded-lg shadow-2xl"
              />
            </div>
            <div className="space-y-6 md:order-1">
              <h3 className="text-2xl font-bold text-white">
                Gestionarea Favoritelor
              </h3>
              <p className="text-purple-200 text-lg leading-relaxed">
                Salvează și organizează posturile tale preferate pentru acces rapid. 
                Favoritele se sincronizează pe toate dispozitivele cu Chrome.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-purple-200">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span>Sincronizare cross-device</span>
                </div>
                <div className="flex items-center gap-3 text-purple-200">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span>Acces rapid la posturi</span>
                </div>
                <div className="flex items-center gap-3 text-purple-200">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span>Organizare personalizată</span>
                </div>
              </div>
            </div>
          </div>

          {/* Browse All Stations */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">
                Explorează Toate Posturile
              </h3>
              <p className="text-purple-200 text-lg leading-relaxed">
                Descoperă noi posturi de radio creștine din catalogul complet. 
                Fiecare post vine cu informații despre genul muzical și descriere.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-purple-200">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                  <span>Catalog complet de posturi</span>
                </div>
                <div className="flex items-center gap-3 text-purple-200">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                  <span>Informații despre genuri muzicale</span>
                </div>
                <div className="flex items-center gap-3 text-purple-200">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                  <span>Adăugare rapidă la favorite</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/images/3_resized.png" 
                alt="Browse All Stations"
                className="w-full max-w-md mx-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>

          {/* Streaming Controls */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative md:order-2">
              <img 
                src="/images/4_resized.png" 
                alt="Streaming Controls"
                className="w-full max-w-md mx-auto rounded-lg shadow-2xl"
              />
            </div>
            <div className="space-y-6 md:order-1">
              <h3 className="text-2xl font-bold text-white">
                Streaming și Controale
              </h3>
              <p className="text-purple-200 text-lg leading-relaxed">
                Tehnologie de streaming avansată cu încărcare rapidă și controale precise. 
                Status în timp real pentru o experiență de ascultare optimă.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-purple-200">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                  <span>Streaming HLS de înaltă calitate</span>
                </div>
                <div className="flex items-center gap-3 text-purple-200">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                  <span>Feedback vizual pentru încărcare</span>
                </div>
                <div className="flex items-center gap-3 text-purple-200">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                  <span>Controale audio responsive</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative md:order-2">
            <img 
              src="/images/small_promo_resized.png" 
              alt="Radio Creștin Player Extension Small Preview"
              className="w-full max-w-md mx-auto rounded-lg shadow-2xl"
            />
          </div>
          
          <div className="space-y-6 md:order-1">
            <h2 className="text-3xl font-bold text-white">
              Design compact și eficient
            </h2>
            <p className="text-purple-200 text-lg leading-relaxed">
              Interface-ul nostru compact se integrează perfect în experiența ta de navigare, 
              oferind toate funcțiile esențiale într-un design elegant și ușor de utilizat.
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Instalare rapidă</h3>
              <p className="text-purple-200 mb-4">
                Instalează extensia în doar câteva click-uri și începe să asculți imediat posturile tale preferate.
              </p>
              <a
                href={chromeExtensionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Accesează Chrome Web Store
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-16 pt-16 border-t border-white/20">
          <p className="text-purple-300">
            Înapoi la <a href="/" className="text-blue-300 hover:text-blue-200 underline">aplicația web</a>
          </p>
        </div>
      </div>
    </div>
  );
}