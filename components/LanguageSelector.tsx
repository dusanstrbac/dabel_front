'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation'; // koristi navigation za app dir
import { setCookie } from 'cookies-next';
import { locales, Locale } from '@/config/locales';

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  const segments = pathname.split('/');
  const localeFromPath = segments[1] as Locale;

  const selectedLanguage =
    locales.find((l) => l.code === localeFromPath) ?? {
      code: '',
      label: 'Unknown',
      flag: '',
    };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setCookie('NEXT_LOCALE', langCode);
    setIsOpen(false);

    const newSegments = [...segments];
    newSegments[1] = langCode;

    const newPath = newSegments.join('/');
    const searchParams = window.location.search; // npr. ?token=abc123

    const finalUrl = `${newPath}${searchParams}`;

    router.push(finalUrl);
  };


  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className="cursor-pointer inline-flex justify-center items-center w-full rounded-md border border-gray-200 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`fi fi-${selectedLanguage.flag} mr-2 text-lg`}></span>
        <span className="hidden sm:block">{selectedLanguage.label}</span>
        <svg 
          className={`ml-2 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={`
          origin-top-right absolute z-50
          ${isMobile ? 'left-0 top-0 mt-2 w-64 max-w-[90vw]' : 'right-0 mt-2 w-56'}
          rounded-lg shadow-xl bg-white border border-gray-200
          animate-in fade-in-80 zoom-in-95
        `}>
          <div className="py-2">
            {[...locales]
              .sort((a, b) => a.label.localeCompare(b.label))
              .map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`
                    w-full text-left flex items-center px-4 py-3 text-sm transition-all duration-200 cursor-pointer
                    ${lang.code === selectedLanguage.code
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <span className={`fi fi-${lang.flag} mr-3 text-lg shrink-0`}></span>
                  <span className="truncate">{lang.label}</span>
                  {lang.code === selectedLanguage.code && (
                    <svg 
                      className="ml-auto h-4 w-4 text-blue-600" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
