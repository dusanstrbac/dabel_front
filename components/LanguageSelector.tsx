'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { setCookie } from 'cookies-next';
import Link from 'next/link';
import { locales, Locale } from '@/config/locales';

interface LanguageSelectorProps {
  currentLocale: Locale;
}

const LanguageSelector = ({ currentLocale }: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Zatvaranje dropdown-a kada klikneš van njega
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLanguage = locales.find(l => l.code === currentLocale) ?? { code: '', label: 'Unknown', flag: '' };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dugme za selekciju jezika */}
      <button
        type="button"
        className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Zastavica i label */}
        <span className={`fi fi-${selectedLanguage.flag} mr-2 mt-0.5`}></span>
        {selectedLanguage.label}
      </button>

      {/* Dropdown lista jezika */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white z-10">
          <div className="py-1">
            {[...locales]
              .sort((a, b) => a.label.localeCompare(b.label)) // Sortiranje po abecedi
              .map(lang => {
                // Promeni prvi segment URL-a na novi locale
                const segments = pathname.split('/');
                segments[1] = lang.code;
                const newPath = segments.join('/');

                return (
                  <Link
                    key={lang.code}
                    href={newPath}
                    onClick={() => setCookie('preferredLocale', lang.code)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <span className={`fi fi-${lang.flag} mr-2`}></span>
                    {lang.label}
                  </Link>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
