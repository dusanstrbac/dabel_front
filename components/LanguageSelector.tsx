'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { locales, languages, isLocale, type Locale } from '@/locales';
import { setCookie } from 'cookies-next';

interface Language {
  value: Locale;
  label: string;
  flag: string;
}

const languageList: Language[] = locales.map((locale) => {
  if (!isLocale(locale)) throw new Error(`Nepoznat locale: ${locale}`);
  return {
    value: locale,
    label: languages[locale].label,
    flag: languages[locale].flag,
  };
}).sort((a, b) => a.label.localeCompare(b.label));

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [hydrated, setHydrated] = useState(false); // novo

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Inicijalizacija jezika iz URL-a ili localStorage
  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);
    const localeFromUrl = segments[0];

    if (isLocale(localeFromUrl)) {
      const lang = languageList.find((l) => l.value === localeFromUrl);
      if (lang) {
        setSelectedLanguage(lang);
        setHydrated(true);
      }
    } else {
      const storedLocale = localStorage.getItem('preferredLocale');
      if (storedLocale && isLocale(storedLocale)) {
        const lang = languageList.find((l) => l.value === storedLocale);
        if (lang) {
          setSelectedLanguage(lang);
          const newSegments = [storedLocale, ...segments];
          const newPath = '/' + newSegments.join('/');
          router.replace(newPath);
        }
      } else {
        // fallback ako ništa nema — postavi default
        const lang = languageList.find((l) => l.value === 'sr');
        setSelectedLanguage(lang || languageList[0]);
        setHydrated(true);
      }
    }
  }, [pathname]);

  // Klik van dropdown-a zatvara meni
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (lang: Language) => {
    setSelectedLanguage(lang);
    setIsOpen(false);
    localStorage.setItem('preferredLocale', lang.value);
    setCookie('preferredLocale', lang.value, { maxAge: 60 * 60 * 24 * 365, path: '/' }); 
  
    const segments = pathname.split('/').filter(Boolean);
    if (isLocale(segments[0])) {
      segments[0] = lang.value;
    } else {
      segments.unshift(lang.value);
    }

    const newPath = '/' + segments.join('/');
    router.push(newPath);
  };

  if (!hydrated || !selectedLanguage) return null; // čeka dok se sve ne inicijalizuje

  return (
    <div className="relative inline-block text-left w-full" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        id="options-menu"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`fi ${selectedLanguage.flag} mr-2 mt-0.5`}></span>
        {selectedLanguage.label}
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1">
            {languageList.map((lang) => (
              <a
                key={lang.value}
                href="#"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectLanguage(lang);
                }}
              >
                <span className={`fi ${lang.flag} mr-2`}></span>
                {lang.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
