'use client'

import { ArtikalFilterProp, ArtikalType } from '@/types/artikal'
import React, { useEffect, useState } from 'react'
import MultiRangeSlider from './ui/MultiRangeSlider'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from './ui/collapsible'
import { useRouter, useSearchParams } from 'next/navigation'
import { dajKorisnikaIzTokena } from '@/lib/auth';

interface ProductFilterProps {
  artikli: any[];
  atributi: any[];
  kategorija: string;
  podkategorija: string | null;
  onFilterChange: (filters: ArtikalFilterProp) => void;
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

  const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
  const korisnik = dajKorisnikaIzTokena();
  const fullUrl = `${apiAddress}/api/Artikal/DajArtikalCene?grupa=${encodeURIComponent(kategorija)}&podgrupa=${podkategorija ? encodeURIComponent(podkategorija) : ""}`;
  //const fullUrl = `${apiAddress}/api/Artikal/DajArtikleSaPaginacijom?${queryParams.toString()}&idPartnera=${korisnik?.idKorisnika}`;
  console.log("FULL URL:", fullUrl);


  const fetchCene = async () => {
    try {
      const res = await fetch(fullUrl);

      if (!res.ok) {
        throw new Error(`HTTP greška: ${res.status} - ${res.statusText}`);
      }

      const data = await res.json();

      if (data.length) {
        console.log("CENE IZ FETCHA: ", data);

        const mapaCena = new Map<string, number>();
        data.forEach((artikal: any) => {
          mapaCena.set(artikal.idArtikla, artikal.cena);
        });

        console.log("MAPA CENA:", mapaCena);
        return mapaCena;

      } else {
        console.log("PRAZAN FETCH CENE");
        return new Map(); // vraćamo praznu mapu
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Greška:', error);
      } else {
        console.error('Nepoznata greška:', error);
      }
      return new Map(); // fallback
    }
  };

  //-----------------------------------------------------------------------
  const [mapaCena, setMapaCena] = useState<Map<string, number>>(new Map());
  const [minCena, setMinCena] = useState(0);
  const [maxCena, setMaxCena] = useState(100000);
  const [sliderValues, setSliderValues] = useState<[number, number]>([minCena, maxCena]);

  /*const getCenaRange = (cenaStr: string | undefined): [number, number] => {
    if (!cenaStr) return [0, 100000];
    const [min, max] = cenaStr.split('-').map(Number);
    return [min || 0, max || 100000];
  };

  // Primer:
  const [minCena, maxCena] = getCenaRange(filters.cena);*/


