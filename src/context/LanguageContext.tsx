'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
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
  const [isMounted, setIsMounted] = useState(false);
  
  const dict: Dictionary = language === 'id' ? id : en;
  const [branding] = useState<BrandingData>(initialBranding || {
    name: 'SMA VisiSekolah',
    primaryColor: '#6366f1',
    secondaryColor: '#a855f7',
    accentColor: '#10b981',
    fontFamily: 'Outfit',
  });

  // Read language from localStorage on client-side only (after hydration)
  useEffect(() => {
    setIsMounted(true);
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'id' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Persist language selection and set HTML lang attribute when it changes
  useEffect(() => {
    if (isMounted) {
      document.documentElement.lang = language;
      localStorage.setItem('language', language);
    }
  }, [language, isMounted]);

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
