// components/LanguageSelector.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCookie, setCookie } from 'cookies-next';
import { locales } from '@/types/locale';

interface Language {
  value: string;
  label: string;
  flag: string;
}

// This function should be defined somewhere, e.g., in types/locale.ts
const languages = {
  sr: { label: 'Srpski', flag: 'fi-rs' },
  en: { label: 'English', flag: 'fi-gb' },
};

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Get the current locale from the URL
  const segments = pathname.split('/').filter(Boolean);
  const currentLocale = segments[0];

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSelectLanguage = (nextLocale: string) => {
    setIsOpen(false);
    setCookie('preferredLocale', nextLocale);

    const segments = pathname.split('/').filter(Boolean);

    // If the path starts with a locale, replace it
    if (locales.includes(segments[0] as any)) {
      segments[0] = nextLocale;
    } else {
      // If no locale is in the path, prepend the new locale
      segments.unshift(nextLocale);
    }

    // Build the new path and redirect
    const newPath = `/${segments.join('/')}`;
    router.push(newPath);
  };

  const selectedLanguage = {
    value: currentLocale,
    label: languages[currentLocale as 'sr' | 'en'].label,
    flag: languages[currentLocale as 'sr' | 'en'].flag,
  };

  const languageList = locales.map(locale => ({
    value: locale,
    label: languages[locale as 'sr' | 'en'].label,
    flag: languages[locale as 'sr' | 'en'].flag,
  }));

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`${selectedLanguage.flag} mr-2 mt-0.5`}></span>
        {selectedLanguage.label}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white z-10">
          <div className="py-1">
            {languageList.map((lang) => (
              <a
                key={lang.value}
                href="#"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectLanguage(lang.value);
                }}
              >
                <span className={`${lang.flag} mr-2`}></span>
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