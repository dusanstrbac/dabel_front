'use client'

import { ArtikalFilterProp, ArtikalType } from '@/types/artikal'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import MultiRangeSlider, { ChangeResult } from './ui/MultiRangeSlider'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './ui/collapsible'
import { useRouter, useSearchParams } from 'next/navigation'
import { dajKorisnikaIzTokena } from '@/lib/auth'
import { useDebounce } from 'use-debounce' // Dodaj ovaj import

interface ProductFilterProps {
  artikli: ArtikalType[];
  kategorija: string;
  podkategorija: string | null;
  onFilterChange: (filters: ArtikalFilterProp) => void;
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
  kategorija,
  podkategorija,
  onFilterChange,
}) => {

  const [filterOptions, setFilterOptions] = useState<AtributiFiltera>({
    jm: [],
    Materijal: [],
    Model: [],
    Pakovanje: [],
    RobnaMarka: [],
    Upotreba: [],
    Boja: [],
  });
  const router = useRouter()
  const searchParams = useSearchParams()
  const isInitialMount = useRef(true)



  
  useEffect(() => {
    // Proveri da li su se zaista promenili parametri filtera (ne samo page)
    const filterKeys = ['jm', 'Materijal', 'Model', 'Pakovanje', 'RobnaMarka', 'Upotreba', 'Boja', 'cena'];
    const hasFilterChanges = filterKeys.some(key => 
      searchParams.get(key) !== prevFiltersRef.current?.[key as keyof ArtikalFilterProp]?.toString()
    );

    if (hasFilterChanges) {
      const initialFilters = { ...defaultFilters };
      // ...ostatak inicijalizacije
      onFilterChange(initialFilters);
    }

    prevFiltersRef.current = filters;
  }, [searchParams]);
  

  const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS
  const korisnik = dajKorisnikaIzTokena()
  // const fullUrl = `${apiAddress}/api/Artikal/DajArtikalCene?grupa=${encodeURIComponent(kategorija)}&podgrupa=${podkategorija ? encodeURIComponent(podkategorija) : ''}`

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

  // State za odloženo ažuriranje URL-a
  const [urlUpdateQueue, setUrlUpdateQueue] = useState<ArtikalFilterProp | null>(null)


  // Efekt za debounce-ovano ažuriranje URL-a
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && 
            ((Array.isArray(value) && value.length > 0) || 
            (!Array.isArray(value) && value !== ''))) {
          params.set(key, Array.isArray(value) ? value.join(',') : value)
        } else {
          params.delete(key)
        }
      })

      router.replace(`?${params.toString()}`, { scroll: false })
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [filters, router])

  

  // Efekt za ažuriranje URL-a
  useEffect(() => {
    if (urlUpdateQueue) {
      const params = new URLSearchParams()
      
      Object.entries(urlUpdateQueue).forEach(([key, value]) => {
        if (value && 
            ((Array.isArray(value) && value.length > 0) || 
            (!Array.isArray(value) && value !== ''))) {
          params.set(key, Array.isArray(value) ? value.join(',') : value)
        } else {
          params.delete(key)
        }
      })

      router.replace(`?${params.toString()}`, { scroll: false })
      setUrlUpdateQueue(null)
    }
  }, [urlUpdateQueue, router])

  const handleChange = useCallback((key: string, value: string[]) => {
    const newFilters = {
      ...filters,
      [key]: value
    }
    
    setFilters(newFilters)
    setPendingFilters(newFilters)
    onFilterChange(newFilters)
  }, [filters, onFilterChange])

  //RESET FILTERA
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters)
    setPendingFilters(defaultFilters)
    setSliderValues([0, 100000])
    onFilterChange(defaultFilters)
  }, [onFilterChange])

  // Opcije filtera
  useEffect(() => {
    if (artikli.length > 0) {
      const newFilterOptions = {
        jm: [] as string[],
        Materijal: [] as string[],
        Model: [] as string[],
        Pakovanje: [] as string[],
        RobnaMarka: [] as string[],
        Upotreba: [] as string[],
        Boja: [] as string[],
      };

      artikli.forEach(artikal => {
        // Dodaj jedinicu mere (jm) ako postoji
        if (artikal.jm && !newFilterOptions.jm.includes(artikal.jm)) {
          newFilterOptions.jm.push(artikal.jm);
        }

        // Procesuiraj atribute artikla
        if (artikal.artikalAtributi) {
          artikal.artikalAtributi.forEach(atribut => {
            // Mapiranje imena atributa na filter ključeve
            const key = atribut.imeAtributa === "Robna marka" ? "RobnaMarka" : 
                        atribut.imeAtributa === "Zavr.obr-boja" ? "Boja" :
                        atribut.imeAtributa;
            
            // Proveri da li atribut pripada filter opcijama
            if (newFilterOptions.hasOwnProperty(key)) {
              const vrednost = atribut.vrednost.trim();
              if (vrednost && !newFilterOptions[key as keyof typeof newFilterOptions].includes(vrednost)) {
                newFilterOptions[key as keyof typeof newFilterOptions].push(vrednost);
              }
            }
          });
        }
      });

      setFilterOptions(newFilterOptions);
    }
  }, [artikli]);

  // Ref za prethodne filtere da izbegnemo beskonačni loop
  const prevFiltersRef = useRef<ArtikalFilterProp | null>(null)

  // Za Cene
  useEffect(() => {
    if (JSON.stringify([minCena, maxCena]) !== JSON.stringify(debouncedSliderValues)) {
      handleChange('cena', [`${debouncedSliderValues[0]}-${debouncedSliderValues[1]}`])
    }
  }, [debouncedSliderValues]);

  function ocistiImeAtributa(key: string): string {
    // Clean up attribute names - implement according to your needs
    return key.trim();
  }

  function prikaziLepoIme(name: string): string {
    // Format attribute names for display
    if (!name) return '';
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }

  // function handleChange(key: string, value: string[]) {
  //   setPendingFilters(prev => ({
  //     ...prev,
  //     [key]: value
  //   }));

  //     // Ažuriraj filtere odmah bez potrebe za klikom na "Primeni filtere"
  //   const newFilters = {
  //     ...pendingFilters,
  //     [key]: value
  //   };
  //   onFilterChange(newFilters);
  // }
