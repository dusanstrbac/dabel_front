'use client'

import { ArtikalFilterProp } from '@/types/artikal'
import React, { useEffect, useMemo, useState } from 'react'
import MultiRangeSlider from './ui/MultiRangeSlider'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from './ui/collapsible'
import { useRouter, useSearchParams } from 'next/navigation'
import { dajKorisnikaIzTokena } from '@/lib/auth'

interface ProductFilterProps {
  artikli: any[]
  atributi: any[]
  kategorija: string
  podkategorija: string | null
  onFilterChange: (filters: ArtikalFilterProp) => void
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
  const fullUrl = `${apiAddress}/api/Artikal/DajArtikalCene?grupa=${encodeURIComponent(
    kategorija
  )}&podgrupa=${podkategorija ? encodeURIComponent(podkategorija) : ''}`

  // Cena
  const [mapaCena, setMapaCena] = useState<Map<string, number>>(new Map())
  const [minCena, setMinCena] = useState(0)
  const [maxCena, setMaxCena] = useState(100000)
  const [sliderValues, setSliderValues] = useState<[number, number]>([
    minCena,
    maxCena,
  ])

  // Aktuelni filteri
  const [filters, setFilters] = useState<ArtikalFilterProp>(defaultFilters)

  // Opcije filtera - uvek se uzimaju iz svih artikala i atributa
  const [filterOptions, setFilterOptions] = useState({
    jm: [] as string[],
    Materijal: [] as string[],
    Model: [] as string[],
    Pakovanje: [] as string[],
    RobnaMarka: [] as string[],
    Upotreba: [] as string[],
    Boja: [] as string[],
  })

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

  // Pomoćna da konvertuje vrednost u niz stringova
  function asArray(value: string | string[] | undefined): string[] {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }

  // Inicijalizacija filtera iz URL parametara
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

    setFilters(filtersFromUrl)
    onFilterChange(filtersFromUrl)
  }, [searchParams])

  // Priprema opcija filtera iz celokupnih atributa i artikala
  useEffect(() => {
    // Ekstrakcija atributa iz props atributi
    const atributiNiz = Array.isArray(atributi)
      ? atributi
      : Array.isArray(atributi[''])
      ? atributi['']
      : []

    if (!artikli || !Array.isArray(atributiNiz)) {
      return
    }

    const atributiFiltera = {
      Materijal: new Set<string>(),
      Model: new Set<string>(),
      Pakovanje: new Set<string>(),
      RobnaMarka: new Set<string>(),
      Upotreba: new Set<string>(),
      Boja: new Set<string>(),
    }

    atributiNiz.forEach((attr) => {
      if (!attr?.imeAtributa || !attr.vrednost) return

      const vrednost = attr.vrednost.trim()
      if (!vrednost) return

      const ime = ocistiImeAtributa(attr.imeAtributa)

      if (atributiFiltera[ime as keyof typeof atributiFiltera]) {
        atributiFiltera[ime as keyof typeof atributiFiltera].add(vrednost)
      }
    })

    setFilterOptions({
      jm: Array.from(new Set(artikli.map((a) => a.jm).filter(Boolean))),
      Materijal: Array.from(atributiFiltera.Materijal),
      Model: Array.from(atributiFiltera.Model),
      Pakovanje: Array.from(atributiFiltera.Pakovanje),
      RobnaMarka: Array.from(atributiFiltera.RobnaMarka),
      Upotreba: Array.from(atributiFiltera.Upotreba),
      Boja: Array.from(atributiFiltera.Boja),
    })
  }, [artikli, atributi, kategorija, podkategorija])

  // Funkcija za update filtera i push u URL
const handleChange = (name: string, value: string | string[]) => {
  const updatedFilters = { ...filters, [name]: value };
  setFilters(updatedFilters);
  onFilterChange(updatedFilters);

  const params = new URLSearchParams();

  Object.entries(updatedFilters).forEach(([key, val]) => {
    if (Array.isArray(val)) {
      val.forEach(v => v && params.append(key, v));
    } else if (typeof val === 'string' && val.trim()) {
      params.set(key, val);
    }
  });

  params.set('page', '1');
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  const currentPathWithQuery = window.location.pathname + window.location.search;

  if (newUrl !== currentPathWithQuery) {
    router.push(newUrl);
  }
};


  const handleCenaChange = (min: number, max: number) => {
    setSliderValues([min, max])
    handleChange('cena', `${min}-${max}`)
  }

  function ocistiImeAtributa(ime: string): string {
    let cistoIme = ime.split('(')[0].trim()

    if (cistoIme === 'Zavr.obr-boja') return 'Boja'
    if (cistoIme === 'Robna marka') return 'RobnaMarka'

    return cistoIme
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-xl mx-auto space-y-4">
      {/* Filter za cenu */}
      <div className="mb-4">
        <label className="block font-semibold text-gray-700 mb-2">
          Cena (RSD)
        </label>
        <MultiRangeSlider
          min={minCena}
          max={maxCena}
          step={100}
          minValue={sliderValues[0]}
          maxValue={sliderValues[1]}
          barInnerColor="#10b981"
          thumbLeftColor="#3b82f6"
          thumbRightColor="#3b82f6"
          onInput={(e: { minValue: number; maxValue: number }) =>
            handleCenaChange(e.minValue, e.maxValue)
          }
        />
      </div>

      {/* Filter za jedinice mere */}
      <Collapsible>
        <CollapsibleTrigger className="w-full py-2 text-left font-semibold text-gray-700 border-b border-gray-200">
          Jedinica mere
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 pb-2 flex flex-col space-y-2">
          {filterOptions.jm.length > 0 ? (
            filterOptions.jm.map((option) => (
              <label key={option} className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.jm.includes(option)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...filters.jm, option]
                      : filters.jm.filter((v) => v !== option)
                    handleChange('jm', newValues)
                  }}
                  className="form-checkbox text-blue-600"
                />
                <span>{option}</span>
              </label>
            ))
          ) : (
            <p className="text-gray-500">Nema dostupnih jedinica mere</p>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Ostali filteri */}
      {(
        ['Materijal', 'Model', 'Pakovanje', 'RobnaMarka', 'Upotreba', 'Boja'] as const
      ).map((key) => (
        <Collapsible key={key} defaultOpen={false}>
          <CollapsibleTrigger className="w-full py-2 text-left font-semibold text-gray-700 border-b border-gray-200">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 pb-2 flex flex-col space-y-2">
            {filterOptions[key] && filterOptions[key].length > 0 ? (
              filterOptions[key].map((option) => (
                <label key={option} className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters[key]?.includes(option) ?? false}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...(filters[key] || []), option]
                        : (filters[key] || []).filter((v) => v !== option)
                      handleChange(key, newValues)
                    }}
                    className="form-checkbox text-blue-600"
                  />
                  <span>{option}</span>
                </label>
              ))
            ) : (
              <p className="text-gray-500">Nema dostupnih opcija</p>
            )}
          </CollapsibleContent>
        </Collapsible>
      ))}

      {/* Reset dugme */}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => {
            setFilters(defaultFilters)
            setSliderValues([minCena, maxCena])
            onFilterChange(defaultFilters)
            router.push(window.location.pathname)
          }}
          className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Resetuj filtere
        </button>
      </div>
    </div>
  )
}

export default ArtikalFilter
