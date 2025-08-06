'use client'

import { ArtikalFilterProp } from '@/types/artikal'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import MultiRangeSlider, { ChangeResult } from './ui/MultiRangeSlider'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './ui/collapsible'
import { useRouter, useSearchParams } from 'next/navigation'
import { dajKorisnikaIzTokena } from '@/lib/auth'
import { useDebounce } from 'use-debounce' // Dodaj ovaj import

interface ProductFilterProps {
  artikli: any[];
  atributi: AtributiResponse;
  kategorija: string;
  podkategorija: string | null;
  onFilterChange: (filters: ArtikalFilterProp) => void;
}

interface ArtikalAtribut {
  idArtikla: string;
  imeAtributa: string;
  vrednost: string;
}

interface AtributiResponse {
  [artikalId: string]: ArtikalAtribut[];
}

interface AtributiFiltera {
  jm: string[];
  Materijal: string[];
  Model: string[];
  Pakovanje: string[];
  RobnaMarka: string[];
  Upotreba: string[];
  Boja: string[];
}

const defaultFilters: ArtikalFilterProp = {
  naziv: '',
  jm: [],
  Materijal: [],
  Model: [],
  Pakovanje: [],
  RobnaMarka: [],
  Upotreba: [],
  Boja: [],
  cena: '0-100000',
}

const ArtikalFilter: React.FC<ProductFilterProps> = ({
  artikli,
  atributi,
  kategorija,
  podkategorija,
  onFilterChange,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS
  const korisnik = dajKorisnikaIzTokena()
  const fullUrl = `${apiAddress}/api/Artikal/DajArtikalCene?grupa=${encodeURIComponent(kategorija)}&podgrupa=${podkategorija ? encodeURIComponent(podkategorija) : ''}`

  // Cena
  const [mapaCena, setMapaCena] = useState<Map<string, number>>(new Map())
  const [minCena, setMinCena] = useState(0)
  const [maxCena, setMaxCena] = useState(100000)

  // Aktuelni filteri - OVO JE PREMEŠTENO IZNAD pendingFilters
  const [filters, setFilters] = useState<ArtikalFilterProp>(defaultFilters)
  
  // Sada je safe da koristimo filters u pendingFilters
  const [pendingFilters, setPendingFilters] = useState<ArtikalFilterProp>(filters);
  const [sliderValues, setSliderValues] = useState<[number, number]>([minCena, maxCena])
  const [debouncedSliderValues] = useDebounce(sliderValues, 500);

  // Opcije filtera
  const [filterOptions, setFilterOptions] = useState({
    jm: [] as string[],
    Materijal: [] as string[],
    Model: [] as string[],
    Pakovanje: [] as string[],
    RobnaMarka: [] as string[],
    Upotreba: [] as string[],
    Boja: [] as string[],
  })

  // Ref za prethodne filtere da izbegnemo beskonačni loop
  const prevFiltersRef = useRef<ArtikalFilterProp | null>(null)

  // Za Cene
  useEffect(() => {
    if (JSON.stringify([minCena, maxCena]) !== JSON.stringify(debouncedSliderValues)) {
      handleChange('cena', [`${debouncedSliderValues[0]}-${debouncedSliderValues[1]}`])
    }
  }, [debouncedSliderValues]);

  function prikaziLepoIme(arg0: any): React.ReactNode {
    throw new Error('Function not implemented.')
  }

  function ocistiImeAtributa(key: string): any {
    throw new Error('Function not implemented.')
  }

  function handleChange(key: string, arg1: string[]) {
    throw new Error('Function not implemented.')
  }

  // function applyFilters(event: React.MouseEvent<HTMLButtonElement>): void {
  //   throw new Error('Function not implemented.')
  // }

  // Ostali delovi koda ostaju isti...
  // ... (fetchCene, postaviOpsegCena, asArray, inicijalizacija filtera, mapiranje atributa)
  const resetFilters = () => {
    setFilters(defaultFilters);
    setPendingFilters(defaultFilters);
    // Resetuj i slider ako je potrebno
  };


  const applyFilters = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFilters(pendingFilters);
    onFilterChange(pendingFilters);
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Filteri</h2>
      
      {/* Filter za cenu */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Cena (RSD)</label>
        <MultiRangeSlider
          min={minCena}
          max={maxCena}
          step={100}
          minValue={sliderValues[0]}
          maxValue={sliderValues[1]}
          onChange={({ min, max }) => setSliderValues([min, max])}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{sliderValues[0]} RSD</span>
          <span>{sliderValues[1]} RSD</span>
        </div>
      </div>

      {/* Filteri po atributima */}
      <div className="space-y-4">
        {Object.entries(filterOptions).map(([key, options]) => (
          <div key={key} className="border-b border-gray-200 pb-4 last:border-0">
            <Collapsible>
              <CollapsibleTrigger className="flex justify-between items-center w-full text-left">
                <h3 className="font-medium text-gray-700">{prikaziLepoIme(ocistiImeAtributa(key))}</h3>
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
                        checked={pendingFilters[key as keyof ArtikalFilterProp]?.includes(option) ?? false}
                        onChange={(e) => {
                          const current = pendingFilters[key as keyof ArtikalFilterProp] || []
                          const currentArray = Array.isArray(current) ? current : [current]
                          handleChange(
                            key,
                            e.target.checked
                              ? [...currentArray, option]
                              : currentArray.filter((item: string) => item !== option)
                          )
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

      {/* Dugme za resetovanje filtera */}
      <button
        onClick={resetFilters}
        className="w-full py-2 px-4 mt-4 text-center text-sm font-semibold text-white bg-gray-600 hover:bg-gray-700 rounded-lg"
      >
        Resetuj filtere
      </button>

      {/* Dugme za primenu filtera */}
      <button
        onClick={applyFilters}
        className="w-full py-2 px-4 mt-4 text-center text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
      >
        Primeni filtere
      </button>
    </div>
  )
}

export default React.memo(ArtikalFilter)

function handleChange(arg0: string, arg1: string) {
  throw new Error('Function not implemented.')
}
