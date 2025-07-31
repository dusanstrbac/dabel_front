'use client'

import { useState, useEffect, useMemo } from "react";
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

const ListaArtikala = ({ artikli, atributi, kategorija, podkategorija, totalCount, currentPage, onPageChange, loading = false }: ListaArtikalaProps) => {
  const artikliPoStrani = 8;
  const router = useRouter();
  const pathname = usePathname(); // Dobijanje pathname-a
  const searchParams = useSearchParams();
  const trenutnaStrana = currentPage;
  const korisnik = dajKorisnikaIzTokena();
  const idPartnera = korisnik?.idKorisnika;

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

  const brojStranica = useMemo(() => {
    const br = Math.ceil(totalCount / artikliPoStrani);
    return br < 1 ? 1 : br;
  }, [totalCount]);

  const prikazaniArtikli = artikli;


  // Funkcija za menjanje strane i update URL-a bez reloada
  const idiNaStranu = (broj: number, noviFilteri: any, event?: React.MouseEvent) => {
    if (event) event.preventDefault();
    if (broj < 1 || broj > brojStranica || broj === trenutnaStrana) return;

    // Kreiraj objekat sa svim filterima i trenutnim parametrima
    const noviUpit = new URLSearchParams();

    searchParams.forEach((value, key) => {
      if (value.trim() !== '') {
        noviUpit.append(key, value);
      }
    });

    noviUpit.set('page', broj.toString());

    router.push(`${pathname}?${noviUpit.toString()}`);
  };

  console.log("evo artikli koji ulaze u LIIIIStu artikala",artikli);
  //ovaj console.log je uvek prazan

  const onFilterChange = (noviFilteri: ArtikalFilterProp) => {
    setFilteri(noviFilteri);
    // Ovde dodaj logiku za filtriranje artikala ako je potrebno
  };

  // if (!artikli || artikli.length === 0) {
  //   return <p className="text-center py-5 text-gray-500">Nema artikala za prikaz.</p>;
  // }

  if (!artikli || artikli.length === 0) {
    return (
      <div className="flex flex-col md:flex-row w-full px-1 gap-4">
        <div className="w-full md:w-1/4">
          <ArtikalFilter 
            artikli={artikli} 
            atributi={atributi || {}} 
            kategorija={kategorija} 
            podkategorija={podkategorija} 
            onFilterChange={onFilterChange} 
          />
        </div>
        <div className="w-full md:w-3/4 flex items-center justify-center">
          <p className="text-center py-5 text-gray-500">
            {loading ? 'Učitavanje...' : 'Nema artikala za prikaz.'}
          </p>
        </div>
      </div>
    );
  }

  return (
  <div className="flex flex-col md:flex-row w-full px-1 gap-4">
    {/* Filter sekcija */}
    <div className="w-full md:w-1/4">
      {/* Možeš ovde dodati <ArtikalFilter /> ili slično ako budeš koristio filtere */}
      <ArtikalFilter 
        artikli={artikli} 
        atributi={atributi} 
        kategorija={kategorija} 
        podkategorija={podkategorija} 
        onFilterChange={onFilterChange} 
      />
    </div>

    {/* Lista artikala */}
    <div className="w-full md:w-3/4">
      <div className="relative">
        <div
          className={`
            grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 align-middle
            transition-opacity duration-300
            ${loading ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          {prikazaniArtikli.map((artikal, idx) => (
            <ArticleCard
              key={artikal.idArtikla ?? idx}
              naziv={artikal.naziv}
              idArtikla={artikal.idArtikla}
              barkod={artikal.barkod}
              kategorijaId={artikal.kategorijaId}
              kolicina={artikal.kolicina}
              jm={artikal.jm}
              artikalAtributi={artikal.artikalAtributi}
              artikalCene={artikal.artikalCene ?? []}
              lastPurchaseDate="2025-06-20"
              idPartnera={idPartnera!}
            />
          ))}
        </div>
      </div>

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
