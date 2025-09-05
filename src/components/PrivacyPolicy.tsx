import { useState } from 'react';
import { ArrowLeft, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { privacyContent } from './PrivacyPolicyContent';

type Language = 'en' | 'ro';

export function PrivacyPolicy() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      backButton: 'Back to Radio Player',
      title: 'Privacy Policy',
      lastUpdated: 'Last Updated: January 2025',
    },
    ro: {
      backButton: 'Înapoi la Player Radio',
      title: 'Politica de Confidențialitate',
      lastUpdated: 'Ultima actualizare: Ianuarie 2025',
    }
  };

  const currentContent = privacyContent[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              {content[language].backButton}
            </Link>
            
            {/* Language Toggle */}
            <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  language === 'en' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Globe size={16} />
                English
              </button>
              <button
                onClick={() => setLanguage('ro')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  language === 'ro' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Globe size={16} />
                Română
              </button>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2">{content[language].title}</h1>
          <p className="text-white/70">{content[language].lastUpdated}</p>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 space-y-8 text-white">
          
          {/* Overview */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-200">{currentContent.overview.title}</h2>
            <p className="text-white/80 leading-relaxed">
              {currentContent.overview.description}
            </p>
          </section>

          {/* Data Collection */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-200">{currentContent.dataCollection.title}</h2>
            
            <div className="space-y-6">
              {/* Website Data Collection */}
              <div className="bg-blue-500/10 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-blue-300">{currentContent.dataCollection.website.title}</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-green-300">{currentContent.dataCollection.website.whatWeCollect.title}</h4>
                    <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                      {currentContent.dataCollection.website.whatWeCollect.items.map((item, index) => (
                        <li key={index}><strong>{item.split(':')[0]}</strong>: {item.split(':').slice(1).join(':').trim()}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-blue-300">{currentContent.dataCollection.website.howWeUse.title}</h4>
                    <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                      {currentContent.dataCollection.website.howWeUse.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Extension Data Collection */}
              <div className="bg-purple-500/10 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-purple-300">{currentContent.dataCollection.extension.title}</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-red-300">{currentContent.dataCollection.extension.dontCollect.title}</h4>
                    <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                      {currentContent.dataCollection.extension.dontCollect.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-green-300">{currentContent.dataCollection.extension.storeLocally.title}</h4>
                    <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                      {currentContent.dataCollection.extension.storeLocally.items.map((item, index) => (
                        <li key={index}><strong>{item.split(':')[0]}</strong>: {item.split(':').slice(1).join(':').trim()}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Data Storage */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-200">{currentContent.dataStorage.title}</h2>
            
            <div className="space-y-6">
              {/* Website Storage */}
              <div className="bg-orange-500/10 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-orange-300">{currentContent.dataStorage.websiteStorage.title}</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-yellow-300">{currentContent.dataStorage.websiteStorage.googleAnalytics.title}</h4>
                    <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                      {currentContent.dataStorage.websiteStorage.googleAnalytics.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-yellow-300">{currentContent.dataStorage.websiteStorage.newsletter.title}</h4>
                    <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                      {currentContent.dataStorage.websiteStorage.newsletter.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-yellow-300">{currentContent.dataStorage.websiteStorage.usageAnalytics.title}</h4>
                    <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                      {currentContent.dataStorage.websiteStorage.usageAnalytics.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Extension Storage */}
              <div className="bg-green-500/10 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-green-300">{currentContent.dataStorage.extensionStorage.title}</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-cyan-300">{currentContent.dataStorage.extensionStorage.chromeStorage.title}</h4>
                    <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                      {currentContent.dataStorage.extensionStorage.chromeStorage.items.map((item, index) => (
                        <li key={index}>{item.includes('storage.sync') ? (
                          <>
                            {item.split('storage.sync')[0]}
                            <code className="bg-black/30 px-1 rounded">storage.sync</code>
                            {item.split('storage.sync')[1]}
                          </>
                        ) : item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-cyan-300">{currentContent.dataStorage.extensionStorage.dataControl.title}</h4>
                    <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                      {currentContent.dataStorage.extensionStorage.dataControl.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-200">{currentContent.thirdPartyServices.title}</h2>
            
            <div className="space-y-6">
              {/* Website Third-Party Services */}
              <div className="bg-red-500/10 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-red-300">{currentContent.thirdPartyServices.websiteServices.title}</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-pink-300">{currentContent.thirdPartyServices.websiteServices.googleAnalytics.title}</h4>
                    <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                      {currentContent.thirdPartyServices.websiteServices.googleAnalytics.items.map((item, index) => (
                        <li key={index}>
                          {item.includes('https://policies.google.com/privacy') ? (
                            <>
                              {item.split('https://policies.google.com/privacy')[0]}
                              <a 
                                href="https://policies.google.com/privacy" 
                                className="text-blue-300 hover:text-blue-200 underline" 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                Google Privacy Policy
                              </a>
                            </>
                          ) : item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-pink-300">{currentContent.thirdPartyServices.websiteServices.newsletter.title}</h4>
                    <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                      {currentContent.thirdPartyServices.websiteServices.newsletter.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Shared Services */}
              <div className="bg-yellow-500/10 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-yellow-300">{currentContent.thirdPartyServices.sharedServices.title}</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-lime-300">{currentContent.thirdPartyServices.sharedServices.radioApi.title}</h4>
                    <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                      {currentContent.thirdPartyServices.sharedServices.radioApi.items.map((item, index) => (
                        <li key={index}>
                          {item.includes('api.radiocrestin.ro') ? (
                            <>
                              {item.split('api.radiocrestin.ro')[0]}
                              <code className="bg-black/30 px-1 rounded">api.radiocrestin.ro</code>
                              {item.split('api.radiocrestin.ro')[1]}
                            </>
                          ) : item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-lime-300">{currentContent.thirdPartyServices.sharedServices.audioStreaming.title}</h4>
                    <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                      {currentContent.thirdPartyServices.sharedServices.audioStreaming.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-lime-300">{currentContent.thirdPartyServices.sharedServices.cdn.title}</h4>
                    <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                      {currentContent.thirdPartyServices.sharedServices.cdn.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Permissions */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-200">{currentContent.permissions.title}</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-cyan-300">{currentContent.permissions.storage.title}</h3>
                <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                  {currentContent.permissions.storage.items.map((item, index) => (
                    <li key={index}><strong>{item.split(':')[0]}</strong>: {item.split(':').slice(1).join(':').trim()}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-cyan-300">{currentContent.permissions.hostPermissions.title}</h3>
                <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                  {currentContent.permissions.hostPermissions.items.map((item, index) => (
                    <li key={index}><strong>{item.split(':')[0]}</strong>: {item.split(':').slice(1).join(':').trim()}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-200">{currentContent.dataSecurity.title}</h2>
            <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
              {currentContent.dataSecurity.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-200">{currentContent.cookies.title}</h2>
            
            <div className="space-y-6">
              <div className="bg-indigo-500/10 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-indigo-300">{currentContent.cookies.websiteCookies.title}</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-blue-300">{currentContent.cookies.websiteCookies.essential.title}</h4>
                    <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                      {currentContent.cookies.websiteCookies.essential.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-blue-300">{currentContent.cookies.websiteCookies.analytics.title}</h4>
                    <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                      {currentContent.cookies.websiteCookies.analytics.items.map((item, index) => (
                        <li key={index}>
                          {item.includes('_ga') || item.includes('_gid') ? (
                            <>
                              <code className="bg-black/30 px-1 rounded">{item.split(':')[0]}</code>
                              : {item.split(':').slice(1).join(':').trim()}
                            </>
                          ) : item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-blue-300">{currentContent.cookies.websiteCookies.managing.title}</h4>
                    <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                      {currentContent.cookies.websiteCookies.managing.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* User Rights */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-200">{currentContent.userRights.title}</h2>
            
            <div className="space-y-6">
              {/* Website Controls */}
              <div className="bg-green-500/10 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-green-300">{currentContent.userRights.websiteControls.title}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-emerald-300">{currentContent.userRights.websiteControls.youCan.title}</h4>
                    <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                      {currentContent.userRights.websiteControls.youCan.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-red-300">{currentContent.userRights.websiteControls.dataRights.title}</h4>
                    <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                      {currentContent.userRights.websiteControls.dataRights.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Extension Controls */}
              <div className="bg-purple-500/10 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-purple-300">{currentContent.userRights.extensionControls.title}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-violet-300">{currentContent.userRights.extensionControls.youCan.title}</h4>
                    <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                      {currentContent.userRights.extensionControls.youCan.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-red-300">{currentContent.userRights.extensionControls.limitations.title}</h4>
                    <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                      {currentContent.userRights.extensionControls.limitations.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-200">{currentContent.childrensPrivacy.title}</h2>
            <p className="text-white/80 leading-relaxed">
              {currentContent.childrensPrivacy.description}
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-200">{currentContent.contact.title}</h2>
            <p className="text-white/80 leading-relaxed">
              {currentContent.contact.description}
            </p>
            <ul className="list-disc list-inside space-y-1 text-white/80 ml-4 mt-2">
              <li>{currentContent.contact.website.includes('https://radiouri-crestine.ro/') ? (
                <>
                  {currentContent.contact.website.split('https://radiouri-crestine.ro/')[0]}
                  <a href="https://radiouri-crestine.ro/" className="text-blue-300 hover:text-blue-200 underline">https://radiocrestin.ro</a>
                </>
              ) : currentContent.contact.website}</li>
              <li>{currentContent.contact.extension}</li>
            </ul>
          </section>

          {/* Compliance */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-purple-200">{currentContent.compliance.title}</h2>
            <p className="text-white/80 leading-relaxed mb-3">
              {currentContent.compliance.description}
            </p>
            <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
              {currentContent.compliance.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Summary */}
          <section className="border-t border-white/20 pt-8">
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4 text-white">{currentContent.summary.title}</h2>
              <div className="space-y-3">
                <p className="text-white/90 leading-relaxed text-lg">
                  <strong>{language === 'en' ? 'Website (radiocrestin.ro)' : 'Site Web (radiocrestin.ro)'}</strong>: {currentContent.summary.website}
                </p>
                <p className="text-white/90 leading-relaxed text-lg">
                  <strong>{language === 'en' ? 'Chrome Extension' : 'Extensie Chrome'}</strong>: {currentContent.summary.extension}
                </p>
                <p className="text-white/90 leading-relaxed text-lg">
                  {currentContent.summary.conclusion}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/60">
          <p>© 2025 Radio Creștin. {language === 'en' ? 'All rights reserved.' : 'Toate drepturile rezervate.'}</p>
        </div>
      </div>
    </div>
  );
}