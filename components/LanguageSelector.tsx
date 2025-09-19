'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { setCookie } from 'cookies-next';
import Link from 'next/link';
import { locales, Locale } from '@/config/locales';

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const segments = pathname.split('/');
  const localeFromPath = segments[1] as Locale;

  console.log(`Locale from path`, localeFromPath);

  // Pronađi trenutno selektovani jezik
  const selectedLanguage =
    locales.find((l) => l.code === localeFromPath) ?? {
      code: '',
      label: 'Unknown',
      flag: '',
    };


  // 📌 Zatvori dropdown kad se klikne van njega
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dugme za selektovanje jezika */}
      <button
        type="button"
        className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`fi fi-${selectedLanguage.flag} mr-2 mt-0.5`}></span>
        {selectedLanguage.label}
      </button>

      {/* Dropdown sa jezicima */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white z-10">
          <div className="py-1">
            {[...locales]
              .sort((a, b) => a.label.localeCompare(b.label))
              .map((lang) => {
                // Promeni prvi segment URL-a u novi locale
                const newSegments = [...segments];
                newSegments[1] = lang.code;
                const newPath = newSegments.join('/');

                return (
                  <Link
                    key={lang.code}
                    href={newPath}
                    onClick={() => {
                      setCookie('NEXT_JEZIK', lang.code);
                      setIsOpen(false);
                    }}
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
