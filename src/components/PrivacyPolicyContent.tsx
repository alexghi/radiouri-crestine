interface PrivacyContent {
  overview: {
    title: string;
    description: string;
  };
  dataCollection: {
    title: string;
    website: {
      title: string;
      whatWeCollect: {
        title: string;
        items: string[];
      };
      howWeUse: {
        title: string;
        items: string[];
      };
    };
    extension: {
      title: string;
      dontCollect: {
        title: string;
        items: string[];
      };
      storeLocally: {
        title: string;
        items: string[];
      };
    };
  };
  dataStorage: {
    title: string;
    websiteStorage: {
      title: string;
      googleAnalytics: {
        title: string;
        items: string[];
      };
      newsletter: {
        title: string;
        items: string[];
      };
      usageAnalytics: {
        title: string;
        items: string[];
      };
    };
    extensionStorage: {
      title: string;
      chromeStorage: {
        title: string;
        items: string[];
      };
      dataControl: {
        title: string;
        items: string[];
      };
    };
  };
  thirdPartyServices: {
    title: string;
    websiteServices: {
      title: string;
      googleAnalytics: {
        title: string;
        items: string[];
      };
      newsletter: {
        title: string;
        items: string[];
      };
    };
    sharedServices: {
      title: string;
      radioApi: {
        title: string;
        items: string[];
      };
      audioStreaming: {
        title: string;
        items: string[];
      };
      cdn: {
        title: string;
        items: string[];
      };
    };
  };
  permissions: {
    title: string;
    storage: {
      title: string;
      items: string[];
    };
    hostPermissions: {
      title: string;
      items: string[];
    };
  };
  dataSecurity: {
    title: string;
    items: string[];
  };
  cookies: {
    title: string;
    websiteCookies: {
      title: string;
      essential: {
        title: string;
        items: string[];
      };
      analytics: {
        title: string;
        items: string[];
      };
      managing: {
        title: string;
        items: string[];
      };
    };
  };
  userRights: {
    title: string;
    websiteControls: {
      title: string;
      youCan: {
        title: string;
        items: string[];
      };
      dataRights: {
        title: string;
        items: string[];
      };
    };
    extensionControls: {
      title: string;
      youCan: {
        title: string;
        items: string[];
      };
      limitations: {
        title: string;
        items: string[];
      };
    };
  };
  childrensPrivacy: {
    title: string;
    description: string;
  };
  contact: {
    title: string;
    description: string;
    website: string;
    extension: string;
  };
  compliance: {
    title: string;
    description: string;
    items: string[];
  };
  summary: {
    title: string;
    website: string;
    extension: string;
    conclusion: string;
  };
}

