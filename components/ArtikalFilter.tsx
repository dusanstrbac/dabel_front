'use client'

import { ArtikalFilterProp, ArtikalType } from '@/types/artikal'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import MultiRangeSlider from './ui/MultiRangeSlider' // Pretpostavka da je putanja ispravna
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
  const priceRange = useMemo(() => {
    if (!artikli || artikli.length === 0) {
      return { min: 0, max: 100000 };
    }
    const prices = artikli
      .map(a => a.artikalCene?.[0]?.cena)
      .filter((p): p is number => p !== undefined && p > 0);

    if (prices.length === 0) {
      return { min: 0, max: 100000 };
    }
    const minCena = Math.floor(Math.min(...prices));
    const maxCena = Math.ceil(Math.max(...prices));
    return { min: minCena, max: maxCena };
  }, [artikli]);

  const [filters, setFilters] = useState<ArtikalFilterProp & { naStanju: boolean }>({
    cena: `${priceRange.min}-${priceRange.max}`,
    jm: [], Materijal: [], Model: [], Pakovanje: [],
    RobnaMarka: [], Upotreba: [], Boja: [], naStanju: false,
  });
  
  useEffect(() => {
    // Kada se promeni lista artikala (npr. prelazak na drugu stranicu),
    // resetuj filter cena na pun opseg novih artikala.
    setFilters(prev => ({
        ...prev, // Zadrži ostale filtere (boja, materijal...)
        cena: `${priceRange.min}-${priceRange.max}`
    }));
  }, [priceRange]);

  const filtriraniArtikli = useMemo(() => {
    let result = [...artikli];

    // 1. Filter po ceni
    const cenaString = filters.cena || `${priceRange.min}-${priceRange.max}`;
    const [minCena, maxCena] = cenaString.split('-').map(parseFloat);
    
    result = result.filter(artikal => {
      const cena = artikal.artikalCene?.[0]?.cena || 0;
      return cena >= minCena && cena <= maxCena;
    });

    // 2. Filteri po atributima
    const filterKeys: (keyof ArtikalFilterProp)[] = [
      'jm', 'Materijal', 'Model', 'Pakovanje', 'RobnaMarka', 'Upotreba', 'Boja'
    ];
    
    filterKeys.forEach(key => {
      const values = filters[key];
      if (Array.isArray(values) && values.length > 0) {
        result = result.filter(artikal => {
          if (key === 'jm') return values.includes(artikal.jm);
          
          if (artikal.artikalAtributi) {
            const atributKey = key === 'RobnaMarka' ? 'Robna marka' : 
                             key === 'Boja' ? 'Zavr.obr-boja' : key;
            return artikal.artikalAtributi.some(atribut => 
              atribut.imeAtributa === atributKey && values.includes(atribut.vrednost)
            );
          }
          return false;
        });
      }
    });

    // 3. Filter po stanju
    if (filters.naStanju) {
      result = result.filter(artikal => (Number(artikal.kolicina) ?? 0) > 0);
    }
    return result;
  }, [artikli, filters, priceRange]);

  const stableOnFilterChange = useCallback(onFilterChange, []);

  useEffect(() => {
<<<<<<< HEAD
      stableOnFilterChange(filtriraniArtikli);
  }, [filtriraniArtikli, artikli, stableOnFilterChange]);
=======
    stableOnFilterChange(filtriraniArtikli);
  }, [filtriraniArtikli, stableOnFilterChange]);
>>>>>>> eddafae92cac920bb11e7d9e7423019c38bc26a4

  const filterOptions = useMemo(() => {
    const options: Record<keyof Omit<ArtikalFilterProp, 'cena' | 'naziv'>, Set<string>> = {
      jm: new Set(), Materijal: new Set(), Model: new Set(), Pakovanje: new Set(),
      RobnaMarka: new Set(), Upotreba: new Set(), Boja: new Set(),
    };
    artikli.forEach(artikal => {
      if (artikal.jm) options.jm.add(artikal.jm);
      if (artikal.artikalAtributi) {
        artikal.artikalAtributi.forEach(atribut => {
          const key = atribut.imeAtributa === "Robna marka" ? "RobnaMarka" : 
                      atribut.imeAtributa === "Zavr.obr-boja" ? "Boja" :
                      atribut.imeAtributa as keyof typeof options;
          if (options[key]) options[key].add(atribut.vrednost);
        });
      }
    });
    return Object.fromEntries(
      Object.entries(options).map(([key, values]) => [key, Array.from(values)])
    ) as Record<keyof Omit<ArtikalFilterProp, 'cena' | 'naziv'>, string[]>;
  }, [artikli]);

  const handleFilterChange = (key: keyof ArtikalFilterProp, value: string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCenaChange = (min: number, max: number) => {
    setFilters(prev => ({ ...prev, cena: `${min}-${max}` }));
  };

  const handleNaStanjuChange = (value: boolean) => {
    setFilters(prev => ({ ...prev, naStanju: value }));
  };
  
  const resetFilters = () => {
    setFilters({
      cena: `${priceRange.min}-${priceRange.max}`,
      jm: [], Materijal: [], Model: [], Pakovanje: [],
      RobnaMarka: [], Upotreba: [], Boja: [], naStanju: false,
    });
    stableOnFilterChange(artikli);
  };

  const [minValue, maxValue] = useMemo(() => {
      const cenaString = filters.cena || `${priceRange.min}-${priceRange.max}`;
      const [minStr, maxStr] = cenaString.split('-');
      return [parseInt(minStr, 10), parseInt(maxStr, 10)];
  }, [filters.cena, priceRange]);

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Filteri</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Cena (RSD)</label>
        <MultiRangeSlider
          min={priceRange.min}
          max={priceRange.max}
          step={100}
          minValue={minValue}
          maxValue={maxValue}
          onChange={({ minValue, maxValue }) => handleCenaChange(minValue, maxValue)}
        />
      </div>

      <div className="border-t border-gray-200 my-4"></div>

      <div className="flex justify-end mb-4">
        <label className="flex items-center space-x-2 text-sm text-gray-700">
          <span>Prikaži artikle na stanju</span>
          <input
            type="checkbox"
            checked={filters.naStanju}
            onChange={(e) => handleNaStanjuChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </label>
      </div>

      <div className="border-t border-gray-200 my-4"></div>
      
      <div className="space-y-4">
        {Object.entries(filterOptions).map(([key, options]) => (
          options.length > 0 && <div key={key} className="border-b border-gray-200 pb-4 last:border-0">
            <Collapsible>
              <CollapsibleTrigger className="flex justify-between items-center w-full text-left">
                <h3 className="font-medium text-gray-700">
                  {key === 'RobnaMarka' ? 'Robna marka' : 
                   key === 'jm' ? 'Jedinica mere' : 
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
                        checked={(filters[key as keyof ArtikalFilterProp] as string[] | undefined || []).includes(option)}
                        onChange={(e) => {
                          const current = filters[key as keyof ArtikalFilterProp] as string[] || [];
                          const newValue = e.target.checked
                            ? [...current, option]
                            : current.filter((item: string) => item !== option);
                          handleFilterChange(key as keyof ArtikalFilterProp, newValue);
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
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
        className="w-full py-2 px-4 mt-6 text-center text-sm font-semibold text-white bg-gray-700 hover:bg-gray-800 rounded-lg transition-colors"
      >
        Resetuj filtere
      </button>
    </div>
  )
}

export default React.memo(ArtikalFilter)