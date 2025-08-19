'use client'

import { ArtikalFilterProp, ArtikalType } from '@/types/artikal'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import MultiRangeSlider, { ChangeResult } from './ui/MultiRangeSlider'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './ui/collapsible'

interface ProductFilterProps {
  artikli: ArtikalType[];
  kategorija: string;
  podkategorija: string | null;
  onFilterChange: (filteredArtikli: ArtikalType[]) => void;
}

const ArtikalFilter: React.FC<ProductFilterProps> = ({
  artikli,
  kategorija,
  podkategorija,
  onFilterChange,
}) => {
  // Stanje za filtere sa inicijalnim vrednostima
  const [filters, setFilters] = useState<ArtikalFilterProp>({
    cena: '0-100000',
    jm: [],
    Materijal: [],
    Model: [],
    Pakovanje: [],
    RobnaMarka: [],
    Upotreba: [],
    Boja: [],
  });

  // Filtriranje artikala sa AND/OR logikom
  const filtriraniArtikli = useMemo(() => {
    let result = [...artikli];

    // 1. Filter po ceni (AND)
    const cenaParts = filters.cena?.split('-') || ['0', '100000'];
    const minCena = parseFloat(cenaParts[0]);
    const maxCena = parseFloat(cenaParts[1]);
    
    result = result.filter(artikal => {
      const cena = artikal.artikalCene?.[0]?.cena || 0;
      return cena >= minCena && cena <= maxCena;
    });

    // 2. Filteri po atributima (AND između grupa, OR unutar grupe)
    const filterKeys: (keyof ArtikalFilterProp)[] = [
      'jm', 'Materijal', 'Model', 'Pakovanje', 'RobnaMarka', 'Upotreba', 'Boja'
    ];
    
    filterKeys.forEach(key => {
      const values = filters[key];
      if (Array.isArray(values) && values.length > 0) {
        result = result.filter(artikal => {
          if (key === 'jm') {
            return values.includes(artikal.jm);
          }
          
          if (artikal.artikalAtributi) {
            const atributKey = key === 'RobnaMarka' ? 'Robna marka' : 
                             key === 'Boja' ? 'Zavr.obr-boja' : key;
            
            return artikal.artikalAtributi.some(atribut => 
              atribut.imeAtributa === atributKey && 
              values.includes(atribut.vrednost)
        )}
          return false;
        });
      }
    });

    return JSON.stringify(result) === JSON.stringify(artikli) 
    ? artikli 
    : result;
  }, [artikli, filters]);

  // Obavesti parent komponentu o promenama
  const stableOnFilterChange = useCallback(onFilterChange, []);

  useEffect(() => {
      stableOnFilterChange(filtriraniArtikli);
  }, [filtriraniArtikli, artikli, stableOnFilterChange]);

  // Generisanje opcija za filtere
  const filterOptions = useMemo(() => {
    const options: Record<keyof Omit<ArtikalFilterProp, 'cena' | 'naziv'>, Set<string>> = {
      jm: new Set(),
      Materijal: new Set(),
      Model: new Set(),
      Pakovanje: new Set(),
      RobnaMarka: new Set(),
      Upotreba: new Set(),
      Boja: new Set(),
    };

    artikli.forEach(artikal => {
      if (artikal.jm) options.jm.add(artikal.jm);
      
      if (artikal.artikalAtributi) {
        artikal.artikalAtributi.forEach(atribut => {
          const key = atribut.imeAtributa === "Robna marka" ? "RobnaMarka" : 
                      atribut.imeAtributa === "Zavr.obr-boja" ? "Boja" :
                      atribut.imeAtributa as keyof typeof options;
          
          if (options[key]) {
            options[key].add(atribut.vrednost);
          }
        });
      }
    });

    return Object.fromEntries(
      Object.entries(options).map(([key, values]) => [key, Array.from(values)])
    ) as Record<keyof Omit<ArtikalFilterProp, 'cena' | 'naziv'>, string[]>;
  }, [artikli]);

  // Funkcije za upravljanje filterima
  const handleFilterChange = (key: keyof ArtikalFilterProp, value: string[]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCenaChange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      cena: `${min}-${max}`
    }));
  };

  const resetFilters = () => {
    setFilters({
      cena: '0-100000',
      jm: [],
      Materijal: [],
      Model: [],
      Pakovanje: [],
      RobnaMarka: [],
      Upotreba: [],
      Boja: [],
    });
    stableOnFilterChange(artikli);
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Filteri</h2>
      
      {/* Filter za cenu */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Cena (RSD)</label>
        <MultiRangeSlider
          min={0}
          max={100000}
          step={100}
          minValue={parseInt(filters.cena?.split('-')[0] || '0')}
          maxValue={parseInt(filters.cena?.split('-')[1] || '100000')}
          onChange={({ min, max }) => handleCenaChange(min, max)}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{filters.cena?.split('-')[0] || '0'} RSD</span>
          <span>{filters.cena?.split('-')[1] || '100000'} RSD</span>
        </div>
      </div>

      {/* Filteri po atributima */}
      <div className="space-y-4">
        {Object.entries(filterOptions).map(([key, options]) => (
          <div key={key} className="border-b border-gray-200 pb-4 last:border-0">
            <Collapsible>
              <CollapsibleTrigger className="flex justify-between items-center w-full text-left">
                <h3 className="font-medium text-gray-700">
                  {key === 'RobnaMarka' ? 'Robna marka' : 
                   key === 'Boja' ? 'Boja' : 
                   key.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 pl-1">
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {options.map((option: string) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters[key as keyof ArtikalFilterProp]?.includes(option) ?? false}
                        onChange={(e) => {
                          const current = filters[key as keyof ArtikalFilterProp] as string[] || [];
                          const newValue = e.target.checked
                            ? [...current, option]
                            : current.filter((item: string) => item !== option);
                          handleFilterChange(key as keyof ArtikalFilterProp, newValue);
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        ))}
      </div>

      <button
        onClick={resetFilters}
        className="w-full py-2 px-4 mt-4 text-center text-sm font-semibold text-white bg-gray-600 hover:bg-gray-700 rounded-lg"
      >
        Resetuj filtere
      </button>
    </div>
  )
}

export default React.memo(ArtikalFilter)
