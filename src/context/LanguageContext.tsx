'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import id from '../dictionaries/id.json';
import en from '../dictionaries/en.json';

type Dictionary = typeof id;
type Language = 'id' | 'en';

interface BrandingData {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dict: Dictionary;
  branding: BrandingData;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ 
  children, 
  initialBranding 
}: { 
  children: React.ReactNode;
  initialBranding?: BrandingData;
}) {
  const [language, setLanguage] = useState<Language>('id');
  const [dict, setDict] = useState<Dictionary>(id);
  const [branding] = useState<BrandingData>(initialBranding || {
    name: 'SMA VisiSekolah',
    primaryColor: '#6366f1',
    secondaryColor: '#a855f7',
    accentColor: '#10b981',
    fontFamily: 'Outfit',
  });

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'id' || savedLang === 'en')) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    setDict(language === 'id' ? id : en);
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dict, branding }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
