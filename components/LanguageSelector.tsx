import React, { useState, useEffect, useRef } from 'react';
// Ne zaboravi da si importovao 'flag-icons/css/flag-icons.min.css' negde globalno!

// DEFINISANJE TIPA ZA JEZIK
interface Language {
  value: string;
  label: string;
  flag: string;
}

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  // PRIMENA TIPA NA useState ZA selectedLanguage
  const [selectedLanguage, setSelectedLanguage] = useState<Language>({
    value: 'sr',
    label: 'Srpski',
    flag: 'fi-rs'
  });

  // PRIMENA TIPA NA NIZ JEZIKA
  const languages: Language[] = [
    { value: 'sr', label: 'Srpski', flag: 'fi-rs' },
    { value: 'en', label: 'English', flag: 'fi-gb' },
    { value: 'me', label: 'Crnogorski', flag: 'fi-me' },
    { value: 'mk', label: 'Makedonski', flag: 'fi-mk' },
    { value: 'ba', label: 'Bosanski', flag: 'fi-ba' },
    { value: 'hr', label: 'Dećki', flag: 'fi-hr' },
    { value: 'ks', label: 'Kosovo', flag: 'fi-rs' },
  ];

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // PRIMENA TIPA NA PARAMETAR 'lang'
  const handleSelectLanguage = (lang: Language) => {
    setSelectedLanguage(lang);
    setIsOpen(false);
    console.log(`Jezik promenjen na: ${lang.label} (${lang.value})`);
  };

  return (
    <div className="relative inline-block text-left mt-3 mr-5" ref={dropdownRef}>
      <div>
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
          <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          <div className="py-1">
            {languages.map((lang: Language) => ( // Opciono, dodato ovde za još veću jasnoću
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