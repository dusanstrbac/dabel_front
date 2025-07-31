'use client'

import { ArtikalFilterProp } from '@/types/artikal'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import MultiRangeSlider, { ChangeResult } from './ui/MultiRangeSlider'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './ui/collapsible'
import { useRouter, useSearchParams } from 'next/navigation'
import { dajKorisnikaIzTokena } from '@/lib/auth'

interface ProductFilterProps {
  artikli: any[];
  atributi: AtributiResponse; // Koristite novi interfejs umesto any[]
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
  const [sliderValues, setSliderValues] = useState<[number, number]>([minCena, maxCena])

  // Aktuelni filteri
  const [filters, setFilters] = useState<ArtikalFilterProp>(defaultFilters)

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

  // Fetch cena za artikle iz API-ja
  const fetchCene = async () => {
    try {
      const res = await fetch(fullUrl)
      if (!res.ok) throw new Error(`HTTP greška: ${res.status}`)
      const data = await res.json()

      if (data.length) {
        const novaMapaCena = new Map<string, number>()
        data.forEach((artikal: any) => {
          if (artikal.idArtikla && artikal.cena) {
            novaMapaCena.set(artikal.idArtikla, artikal.cena)
          }
        })
        return novaMapaCena
      }
      return new Map()
    } catch (error) {
      console.error('Greška pri dobijanju cena:', error)
      return new Map()
    }
  }

  // Postavi opseg cena na osnovu fetchovanih cena
  useEffect(() => {
    const postaviOpsegCena = async () => {
      const ceneMapa = await fetchCene()
      setMapaCena(ceneMapa)

      const cene = Array.from(ceneMapa.values())
      if (cene.length > 0) {
        const noviMin = Math.min(...cene)
        const noviMax = Math.max(...cene)
        setMinCena(noviMin)
        setMaxCena(noviMax)
        setSliderValues([noviMin, noviMax])
      }
    }
    postaviOpsegCena()
  }, [artikli, kategorija, podkategorija])

  // Helper za konvertovanje u niz
  function asArray(value: string | string[] | undefined): string[] {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }

  // **Inicijalizacija filtera iz URL parametara** - samo postavljanje state, ne poziva onFilterChange
  useEffect(() => {
    const cenaParam = searchParams.get('cena')
    const filtersFromUrl = { ...defaultFilters }

    if (cenaParam) {
      const [min, max] = cenaParam.split('-').map(Number)
      if (!isNaN(min) && !isNaN(max)) {
        filtersFromUrl.cena = `${min}-${max}`
        setSliderValues([min, max])
      }
    }

    filtersFromUrl.naziv = searchParams.get('naziv') || ''
    filtersFromUrl.jm = asArray(searchParams.getAll('jm'))
    filtersFromUrl.Materijal = asArray(searchParams.getAll('Materijal'))
    filtersFromUrl.Model = asArray(searchParams.getAll('Model'))
    filtersFromUrl.Pakovanje = asArray(searchParams.getAll('Pakovanje'))
    filtersFromUrl.RobnaMarka = asArray(searchParams.getAll('RobnaMarka'))
    filtersFromUrl.Upotreba = asArray(searchParams.getAll('Upotreba'))
    filtersFromUrl.Boja = asArray(searchParams.getAll('Boja'))

    if (JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filtersFromUrl)) {
      setFilters(filtersFromUrl)
      prevFiltersRef.current = filtersFromUrl
    }
  }, [searchParams])

  // **Mapiranje atributa dobijenih iz API-ja u filtere**
useEffect(() => {
  const atributiFiltera: AtributiFiltera = {
    jm: [],
    Materijal: [],
    Model: [],
    Pakovanje: [],
    RobnaMarka: [],
    Upotreba: [],
    Boja: [],
  };

  // 1. Dodaj jedinice mere iz artikala
  artikli?.forEach((artikal) => {
    if (artikal.jm && !atributiFiltera.jm.includes(artikal.jm)) {
      atributiFiltera.jm.push(artikal.jm);
    }
  });

  // 2. Obradi atribute iz novog formata podataka
  if (atributi && typeof atributi === 'object' && !Array.isArray(atributi)) {
    // Eksplicitno tipiziranje za Object.values
    const atributiArray: ArtikalAtribut[][] = Object.values(atributi);
    
    atributiArray.forEach((artikalAtributi: ArtikalAtribut[]) => {
      if (!Array.isArray(artikalAtributi)) return;

      artikalAtributi.forEach((attr: ArtikalAtribut) => {
        if (!attr || !attr.imeAtributa) return;

        const cistoIme = ocistiImeAtributa(attr.imeAtributa);
        if (cistoIme in atributiFiltera && attr.vrednost) {
          const kategorija = atributiFiltera[cistoIme as keyof AtributiFiltera];
          if (!kategorija.includes(attr.vrednost)) {
            kategorija.push(attr.vrednost);
          }
        }
      });
    });
  }
  console.log(atributi);
  setFilterOptions(atributiFiltera);
}, [atributi, artikli]);


  const handleChange = useCallback((name: string, value: string | string[]) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

const handleCenaChange = useCallback((e: ChangeResult) => {
  setSliderValues([e.min, e.max]);
  handleChange('cena', `${e.min}-${e.max}`);
}, [handleChange]);

function ocistiImeAtributa(ime: string): string {
  if (!ime) return '';
  
  let cistoIme = ime.replace(/\(\d+\)$/, '').trim();
  
  const mapaZamena: Record<string, string> = {
    'Zavr.obr-boja': 'Boja',
    'Robna marka': 'RobnaMarka',
    'Robnamarka': 'RobnaMarka',
  };
  
  return mapaZamena[cistoIme] || cistoIme;
}

  function prikaziLepoIme(ime: string): string {
  const mapaZamena: Record<string, string> = {
    'jm': 'Jedinica mere',
    'Materijal': 'Materijal',
    'Model': 'Model',
    'Pakovanje': 'Pakovanje',
    'RobnaMarka': 'Robna marka',
    'Upotreba': 'Upotreba',
    'Boja': 'Boja'
  };
  
  return mapaZamena[ime] || ime;
}

  useEffect(() => {
    if (prevFiltersRef.current && JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters)) {
      onFilterChange(filters)
    }
    prevFiltersRef.current = filters
  }, [filters, onFilterChange])


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
          onChange={handleCenaChange}
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
                        checked={filters[key as keyof ArtikalFilterProp]?.includes(option) ?? false}
                        onChange={(e) => {
                          const current = filters[key as keyof ArtikalFilterProp] || []
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
    </div>
  )
}

export default React.memo(ArtikalFilter);