'use client'

import { ArtikalFilterProp, ArtikalType } from '@/types/artikal'
import React, { useEffect, useState } from 'react'
import MultiRangeSlider from './ui/MultiRangeSlider'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from './ui/collapsible'
import { StepId } from 'framer-motion'

interface ProductFilterProps {
  artikli: any[];
  atributi: any[];
  kategorija: string;
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

const ArtikalFilter: React.FC<ProductFilterProps> = ({artikli, atributi, kategorija, onFilterChange }) => {
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

  useEffect(() => {
    if (!artikli || artikli.length === 0 || !atributi) return;
    console.log("Stigli artikli u filter:", atributi);

    const grupe = Object.entries(atributi).map(([key, value]) => [
      key.trim() === "" ? "Nepoznata grupa" : key,
      value,
    ]);
    
    const atributiPoGrupi = grupe.map(([nazivGrupe, atributi]) => {
      const filteri: {
        Materijal: Set<string>;
        Model: Set<string>;
        Pakovanje: Set<string>;
        RobnaMarka: Set<string>;
        Upotreba: Set<string>;
        Boja: Set<string>;
      } = {
        Materijal: new Set<string>(),
        Model: new Set<string>(),
        Pakovanje: new Set<string>(),
        RobnaMarka: new Set<string>(),
        Upotreba: new Set<string>(),
        Boja: new Set<string>(),
      };

      for (const attr of atributi) {
        if (attr.imeAtributa.includes("Materijal")) filteri.Materijal.add(attr.vrednost);
        else if (attr.imeAtributa.includes("Model")) filteri.Model.add(attr.vrednost);
        else if (attr.imeAtributa.includes("Pakovanje")) filteri.Pakovanje.add(attr.vrednost);
        else if (attr.imeAtributa.includes("Robna marka")) filteri.RobnaMarka.add(attr.vrednost);
        else if (attr.imeAtributa.includes("Upotreba")) filteri.Upotreba.add(attr.vrednost);
        else if (
          attr.imeAtributa.includes("Zavr.obr-boja") ||
          attr.imeAtributa.includes("Boja")
        )
          filteri.Boja.add(attr.vrednost);
      }

      return {
        grupa: nazivGrupe,
        filteri: {
          Materijal: Array.from(filteri.Materijal),
          Model: Array.from(filteri.Model),
          Pakovanje: Array.from(filteri.Pakovanje),
          RobnaMarka: Array.from(filteri.RobnaMarka),
          Upotreba: Array.from(filteri.Upotreba),
          Boja: Array.from(filteri.Boja),
        },
      };
    });

    const grupaZaKategoriju = atributiPoGrupi.find(
      ({ grupa }) => grupa.toLowerCase() === kategorija.toLowerCase()
    );

    if (grupaZaKategoriju) {
      const { filteri } = grupaZaKategoriju;

      setFilterOptions({
        jedinicaMere: Array.from(new Set(
          artikli
            .map((artikal) => artikal.jm)
            .filter((v) => v !== undefined && v !== null && v !== '')
        )),
        Materijal: filteri.Materijal,
        Model: filteri.Model,
        Pakovanje: filteri.Pakovanje,
        RobnaMarka: filteri.RobnaMarka,
        Upotreba: filteri.Upotreba,
        Boja: filteri.Boja,
      });
    }
  }, [artikli, atributi, kategorija]);

  const handleChange = <K extends keyof ArtikalFilterProp>(
    field: K,
    value: ArtikalFilterProp[K]
  ) => {
    const updatedFilters = { ...filters, [field]: value }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

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