export const privacyContent: { en: PrivacyContent; ro: PrivacyContent } = {
  en: {
    overview: {
      title: "Overview",
      description: "Radio Crestin operates both a website (radiouri-crestine.ro) and a Chrome extension that provide access to Christian radio stations. We are committed to protecting your privacy and being transparent about our data practices across all our platforms."
    },
    dataCollection: {
      title: "Data Collection",
      website: {
        title: "🌐 Website (radiocrestin.ro)",
        whatWeCollect: {
          title: "What We Collect",
          items: [
            "Google Analytics Data: Page views, user interactions, session duration, device type, browser type, general location (country/city)",
            "Newsletter Email Addresses: When voluntarily provided through our subscription form",
            "Usage Analytics: Which radio stations are played, play/pause events, volume changes (anonymous)",
            "Technical Data: IP address (temporarily), browser information, screen resolution",
            "Cookies: Google Analytics cookies for tracking website usage"
          ]
        },
        howWeUse: {
          title: "How We Use Website Data",
          items: [
            "Understand which radio stations are most popular",
            "Improve website performance and user experience",
            "Track newsletter subscription success rates",
            "Analyze user behavior to enhance our service",
            "Generate usage statistics and reports"
          ]
        }
      },
      extension: {
        title: "🔌 Chrome Extension",
        dontCollect: {
          title: "What We DON'T Collect",
          items: [
            "Personal identification information",
            "Browsing history or visited websites",
            "User behavior analytics",
            "Email addresses or contact information",
            "Location data",
            "Any personally identifiable information (PII)"
          ]
        },
        storeLocally: {
          title: "What We Store Locally (Extension Only)",
          items: [
            "Favorite Stations: Your selected favorite radio stations (stored in Chrome's secure storage)",
            "Volume Preferences: Your preferred audio volume level",
            "Last Played Station: The station you were listening to (for convenience)"
          ]
        }
      }
    },
    dataStorage: {
      title: "Data Storage & Retention",
      websiteStorage: {
        title: "🌐 Website Data Storage",
        googleAnalytics: {
          title: "Google Analytics",
          items: [
            "Data stored by Google Analytics on Google's servers",
            "Analytics cookies stored in your browser (can be cleared anytime)",
            "Data retention: 26 months (Google Analytics default)",
            "Data is anonymized and aggregated for reporting"
          ]
        },
        newsletter: {
          title: "Newsletter Data",
          items: [
            "Email addresses stored securely in our newsletter service",
            "Retained until you unsubscribe",
            "Used only for sending Christian radio updates",
            "Never shared with third parties"
          ]
        },
        usageAnalytics: {
          title: "Usage Analytics",
          items: [
            "Anonymous usage data collected via our analytics system",
            "Helps us understand popular stations and user preferences",
            "No personally identifiable information included",
            "Data retained for service improvement purposes"
          ]
        }
      },
      extensionStorage: {
        title: "🔌 Extension Local Storage",
        chromeStorage: {
          title: "Chrome Storage API",
          items: [
            "All extension data stored locally on your device",
            "Uses Chrome's secure storage.sync API",
            "Data may sync across your Chrome browsers if signed into Chrome",
            "No data transmitted to our servers"
          ]
        },
        dataControl: {
          title: "Data Control",
          items: [
            "You can clear extension data by removing the extension",
            "Chrome settings allow clearing specific extension data",
            "Data is isolated per Chrome user profile",
            "No automatic data expiration (persists until manually removed)"
          ]
        }
      }
    },
    thirdPartyServices: {
      title: "Third-Party Services",
      websiteServices: {
        title: "🌐 Website Third-Party Services",
        googleAnalytics: {
          title: "Google Analytics",
          items: [
            "Provided by Google LLC for website usage analytics",
            "Collects anonymous usage data, page views, and user interactions",
            "Uses cookies to track website performance and user behavior",
            "Data shared with Google according to Google's Privacy Policy",
            "You can opt-out using Google Analytics Opt-out Browser Add-on"
          ]
        },
        newsletter: {
          title: "Newsletter Service",
          items: [
            "Email collection and management via secure newsletter platform",
            "reCAPTCHA verification to prevent spam",
            "Email addresses processed according to service provider's privacy policy",
            "Unsubscribe option available in every email"
          ]
        }
      },
      sharedServices: {
        title: "🔄 Shared Services (Website & Extension)",
        radioApi: {
          title: "Radio Crestin API",
          items: [
            "We connect to api.radiocrestin.ro to fetch radio station information",
            "Provides station names, descriptions, streaming URLs, and current playing information",
            "No personal data is sent in these requests",
            "All requests are read-only and access public information"
          ]
        },
        audioStreaming: {
          title: "Audio Streaming Servers",
          items: [
            "Audio streams are fetched directly from radio station servers",
            "Streaming is handled by your browser, not stored or processed by us",
            "No listening data is collected or transmitted by us",
            "Radio stations may have their own analytics (outside our control)"
          ]
        },
        cdn: {
          title: "Content Delivery Networks (CDN)",
          items: [
            "Static assets served via CDNs for faster loading",
            "CDN providers may log access for performance monitoring",
            "No personal data transmitted beyond standard web requests"
          ]
        }
      }
    },
    permissions: {
      title: "Permissions Explanation",
      storage: {
        title: "Storage Permission",
        items: [
          "Purpose: Save your favorite stations locally",
          "Scope: Extension data only",
          "Access: No access to other browser data"
        ]
      },
      hostPermissions: {
        title: "Host Permissions (radiocrestin.ro)",
        items: [
          "Purpose: Fetch radio station data and stream audio",
          "Scope: Only Radio Crestin domains",
          "Data: Public radio station information only"
        ]
      }
    },
    dataSecurity: {
      title: "Data Security",
      items: [
        "All connections use HTTPS encryption",
        "No sensitive data is transmitted",
        "Local storage is protected by Chrome's security model",
        "Extension follows Chrome's security best practices"
      ]
    },
    cookies: {
      title: "Cookies & Tracking",
      websiteCookies: {
        title: "🍪 Website Cookies",
        essential: {
          title: "Essential Cookies",
          items: [
            "Session management for website functionality",
            "Required for the website to work properly",
            "Cannot be disabled without affecting site functionality"
          ]
        },
        analytics: {
          title: "Analytics Cookies (Google Analytics)",
          items: [
            "_ga: Distinguishes unique users",
            "_ga_*: Session and campaign data",
            "_gid: Distinguishes users",
            "Used to understand website usage and improve user experience",
            "Can be disabled via browser settings or Google Analytics opt-out"
          ]
        },
        managing: {
          title: "Managing Cookies",
          items: [
            "You can clear cookies through your browser settings",
            "You can block cookies, but this may affect website functionality",
            "Use Google Analytics Opt-out Add-on to disable tracking",
            "Private/Incognito browsing limits cookie storage"
          ]
        }
      }
    },
    userRights: {
      title: "Your Rights & Controls",
      websiteControls: {
        title: "🌐 Website User Controls",
        youCan: {
          title: "You Can:",
          items: [
            "Clear browser cookies and data anytime",
            "Disable Google Analytics tracking",
            "Unsubscribe from newsletter emails",
            "Use private/incognito browsing mode",
            "Block or limit cookies in browser settings",
            "Request data deletion (contact us)"
          ]
        },
        dataRights: {
          title: "Data Rights (GDPR/CCPA):",
          items: [
            "Right to access your data",
            "Right to correct inaccurate data",
            "Right to delete your data",
            "Right to data portability",
            "Right to opt-out of analytics",
            "Right to object to processing"
          ]
        }
      },
      extensionControls: {
        title: "🔌 Extension User Controls",
        youCan: {
          title: "You Can:",
          items: [
            "Remove favorite stations at any time",
            "Uninstall the extension to remove all data",
            "Clear Chrome's extension data via browser settings",
            "Control which stations you add to favorites",
            "Disable extension sync in Chrome settings"
          ]
        },
        limitations: {
          title: "Limitations:",
          items: [
            "Cannot access other users' data (isolated per profile)",
            "Cannot export favorites (Chrome storage limitation)",
            "Data bound to Chrome user profile"
          ]
        }
      }
    },
    childrensPrivacy: {
      title: "Children's Privacy",
      description: "This extension does not knowingly collect information from children under 13. The extension is designed for general audiences and contains no age-inappropriate content."
    },
    contact: {
      title: "Contact Information",
      description: "For privacy-related questions or concerns:",
      website: "Website: https://radiocrestin.ro",
      extension: "Extension: Submit feedback through Chrome Web Store"
    },
    compliance: {
      title: "Compliance",
      description: "This extension complies with:",
      items: [
        "Chrome Web Store Developer Program Policies",
        "Google's Privacy Requirements for Chrome Extensions",
        "EU General Data Protection Regulation (GDPR) principles",
        "California Consumer Privacy Act (CCPA) principles"
      ]
    },
    summary: {
      title: "Summary",
      website: "Website (radiouri-crestine.ro): Uses Google Analytics for usage tracking and collects email addresses for newsletters (voluntary). All data is handled according to GDPR/CCPA standards.",
      extension: "Chrome Extension: Stores only your preferences locally and connects to Radio Crestin's public API for radio station data. No personal information is collected, stored, or transmitted.",
      conclusion: "Both platforms prioritize user privacy and provide clear controls for managing your data."
    }
  },
  ro: {
    overview: {
      title: "Prezentare Generală",
      description: "Radio Creștin operează atât un site web (radiouri-crestine.ro) cât și o extensie Chrome care oferă acces la posturi de radio creștine. Ne angajăm să vă protejăm confidențialitatea și să fim transparenți în privința practicilor noastre de date pe toate platformele."
    },
    dataCollection: {
      title: "Colectarea Datelor",
      website: {
        title: "🌐 Site Web (radiouri-crestine.ro)",
        whatWeCollect: {
          title: "Ce Colectăm",
          items: [
            "Date Google Analytics: Vizualizări de pagini, interacțiuni utilizatori, durata sesiunii, tipul dispozitivului, tipul browserului, locația generală (țară/oraș)",
            "Adrese Email Newsletter: Când sunt furnizate voluntar prin formularul nostru de abonare",
            "Analitice de Utilizare: Ce posturi radio sunt redare, evenimente de play/pauză, schimbări de volum (anonime)",
            "Date Tehnice: Adresa IP (temporar), informații browser, rezoluția ecranului",
            "Cookie-uri: Cookie-uri Google Analytics pentru urmărirea utilizării site-ului"
          ]
        },
        howWeUse: {
          title: "Cum Folosim Datele Site-ului",
          items: [
            "Înțelegem care sunt posturile radio cele mai populare",
            "Îmbunătățim performanța site-ului și experiența utilizatorului",
            "Urmărim ratele de succes ale abonărilor la newsletter",
            "Analizăm comportamentul utilizatorilor pentru a ne îmbunătăți serviciul",
            "Generăm statistici de utilizare și rapoarte"
          ]
        }
      },
      extension: {
        title: "🔌 Extensie Chrome",
        dontCollect: {
          title: "Ce NU Colectăm",
          items: [
            "Informații de identificare personală",
            "Istoricul de navigare sau site-urile vizitate",
            "Analitice de comportament utilizator",
            "Adrese email sau informații de contact",
            "Date de locație",
            "Orice informații de identificare personală (PII)"
          ]
        },
        storeLocally: {
          title: "Ce Stocăm Local (Doar Extensia)",
          items: [
            "Posturi Favorite: Posturile radio favorite selectate (stocate în stocarea securizată Chrome)",
            "Preferințe Volum: Nivelul de volum audio preferat",
            "Ultimul Post Redat: Postul pe care îl ascultați (pentru comoditate)"
          ]
        }
      }
    },
    dataStorage: {
      title: "Stocarea și Păstrarea Datelor",
      websiteStorage: {
        title: "🌐 Stocarea Datelor Site-ului",
        googleAnalytics: {
          title: "Google Analytics",
          items: [
            "Date stocate de Google Analytics pe serverele Google",
            "Cookie-uri analytics stocate în browserul dvs. (pot fi șterse oricând)",
            "Păstrarea datelor: 26 luni (implicit Google Analytics)",
            "Datele sunt anonimizate și agregate pentru raportare"
          ]
        },
        newsletter: {
          title: "Date Newsletter",
          items: [
            "Adresele email stocate securizat în serviciul nostru de newsletter",
            "Păstrate până vă dezabonați",
            "Folosite doar pentru trimiterea actualizărilor radio creștine",
            "Niciodată partajate cu terțe părți"
          ]
        },
        usageAnalytics: {
          title: "Analitice de Utilizare",
          items: [
            "Date anonime de utilizare colectate prin sistemul nostru de analiză",
            "Ne ajută să înțelegem posturile populare și preferințele utilizatorilor",
            "Nu includ informații de identificare personală",
            "Datele păstrate pentru scopuri de îmbunătățire a serviciului"
          ]
        }
      },
      extensionStorage: {
        title: "🔌 Stocarea Locală a Extensiei",
        chromeStorage: {
          title: "API de Stocare Chrome",
          items: [
            "Toate datele extensiei stocate local pe dispozitivul dvs.",
            "Folosește API-ul securizat storage.sync al Chrome",
            "Datele se pot sincroniza pe browserele Chrome dacă sunteți conectat la Chrome",
            "Nu se transmit date pe serverele noastre"
          ]
        },
        dataControl: {
          title: "Controlul Datelor",
          items: [
            "Puteți șterge datele extensiei prin eliminarea extensiei",
            "Setările Chrome permit ștergerea datelor specifice extensiei",
            "Datele sunt izolate per profil utilizator Chrome",
            "Nu există expirare automată a datelor (persistă până la eliminarea manuală)"
          ]
        }
      }
    },
    thirdPartyServices: {
      title: "Servicii Terțe Părți",
      websiteServices: {
        title: "🌐 Servicii Terțe Părți Site Web",
        googleAnalytics: {
          title: "Google Analytics",
          items: [
            "Furnizat de Google LLC pentru analize de utilizare site web",
            "Colectează date anonime de utilizare, vizualizări de pagini și interacțiuni utilizatori",
            "Folosește cookie-uri pentru urmărirea performanței site-ului și comportamentului utilizatorilor",
            "Datele partajate cu Google conform Politicii de Confidențialitate Google",
            "Puteți renunța folosind Google Analytics Opt-out Browser Add-on"
          ]
        },
        newsletter: {
          title: "Serviciu Newsletter",
          items: [
            "Colectarea și gestionarea emailurilor prin platforma securizată de newsletter",
            "Verificare reCAPTCHA pentru prevenirea spam-ului",
            "Adresele email procesate conform politicii de confidențialitate a furnizorului de servicii",
            "Opțiunea de dezabonare disponibilă în fiecare email"
          ]
        }
      },
      sharedServices: {
        title: "🔄 Servicii Partajate (Site Web și Extensie)",
        radioApi: {
          title: "API Radio Creștin",
          items: [
            "Ne conectăm la api.radiocrestin.ro pentru a prelua informații despre posturile radio",
            "Furnizează nume posturi, descrieri, URL-uri streaming și informații despre redarea curentă",
            "Nu se trimit date personale în aceste cereri",
            "Toate cererile sunt doar-citire și accesează informații publice"
          ]
        },
        audioStreaming: {
          title: "Servere de Streaming Audio",
          items: [
            "Fluxurile audio sunt preluate direct de la serverele posturilor radio",
            "Streaming-ul este gestionat de browserul dvs., nu stocat sau procesat de noi",
            "Nu colectăm sau transmitem date de ascultare",
            "Posturile radio pot avea propriile analize (în afara controlului nostru)"
          ]
        },
        cdn: {
          title: "Rețele de Distribuire Conținut (CDN)",
          items: [
            "Activele statice servite prin CDN-uri pentru încărcare mai rapidă",
            "Furnizorii CDN pot înregistra accesul pentru monitorizarea performanței",
            "Nu se transmit date personale dincolo de cererile web standard"
          ]
        }
      }
    },
    permissions: {
      title: "Explicarea Permisiunilor",
      storage: {
        title: "Permisiunea de Stocare",
        items: [
          "Scop: Salvați posturile favorite local",
          "Domeniu: Doar datele extensiei",
          "Acces: Nu există acces la alte date browser"
        ]
      },
      hostPermissions: {
        title: "Permisiuni Gazdă (radiocrestin.ro)",
        items: [
          "Scop: Preluați datele posturilor radio și stream-ați audio",
          "Domeniu: Doar domeniile Radio Creștin",
          "Date: Doar informații publice despre posturile radio"
        ]
      }
    },
    dataSecurity: {
      title: "Securitatea Datelor",
      items: [
        "Toate conexiunile folosesc criptare HTTPS",
        "Nu se transmit date sensibile",
        "Stocarea locală este protejată de modelul de securitate Chrome",
        "Extensia urmează cele mai bune practici de securitate Chrome"
      ]
    },
    cookies: {
      title: "Cookie-uri și Urmărire",
      websiteCookies: {
        title: "🍪 Cookie-uri Site Web",
        essential: {
          title: "Cookie-uri Esențiale",
          items: [
            "Gestionarea sesiunii pentru funcționalitatea site-ului",
            "Necesare pentru ca site-ul să funcționeze corect",
            "Nu pot fi dezactivate fără a afecta funcționalitatea site-ului"
          ]
        },
        analytics: {
          title: "Cookie-uri Analytics (Google Analytics)",
          items: [
            "_ga: Distinge utilizatorii unici",
            "_ga_*: Date sesiune și campanie",
            "_gid: Distinge utilizatorii",
            "Folosite pentru înțelegerea utilizării site-ului și îmbunătățirea experienței utilizatorului",
            "Pot fi dezactivate prin setările browserului sau Google Analytics opt-out"
          ]
        },
        managing: {
          title: "Gestionarea Cookie-urilor",
          items: [
            "Puteți șterge cookie-urile prin setările browserului",
            "Puteți bloca cookie-urile, dar aceasta poate afecta funcționalitatea site-ului",
            "Folosiți Google Analytics Opt-out Add-on pentru a dezactiva urmărirea",
            "Navigarea privată/incognito limitează stocarea cookie-urilor"
          ]
        }
      }
    },
    userRights: {
      title: "Drepturile și Controalele Dvs.",
      websiteControls: {
        title: "🌐 Controale Utilizator Site Web",
        youCan: {
          title: "Puteți:",
          items: [
            "Ștergeți cookie-urile și datele browserului oricând",
            "Dezactivați urmărirea Google Analytics",
            "Vă dezabonați de la emailurile newsletter",
            "Folosiți modul de navigare privat/incognito",
            "Blocați sau limitați cookie-urile în setările browserului",
            "Solicitați ștergerea datelor (contactați-ne)"
          ]
        },
        dataRights: {
          title: "Drepturi Date (GDPR/CCPA):",
          items: [
            "Dreptul de a accesa datele dvs.",
            "Dreptul de a corecta datele inexacte",
            "Dreptul de a șterge datele dvs.",
            "Dreptul la portabilitatea datelor",
            "Dreptul de a renunța la analize",
            "Dreptul de a obiecta la procesare"
          ]
        }
      },
      extensionControls: {
        title: "🔌 Controale Utilizator Extensie",
        youCan: {
          title: "Puteți:",
          items: [
            "Eliminați posturile favorite oricând",
            "Dezinstalați extensia pentru a elimina toate datele",
            "Ștergeți datele extensiei Chrome prin setările browserului",
            "Controlați ce posturi adăugați la favorite",
            "Dezactivați sincronizarea extensiei în setările Chrome"
          ]
        },
        limitations: {
          title: "Limitări:",
          items: [
            "Nu puteți accesa datele altor utilizatori (izolate per profil)",
            "Nu puteți exporta favoritele (limitare stocare Chrome)",
            "Datele legate de profilul utilizator Chrome"
          ]
        }
      }
    },
    childrensPrivacy: {
      title: "Confidențialitatea Copiilor",
      description: "Această extensie nu colectează în mod cunoscut informații de la copii sub 13 ani. Extensia este concepută pentru audiențe generale și nu conține conținut neadecvat vârstei."
    },
    contact: {
      title: "Informații de Contact",
      description: "Pentru întrebări sau preocupări legate de confidențialitate:",
      website: "Site Web: https://radiouri-crestine.ro",
      extension: "Extensie: Trimiteți feedback prin Chrome Web Store"
    },
    compliance: {
      title: "Conformitate",
      description: "Această extensie respectă:",
      items: [
        "Politicile Programului pentru Dezvoltatori Chrome Web Store",
        "Cerințele de Confidențialitate Google pentru Extensiile Chrome",
        "Principiile Regulamentului General pentru Protecția Datelor (GDPR) UE",
        "Principiile Actului de Confidențialitate al Consumatorilor din California (CCPA)"
      ]
    },
    summary: {
      title: "Rezumat",
      website: "Site Web (radiouri-crestine.ro): Folosește Google Analytics pentru urmărirea utilizării și colectează adrese email pentru newsletter-uri (voluntar). Toate datele sunt gestionate conform standardelor GDPR/CCPA.",
      extension: "Extensie Chrome: Stochează doar preferințele dvs. local și se conectează la API-ul public Radio Creștin pentru datele posturilor radio. Nu se colectează, stochează sau transmit informații personale.",
      conclusion: "Ambele platforme prioritizează confidențialitatea utilizatorilor și oferă controale clare pentru gestionarea datelor dvs."
    }
  }
};
