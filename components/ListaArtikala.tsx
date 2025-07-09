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

const ListaArtikala = ({ artikli, totalCount, currentPage, onPageChange }: ListaArtikalaProps) => {
  const artikliPoStrani = 8;
  const router = useRouter();
  const pathname = usePathname(); // Dobijanje pathname-a
  const searchParams = useSearchParams();
  const trenutnaStrana = currentPage;
  const korisnik = dajKorisnikaIzTokena();
  const idPartnera = korisnik?.idKorisnika;

  const [filteri, setFilteri] = useState<ArtikalFilterProp>({
    naziv: '',
    jedinicaMere: '',
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

    console.log("Idi na stranu:", broj);

    if (broj < 1 || broj > brojStranica || broj === trenutnaStrana) return;

    // Kreiraj objekat sa svim filterima i trenutnim parametrima
    const noviUpit = {
      ...Object.fromEntries(searchParams.entries()), // Zadrži postojeće parametre
      ...noviFilteri, // Dodaj nove filtre
      page: broj.toString(), // Dodaj ili promeni parametar za stranicu
    };

    // Kreiraj query string
    const queryString = new URLSearchParams(noviUpit).toString();

    // Prosledi pathname i query kao string
    router.push(`${pathname}?${queryString}`);
  };

  const onFilterChange = (noviFilteri: ArtikalFilterProp) => {
    setFilteri(noviFilteri);
    // Ovde dodaj logiku za filtriranje artikala ako je potrebno
  };

  if (!artikli || artikli.length === 0) {
    return <p className="text-center py-5 text-gray-500">Nema artikala za prikaz.</p>;
  }

  return (
    <div className="flex flex-col md:flex-row w-full px-1 gap-4">
      {/* Filter sekcija */}
      <div className="w-full md:w-1/4">
        <ArtikalFilter artikli={artikli} onFilterChange={onFilterChange} />
      </div>

      {/* Lista artikala */}
      <div className="w-full md:w-3/4">
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 align-middle">
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