////////////////////////////////////////////////////////////////////////////////////////
  // const handleChange = useCallback((key: string, value: string[]) => {
  //   // Prvo ažurirajte lokalno stanje
  //   const newFilters = {
  //     ...pendingFilters,
  //     [key]: value
  //   };
    
  //   setPendingFilters(newFilters);
  //   onFilterChange(newFilters);

  //   // Ažuriranje URL-a preko useEffect-a
  //   // Ovo moramo izdvojiti u poseban useEffect izvan ove funkcije
  //   // Kreirajmo state za URL promene
  //   const [urlUpdate, setUrlUpdate] = useState<{key: string, value: string[]} | null>(null);

  //   const handleChange = useCallback((key: string, value: string[]) => {
  //     // Ažurirajte lokalno stanje
  //     const newFilters = {
  //       ...pendingFilters,
  //       [key]: value
  //     };
      
  //     setPendingFilters(newFilters);
  //     onFilterChange(newFilters);
  //     setUrlUpdate({key, value});
  //   }, [pendingFilters, onFilterChange]);

  //   // Ovo ide van tela handleChange funkcije, u telo komponente
  //   useEffect(() => {
  //     if (urlUpdate) {
  //       const params = new URLSearchParams(window.location.search);
        
  //       if (urlUpdate.value.length > 0) {
  //         params.set(urlUpdate.key, urlUpdate.value.join(','));
  //       } else {
  //         params.delete(urlUpdate.key);
  //       }

  //       router.replace(`?${params.toString()}`, { scroll: false });
  //     }
  //   }, [urlUpdate, router]);
  // }, [pendingFilters, onFilterChange]);
////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    // Ovo će osigurati sinhronizaciju kada URL promeni sa spolja
    const params = new URLSearchParams(searchParams.toString());
    const newFilters = { ...filters };
    
    let hasChanges = false;
    Object.keys(filters).forEach(key => {
      const value = params.get(key);
      if (value) {
        const newValue = Array.isArray(filters[key as keyof ArtikalFilterProp]) 
          ? value.split(',') 
          : value;
        
        if (JSON.stringify(newFilters[key as keyof ArtikalFilterProp]) !== JSON.stringify(newValue)) {
          newFilters[key as keyof ArtikalFilterProp] = newValue;
          hasChanges = true;
        }
      } else if (filters[key as keyof ArtikalFilterProp]) {
        newFilters[key as keyof ArtikalFilterProp] = 
          Array.isArray(filters[key as keyof ArtikalFilterProp]) ? [] : '';
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setPendingFilters(newFilters);
      setFilters(newFilters);
      onFilterChange(newFilters);
    }
  }, [searchParams]);


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
    </div>
  )
}

export default React.memo(ArtikalFilter)