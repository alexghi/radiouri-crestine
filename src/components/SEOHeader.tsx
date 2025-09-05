import React from 'react';
import { Radio, Play, Heart, Globe } from 'lucide-react';

export function SEOHeader() {
  return (
    <header className="relative bg-gradient-to-r from-purple-900/90 via-blue-900/90 to-purple-900/90 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Radio Creștin Online
            <span className="block text-2xl md:text-3xl text-purple-200 mt-2">
              Posturi Radio Creștine Live 24/7
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            Descoperă cele mai bune <strong>radiouri creștine</strong> din România și din întreaga lume. 
            Ascultă <strong>posturi radio creștine</strong> cu muzică creștină, predici inspiraționale și emisiuni spirituale.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <Radio className="w-12 h-12 text-purple-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Radio Creștin Live</h3>
              <p className="text-white/80 text-sm">
                Posturi radio creștine live 24/7 cu muzică creștină și predici inspiraționale
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <Play className="w-12 h-12 text-purple-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Radiouri Creștine Gratuite</h3>
              <p className="text-white/80 text-sm">
                Ascultă gratuit radiouri creștine online fără înregistrare sau descărcare
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <Heart className="w-12 h-12 text-purple-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Posturi Creștine Favorite</h3>
              <p className="text-white/80 text-sm">
                Salvează posturile tale creștine preferate pentru acces rapid
              </p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-left">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Globe className="w-8 h-8 text-purple-300" />
              De ce să alegi Radio Creștin?
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-white/90">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-purple-300 font-bold">✓</span>
                  <span><strong>Posturi radio creștine</strong> de calitate superioară din România și internațional</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-300 font-bold">✓</span>
                  <span><strong>Radiouri creștine live</strong> cu transmisiune în timp real 24/7</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-300 font-bold">✓</span>
                  <span>Muzică creștină contemporană și tradițională</span>
                </li>
              </ul>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-purple-300 font-bold">✓</span>
                  <span>Predici și studii biblice inspiraționale</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-300 font-bold">✓</span>
                  <span>Interfață prietenoasă și ușor de utilizat</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-300 font-bold">✓</span>
                  <span>Acces gratuit fără înregistrare</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
