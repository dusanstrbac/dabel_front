// components/ProductFilter.tsx
import { ArtikalFilterProp } from '@/types/artikal';
import React, { useState } from 'react';
import MultiRangeSlider from './ui/MultiRangeSlider';

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from './ui/collapsible';

interface ProductFilterProps {
  onFilterChange: (filters: ArtikalFilterProp) => void;
}

const defaultFilters: ArtikalFilterProp = {
  cena: [0, 1000],
  naziv:'',
  jedinicaMere: '',
  Materijal: [],
  Model: [],
  Pakovanje: [],
  RobnaMarka: [],
  Upotreba: [],
  Boja: [],
};

const multiOptions = ['Opcija 1', 'Opcija 2', 'Opcija 3'];

const ArtikalFilter: React.FC<ProductFilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<ArtikalFilterProp>(defaultFilters);

  const handleChange = <K extends keyof ArtikalFilterProp>(field: K, value: ArtikalFilterProp[K]) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

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
            onChange={({ minValue, maxValue }) => handleChange('cena', [minValue, maxValue])}
            barInnerColor="#10b981"
            thumbLeftColor="#3b82f6"
            thumbRightColor="#3b82f6"
            barLeftColor="#e5e7eb"
            barRightColor="#e5e7eb"
        />
        </div>

        {/* Jedinica mere (collapsible, default otvoreno) */}
        <Collapsible defaultOpen>
        <CollapsibleTrigger className="w-full py-2 text-left font-semibold text-gray-700 border-b border-gray-200">
            Jedinica mere
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 pb-2">
            <select
            value={filters.jedinicaMere}
            onChange={(e) => handleChange('jedinicaMere', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="">Sve</option>
            <option value="kom">Kom</option>
            <option value="m">Metar</option>
            <option value="kg">Kilogram</option>
            </select>
        </CollapsibleContent>
        </Collapsible>

        {/* Ostali filteri (collapsible, default zatvoreni) */}
        {(['Materijal', 'Model', 'Pakovanje', 'RobnaMarka', 'Upotreba', 'Boja'] as const).map((key) => (
        <Collapsible key={key} defaultOpen={false}>
            <CollapsibleTrigger className="w-full py-2 text-left font-semibold text-gray-700 border-b border-gray-200">
            {key}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 pb-2 flex flex-col space-y-2">
            {multiOptions.map((option) => (
                <label key={option} className="inline-flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={filters[key]?.includes(option) ?? false}
                    onChange={(e) => {
                        const newValues = e.target.checked
                        ? [...(filters[key] ?? []), option]
                        : (filters[key] ?? []).filter((v) => v !== option);
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
            setFilters(defaultFilters);
            onFilterChange(defaultFilters);
            }}
            className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            type="button"
        >
            Resetuj filtere
        </button>
        </div>
    </div>
    );
};

export default ArtikalFilter;