  const updateURLWithCena = (min: number, max: number) => {
    const params = new URLSearchParams(searchParams.toString());

    // Postavi novu vrednost za cenu
    params.set('cena', `${min}-${max}`);
    params.set('page', '1'); // Resetuj paginaciju

    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        cena: `${sliderValues[0]}-${sliderValues[1]}`,
      }));


      updateURLWithCena(sliderValues[0], sliderValues[1]);
    }, 500);

    return () => clearTimeout(timeout);
  }, [sliderValues]);

  useEffect(() => {
    const cenaParam = searchParams.get('cena');
    if (cenaParam) {
      const [min, max] = cenaParam.split('-').map(Number);
      setFilters((prev) => ({
        ...prev,
        cena: `${min}-${max}`,
      }));
      setSliderValues([min, max]);
    }
  }, []);




  useEffect(() => {
    const fetchAndSetCene = async () => {
      const ceneMapa = await fetchCene(); // vraca Map<string, number>
      setMapaCena(ceneMapa);

      const cene = Array.from(ceneMapa.values());
      if (cene.length > 0) {
        setMinCena(Math.min(...cene));
        setMaxCena(Math.max(...cene));
      }
    };

    fetchAndSetCene();
  }, []);
  //------------------------------------------------------------------------

  function asArray(value: string | string[] | undefined): string[] {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }

  const [filters, setFilters] = useState<ArtikalFilterProp>({
    naziv: searchParams.get('naziv') || '',
    jm: asArray(searchParams.getAll('jm')),
    Materijal: asArray(searchParams.getAll('Materijal')),
    Model: asArray(searchParams.getAll('Model')),
    Pakovanje: asArray(searchParams.getAll('Pakovanje')),
    RobnaMarka: asArray(searchParams.getAll('RobnaMarka')),
    Upotreba: asArray(searchParams.getAll('Upotreba')),
    Boja: asArray(searchParams.getAll('Boja')),
  })

  const [filterOptions, setFilterOptions] = useState<{
    jm: string[]
    Materijal: string[]
    Model: string[]
    Pakovanje: string[]
    RobnaMarka: string[]
    Upotreba: string[]
    Boja: string[]
  }>({
    jm: [],
    Materijal: [],
    Model: [],
    Pakovanje: [],
    RobnaMarka: [],
    Upotreba: [],
    Boja: [],
  })

  /*artikli.forEach((artikal, index) => {
    const cena = artikal.artikalCene?.[0]?.cena;

    console.log(`Artikal ${index + 1} - Cena: ${cena}`);
  });

  const cene = artikli.map(artikal => artikal.artikalCene?.[0]?.cena);
  console.log("Sve cene:", cene);*/



  useEffect(() => {
    if (!artikli || artikli.length === 0 || !atributi) return

    console.log("Stigli atributi:", artikli);
    console.log("Stigli atributi:", atributi);
    fetchCene();

    const grupe = Object.entries(atributi).map(([key, value]) => [
      key.trim() === '' ? 'Nepoznata grupa' : key,
      value,
    ])

    const grupa = grupe.find(
      ([nazivGrupe]) => nazivGrupe.toLowerCase() === kategorija.toLowerCase()
    )
    if (!grupa) return

    const atributiGrupe = grupa[1] as any[]

    const relevantniAtributi = podkategorija
      ? atributiGrupe.filter((attr) =>
          attr.imeAtributa === 'Podgrupa(2)' && attr.vrednost === podkategorija
            ? true
            : attr.imeAtributa !== 'Podgrupa(2)' &&
              atributiGrupe.some(
                (a) =>
                  a.idArtikla === attr.idArtikla &&
                  a.imeAtributa === 'Podgrupa(2)' &&
                  a.vrednost === podkategorija
              )
        )
      : atributiGrupe

    const filteri = {
      Materijal: new Set<string>(),
      Model: new Set<string>(),
      Pakovanje: new Set<string>(),
      RobnaMarka: new Set<string>(),
      Upotreba: new Set<string>(),
      Boja: new Set<string>(),
    }

    for (const attr of relevantniAtributi) {
      if (attr.imeAtributa.includes('Materijal')) filteri.Materijal.add(attr.vrednost)
      else if (attr.imeAtributa.includes('Model')) filteri.Model.add(attr.vrednost)
      else if (attr.imeAtributa.includes('Pakovanje')) filteri.Pakovanje.add(attr.vrednost)
      else if (attr.imeAtributa.includes('Robna marka')) filteri.RobnaMarka.add(attr.vrednost)
      else if (attr.imeAtributa.includes('Upotreba')) filteri.Upotreba.add(attr.vrednost)
      else if (
        attr.imeAtributa.includes('Zavr.obr-boja') ||
        attr.imeAtributa.includes('Boja')
      )
        filteri.Boja.add(attr.vrednost)
    }

    const jedinice = Array.from(
      new Set(
        artikli
          .filter((artikal) =>
            podkategorija
              ? atributiGrupe.some(
                  (a) =>
                    a.idArtikla === artikal.idArtikla &&
                    a.imeAtributa === 'Podgrupa(2)' &&
                    a.vrednost === podkategorija
                )
              : true
          )
          .map((a) => a.jm)
          .filter((v) => v !== undefined && v !== null && v !== '')
      )
    )

    setFilterOptions({
      jm: jedinice,
      Materijal: Array.from(filteri.Materijal),
      Model: Array.from(filteri.Model),
      Pakovanje: Array.from(filteri.Pakovanje),
      RobnaMarka: Array.from(filteri.RobnaMarka),
      Upotreba: Array.from(filteri.Upotreba),
      Boja: Array.from(filteri.Boja),
    })
  }, [artikli, atributi, kategorija, podkategorija])

  const handleChange = (name: string, value: string | string[]) => {
    const updatedFilters = {
      ...filters,
      [name]: value,
    }

    setFilters(updatedFilters)

    const params = new URLSearchParams()

    Object.entries(updatedFilters).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        val.forEach((v) => {
          if (v && v.trim() !== '') params.append(key, v)
        })
      } else if (typeof val === 'string' && val.trim() !== '') {
        params.set(key, val)
      }
    })

    params.set('page', '1') // resetuj paginaciju
    router.push(`${window.location.pathname}?${params.toString()}`)

    // Takođe pozovi callback za promenu filtera
    onFilterChange(updatedFilters)
  }

  useEffect(() => {
    setFilters({
      naziv: searchParams.get('naziv') || '',
      jm: asArray(searchParams.getAll('jm')),
      Materijal: asArray(searchParams.getAll('Materijal')),
      Model: asArray(searchParams.getAll('Model')),
      Pakovanje: asArray(searchParams.getAll('Pakovanje')),
      RobnaMarka: asArray(searchParams.getAll('RobnaMarka')),
      Upotreba: asArray(searchParams.getAll('Upotreba')),
      Boja: asArray(searchParams.getAll('Boja')),
    })
  }, [searchParams])

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-xl mx-auto space-y-4 relative">
      {/* Cena (NE collapsible) */}
      <div className="mb-4">
        <label className="block font-semibold text-gray-700 mb-2">Cena (RSD)</label>
        <MultiRangeSlider
          min={minCena}
          max={maxCena}
          step={100}
          minValue={filters.cena ? filters.cena[0] : minCena}
          maxValue={filters.cena ? filters.cena[1] : maxCena}
          barInnerColor="#10b981"
          thumbLeftColor="#3b82f6"
          thumbRightColor="#3b82f6"
          barLeftColor="#e5e7eb"
          barRightColor="#e5e7eb"
          onInput={(e: any) => {
            setSliderValues([e.minValue, e.maxValue]);
          }}
        />
      </div>

      {/* Jedinica mere */}
      <Collapsible>
        <CollapsibleTrigger className="w-full py-2 text-left font-semibold text-gray-700 border-b border-gray-200">
          Jedinica mere
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 pb-2 flex flex-col space-y-2">
          {filterOptions.jm.map((option) => (
            <label key={option} className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.jm.includes(option)}
                onChange={(e) => {
                  let newValues: string[] = []
                  if (e.target.checked) {
                    newValues = [...filters.jm, option]
                  } else {
                    newValues = filters.jm.filter((v) => v !== option)
                  }
                  handleChange('jm', newValues)
                }}
                className="form-checkbox text-blue-600"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Ostali filteri */}
      {(['Materijal', 'Model', 'Pakovanje', 'RobnaMarka', 'Upotreba', 'Boja'] as const).map(
        (key) => (
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
        )
      )}

      {/* Reset dugme */}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => {
            setFilters(defaultFilters)
            onFilterChange(defaultFilters)
            router.push(window.location.pathname)
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