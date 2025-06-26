'use client'

import { ArtikalFilterProp, ArtikalType } from '@/types/artikal'
import React, { useEffect, useState, useMemo } from 'react'
import MultiRangeSlider from './ui/MultiRangeSlider'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from './ui/collapsible'

interface ProductFilterProps {
  artikli: any[];
  onFilterChange: (filters: ArtikalFilterProp) => void
}

const defaultFilters: ArtikalFilterProp = {
  naziv: '',
  jedinicaMere: '',
  Materijal: [],
  Model: [],
  Pakovanje: [],
  RobnaMarka: [],
  Upotreba: [],
  Boja: [],
}

const ArtikalFilter: React.FC<ProductFilterProps> = ({artikli, onFilterChange }) => {
  const [filters, setFilters] = useState<ArtikalFilterProp>(defaultFilters)
  const [filterOptions, setFilterOptions] = useState<{
    jedinicaMere: string[]
    Materijal: string[]
    Model: string[]
    Pakovanje: string[]
    RobnaMarka: string[]
    Upotreba: string[]
    Boja: string[]
  }>({
    jedinicaMere: [],
    Materijal: [],
    Model: [],
    Pakovanje: [],
    RobnaMarka: [],
    Upotreba: [],
    Boja: [],
  })


  const atributMapa: Record<string, string> = {
    Materijal: 'Materijal',
    Model: 'Model',
    Pakovanje: 'Pakovanje',
    RobnaMarka: 'Robna marka', // ovde pazimo na razmak
    Upotreba: 'Upotreba',
    Boja: 'Boja',
  }


  useEffect(() => {
    if (!artikli || artikli.length === 0) return;
    console.log("Stigli artikli u filter:", artikli);

    const getUniqueValues = (kljuc: string) => {
      if (kljuc.toLowerCase() === 'jm') {
        // Izvući jedinstvene vrednosti direktno iz polja artikal.jm
        const values = artikli
          .map((artikal) => artikal.jm)
          .filter((v) => v !== undefined && v !== null && v !== '')
        return Array.from(new Set(values))
      } else {
        // Ostale atribute vadi iz artikalAtributi
        const values = artikli
          .map((artikal) => {
            const atribut = artikal.artikalAtributi?.find((a: any) =>
              a.imeAtributa.toLowerCase() === kljuc.toLowerCase()
            )
            return atribut?.vrednost
          })
          .filter((v) => v !== undefined && v !== null && v !== '')
        return Array.from(new Set(values))
      }
    }




  //const materijali = getUniqueValues("Materijal");
  //console.log("Materijali iz artikala:", materijali);

    setFilterOptions({
      jedinicaMere: getUniqueValues("jm"),
      Materijal: getUniqueValues(atributMapa.Materijal),
      Model: getUniqueValues(atributMapa.Model),
      Pakovanje: getUniqueValues(atributMapa.Pakovanje),
      RobnaMarka: getUniqueValues(atributMapa.RobnaMarka),
      Upotreba: getUniqueValues(atributMapa.Upotreba),
      Boja: getUniqueValues(atributMapa.Boja),
    })


  }, [artikli]);

  const handleChange = <K extends keyof ArtikalFilterProp>(
    field: K,
    value: ArtikalFilterProp[K]
  ) => {
    const updatedFilters = { ...filters, [field]: value }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

  const parseFilterFromParams = (params: URLSearchParams): ArtikalFilterProp => {
    const parseArray = (key: string) => {
      const value = params.get(key)
      return value ? value.split(',') : []
    }

    return {
      naziv: params.get('naziv') || '',
      jedinicaMere: params.get('jedinicaMere') || '',
      Materijal: parseArray('Materijal'),
      Model: parseArray('Model'),
      Pakovanje: parseArray('Pakovanje'),
      RobnaMarka: parseArray('RobnaMarka'),
      Upotreba: parseArray('Upotreba'),
      Boja: parseArray('Boja'),
    }
  }

  const updateQueryParams = (filters: ArtikalFilterProp) => {
    const params = new URLSearchParams()

    if (filters.naziv) params.set('naziv', filters.naziv)
    if (filters.jedinicaMere) params.set('jedinicaMere', filters.jedinicaMere)

    const setArrayParam = (key: keyof ArtikalFilterProp) => {
      if (filters[key] && Array.isArray(filters[key]) && filters[key].length > 0) {
        params.set(key.toString(), (filters[key] as string[]).join(','))
      }
    }

    setArrayParam('Materijal')
    setArrayParam('Model')
    setArrayParam('Pakovanje')
    setArrayParam('RobnaMarka')
    setArrayParam('Upotreba')
    setArrayParam('Boja')

    return params.toString()
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    const parseArrayParam = (key: string) => {
      const param = params.get(key)
      return param ? param.split(',') : []
    }

    const noviFilteri: ArtikalFilterProp = {
      naziv: params.get('naziv') || '',
      jedinicaMere: params.get('jedinicaMere') || '',
      Materijal: parseArrayParam('Materijal'),
      Model: parseArrayParam('Model'),
      Pakovanje: parseArrayParam('Pakovanje'),
      RobnaMarka: parseArrayParam('RobnaMarka'),
      Upotreba: parseArrayParam('Upotreba'),
      Boja: parseArrayParam('Boja'),
    }

    setFilters(noviFilteri)
  }, [])

  const filtriraniArtikli = useMemo(() => {
    return artikli.filter((artikal) => {
      // Filter: jedinica mere
      if (filters.jedinicaMere && artikal.jm !== filters.jedinicaMere) return false

      // Filter: atributi
      const atributiMap = Object.fromEntries(
        (artikal.artikalAtributi || []).map((a: any) => [a.imeAtributa, a.vrednost])
      )

      const matchesAtribut = (key: keyof ArtikalFilterProp) => {
        const selected = filters[key]
        if (!selected || selected.length === 0) return true
        const value = atributiMap[key]
        return selected.includes(value)
      }

      return (
        matchesAtribut('Materijal') &&
        matchesAtribut('Model') &&
        matchesAtribut('Pakovanje') &&
        matchesAtribut('RobnaMarka') &&
        matchesAtribut('Upotreba') &&
        matchesAtribut('Boja')
      )
    })
  }, [artikli, filters])

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-xl mx-auto space-y-4 relative">
      {/* Cena (NE collapsible) */}
      <div className="mb-4">
        <label className="block font-semibold text-gray-700 mb-2">Cena (RSD)</label>
        <MultiRangeSlider
          min={0}
          max={100000}
          step={100}
          minValue={filters.cena ? filters.cena[0] : 0}
          maxValue={filters.cena ? filters.cena[1] : 1000}
          barInnerColor="#10b981"
          thumbLeftColor="#3b82f6"
          thumbRightColor="#3b82f6"
          barLeftColor="#e5e7eb"
          barRightColor="#e5e7eb"
        />
      </div>

      {/* Jedinica mere */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="w-full py-2 text-left font-semibold text-gray-700 border-b border-gray-200">
          Jedinica mere
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 pb-2">
          <select
            value={filters.jedinicaMere}
            onChange={(e) => handleChange('jedinicaMere', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Sve</option>
            {filterOptions.jedinicaMere.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </CollapsibleContent>
      </Collapsible>


      {/* Ostali filteri */}
      {(['Materijal', 'Model', 'Pakovanje', 'RobnaMarka', 'Upotreba', 'Boja'] as const).map((key) => (
        <Collapsible key={key} defaultOpen={false}>
          <CollapsibleTrigger className="w-full py-2 text-left font-semibold text-gray-700 border-b border-gray-200">
            {key}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 pb-2 flex flex-col space-y-2">
            {Array.isArray(filterOptions[key]) &&
              filterOptions[key].map((option) => (
                <label key={option} className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters[key]?.includes(option) ?? false}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...(filters[key] ?? []), option]
                        : (filters[key] ?? []).filter((v) => v !== option)
                      handleChange(key, newValues)
                    }}
                    className="form-checkbox text-blue-600"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
          </CollapsibleContent>
        </Collapsible>
      ))}

      {/* Reset dugme */}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => {
            setFilters(defaultFilters)
            onFilterChange(defaultFilters)
          }}
          className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
          type="button"
        >
          Resetuj filtere
        </button>
      </div>
    </div>
  )
}

export default ArtikalFilter