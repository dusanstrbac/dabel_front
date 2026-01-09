'use client'

import React, { useState, useEffect, useMemo, useCallback } from "react";
import ArticleCard from "./ArticleCard";
import ArtikalFilter from "./ArtikalFilter";
import { Paginacija, PaginacijaSadrzaj, PaginacijaStavka, PaginacijaLink, PaginacijaPrethodna, PaginacijaSledeca } from "@/components/ui/pagination";
import { ArtikalType, ListaArtikalaProps, NoviArtikalType } from "@/types/artikal";
import { dajKorisnikaIzTokena } from "@/lib/auth";
import { useTranslations } from "next-intl";

const ListaArtikala = ({
  artikli,
  kategorija,
  podkategorija,
  currentPage,
  pageSize = 8,
  onPageChange,
  loading = false,
}: ListaArtikalaProps) => {
  const korisnik = dajKorisnikaIzTokena();
  const MemoizedArticleCard = React.memo(ArticleCard);
  const [noResults, setNoResults] = useState(false);
  const [filtriraniArtikli, setFiltriraniArtikli] = useState<NoviArtikalType[]>([]);
  const [TestArtikli, setTestArtikli] = useState<ArtikalType[]>([]);
  const t = useTranslations();

  // Osveži filtrirane artikle kada se promene originalni artikli
  useEffect(() => {
    setFiltriraniArtikli(artikli);
  }, [artikli]);

  // Računamo broj stranica na osnovu filtriranih artikala
  const brojStranica = Math.ceil(filtriraniArtikli.length / pageSize);

  // Funkcija za promenu stranice
  const idiNaStranu = (broj: number, event?: React.MouseEvent) => {
    if (event) event.preventDefault();
    if (broj < 1 || broj > brojStranica) return;
    onPageChange(broj);
  };


  // Prikazani artikli za trenutnu stranicu
  const prikazaniArtikli = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filtriraniArtikli.slice(startIndex, startIndex + pageSize);
  }, [filtriraniArtikli, currentPage, pageSize]);

  useEffect(() => {
    setNoResults(filtriraniArtikli.length === 0);
  }, [filtriraniArtikli]);



  // Dodaj memoizaciju callback funkcija
  const stableOnFilterChange = useCallback((filtered: ArtikalType[]) => {
    // setFiltriraniArtikli(filtered);
    onPageChange(1);
  }, [onPageChange]);

  return (
    <div className="flex flex-col md:flex-row w-full px-1 gap-4">
      <div className="w-full md:w-1/4">
        <ArtikalFilter
          artikli={TestArtikli}
          kategorija={kategorija || ''}
          podkategorija={podkategorija || ''}
          onFilterChange={stableOnFilterChange}
        />
      </div>

      <div className="w-full md:w-3/4">
        <div className="relative">
          <div className={`grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 align-middle transition-opacity duration-300 ${
            loading ? 'opacity-50 pointer-events-none' : ''
          }`}>
            {/* {prikazaniArtikli.map((artikal, idx) => (
              <MemoizedArticleCard
                idPartnera={korisnik?.partner ?? ""} 
                key={artikal.Artikal ?? idx}
                {...artikal}
              />
            ))} */}
            {prikazaniArtikli.map((artikal, idx) => (
              <MemoizedArticleCard
                key={artikal.Artikal ?? idx}
                idPartnera={korisnik?.partner ?? ""}
                
                // Ručno mapiranje naziva polja
                Artikal={artikal.Artikal ?? idx}
                Naziv={artikal.Naziv}
                KolicinaZaIzdavanje={artikal.KolicinaZaIzdavanje}
                KolicinaNaStanju={artikal.KolicinaZaIzdavanje}
                Cena={artikal.Cena}
                AkcijskaCena={artikal.AkcijskaCena}
                AkcijskaKolicina={artikal.AkcijskaKolicina}
                datumPristizanja={artikal.DatumPristizanja}
                datumPoslednjeKupovine="njimik" 
              />
            ))}
          </div>
        </div>

        {noResults && (
          <p className="text-center py-5 text-red-500">{t('main.Nema artikala koji odgovaraju izabranim filterima')}</p>
        )}

        {brojStranica > 1 && (
          <Paginacija className="my-[20px]">
            <PaginacijaSadrzaj>
              <PaginacijaStavka>
                <PaginacijaPrethodna
                  onClick={(e) => idiNaStranu(currentPage - 1, e)}
                  disabled={currentPage === 1}
                />
              </PaginacijaStavka>

              {[...Array(brojStranica)].map((_, i) => {
                const broj = i + 1;
                if (
                  broj === 1 ||
                  broj === brojStranica ||
                  Math.abs(currentPage - broj) <= 1
                ) {
                  return (
                    <PaginacijaStavka key={broj}>
                      <PaginacijaLink
                        isActive={currentPage === broj}
                        onClick={(e) => idiNaStranu(broj, e)}
                      >
                        {broj}
                      </PaginacijaLink>
                    </PaginacijaStavka>
                  );
                }

                if (
                  (broj === 2 && currentPage > 3) ||
                  (broj === brojStranica - 1 && currentPage < brojStranica - 2)
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
                  onClick={(e) => idiNaStranu(currentPage + 1, e)}
                  disabled={currentPage === brojStranica}
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