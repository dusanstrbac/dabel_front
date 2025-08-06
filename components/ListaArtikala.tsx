'use client'

import React, { useState, useEffect, useMemo } from "react";
import ArticleCard from "./ArticleCard";
import ArtikalFilter from "./ArtikalFilter";
import {
  Paginacija,
  PaginacijaSadrzaj,
  PaginacijaStavka,
  PaginacijaLink,
  PaginacijaPrethodna,
  PaginacijaSledeca,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArtikalFilterProp, ListaArtikalaProps } from "@/types/artikal";
import { dajKorisnikaIzTokena } from "@/lib/auth";

const ListaArtikala = ({
  artikli,
  atributi,
  kategorija,
  podkategorija,
  totalCount,
  currentPage,
  onPageChange,
  loading = false,
  onFilterChange,
}: ListaArtikalaProps) => {

  console.log('Primljeni podaci u ListaArtikala:', {
    artikli,
    atributi,
    kategorija,
    podkategorija,
    totalCount,
    currentPage,
    loading
  });

  const artikliPoStrani = 8;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const trenutnaStrana = currentPage;
  const korisnik = dajKorisnikaIzTokena();
  const idPartnera = korisnik?.idKorisnika;
  const MemoizedArticleCard = React.memo(ArticleCard);

  const [filteri, setFilteri] = useState<ArtikalFilterProp>({
    naziv: '',
    jm: [],
    Materijal: [],
    Model: [],
    Pakovanje: [],
    RobnaMarka: [],
    Upotreba: [],
    Boja: [],
  });

  const [noResults, setNoResults] = useState(false);

  const brojStranica = useMemo(() => {
    const br = Math.ceil(totalCount / artikliPoStrani);
    return br < 1 ? 1 : br;
  }, [totalCount]);

  // Prikazivanje artikala prema trenutnoj stranici
  const prikazaniArtikli = useMemo(() => {
    const startIndex = (trenutnaStrana - 1) * artikliPoStrani;
    return artikli.slice(startIndex, startIndex + artikliPoStrani);
  }, [artikli, trenutnaStrana]);

  // Funkcija za menjanje strane i update URL-a
  const idiNaStranu = (broj: number, noviFilteri: any, event?: React.MouseEvent) => {
    if (event) event.preventDefault();
    if (broj < 1 || broj > brojStranica || broj === trenutnaStrana) return;

    const noviUpit = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (value.trim() !== '') {
        noviUpit.append(key, value);
      }
    });
    noviUpit.set('page', broj.toString());
    router.push(`${pathname}?${noviUpit.toString()}`);
  };

  useEffect(() => {
    if (artikli.length === 0) {
      setNoResults(true);
    } else {
      setNoResults(false);
    }
  }, [artikli]);

  async function fetchArtikliSaFilterima(filters: ArtikalFilterProp) {
    const query = new URLSearchParams();

    if (filters.naziv) query.append('naziv', filters.naziv);
    if (filters.cena) query.append('cena', filters.cena);

    for (const key of ['jm', 'Materijal', 'Model', 'Pakovanje', 'RobnaMarka', 'Upotreba', 'Boja']) {
      const vrednosti = filters[key as keyof ArtikalFilterProp];
      if (Array.isArray(vrednosti)) {
        vrednosti.forEach((val) => query.append(key, val));
      }
    }

    const res = await fetch(`/api/Artikal/DajArtikleSaPaginacijom?${query.toString()}`);
    const data = await res.json();
    // setArtikli(data.artikli)
  }

  console.log("evo jebo sam ti majku",artikli);
  return (
    <div className="flex flex-col md:flex-row w-full px-1 gap-4">
      <div className="w-full md:w-1/4">
        <ArtikalFilter
          artikli={artikli}
          atributi={atributi}
          kategorija={kategorija || ''}
          podkategorija={podkategorija || ''}
          onFilterChange={onFilterChange}
        />
      </div>

      <div className="w-full md:w-3/4">
        <div className="relative">
          <div
            className={`grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 align-middle transition-opacity duration-300 ${
              loading ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            {prikazaniArtikli.map((artikal, idx) => (
              // <ArticleCard
              //   key={artikal.idArtikla ?? idx}
              //   naziv={artikal.naziv}
              //   idArtikla={artikal.idArtikla}
              //   barkod={artikal.barkod}
              //   kategorijaId={artikal.kategorijaId}
              //   kolicina={artikal.kolicina}
              //   jm={artikal.jm}
              //   artikalAtributi={artikal.artikalAtributi}
              //   artikalCene={artikal.artikalCene ?? []}
              //   lastPurchaseDate="2025-06-20"
              //   idPartnera={idPartnera!}
              //   kolZaIzdavanje={artikal.kolZaIzdavanje}
              // />
              <MemoizedArticleCard
                key={artikal.idArtikla ?? idx}
                {...artikal}
              />
            ))}
          </div>
        </div>

        {noResults && (
          <p className="text-center py-5 text-red-500">Nema artikala koji odgovaraju izabranim filterima.</p>
        )}

        {/* Paginacija */}
        {brojStranica > 1 && (
          <Paginacija className="my-[20px]">
            <PaginacijaSadrzaj>
              <PaginacijaStavka>
                <PaginacijaPrethodna
                  onClick={(e) => idiNaStranu(trenutnaStrana - 1, filteri, e)}
                  disabled={trenutnaStrana === 1}
                />
              </PaginacijaStavka>

              {[...Array(brojStranica)].map((_, i) => {
                const broj = i + 1;
                if (
                  broj === 1 ||
                  broj === brojStranica ||
                  Math.abs(trenutnaStrana - broj) <= 1
                ) {
                  return (
                    <PaginacijaStavka key={broj}>
                      <PaginacijaLink
                        isActive={trenutnaStrana === broj}
                        onClick={(e) => idiNaStranu(broj, filteri, e)}
                      >
                        {broj}
                      </PaginacijaLink>
                    </PaginacijaStavka>
                  );
                }

                if (
                  (broj === 2 && trenutnaStrana > 3) ||
                  (broj === brojStranica - 1 && trenutnaStrana < brojStranica - 2)
                ) {
                  return (
                    <PaginacijaStavka key={`ellipsis-${broj}`}>
                      <span className="px-2 text-gray-500">...</span>
                    </PaginacijaStavka>
                  );
                }

                return null;
              })}

              <PaginacijaStavka>
                <PaginacijaSledeca
                  onClick={(e) => idiNaStranu(trenutnaStrana + 1, filteri, e)}
                  disabled={trenutnaStrana === brojStranica}
                />
              </PaginacijaStavka>
            </PaginacijaSadrzaj>
          </Paginacija>
        )}
      </div>
    </div>
  );
};

export default ListaArtikala;