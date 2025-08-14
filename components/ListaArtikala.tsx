'use client'

import React, { useState, useEffect } from "react";
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
import { ArtikalFilterProp, ListaArtikalaProps } from "@/types/artikal";
import { dajKorisnikaIzTokena } from "@/lib/auth";

const ListaArtikala = ({
  artikli,
  sviArtikli,
  kategorija,
  podkategorija,
  totalCount,
  currentPage,
  pageSize = 8,
  onPageChange,
  loading = false,
  onFilterChange,
}: ListaArtikalaProps) => {
  const korisnik = dajKorisnikaIzTokena();
  const MemoizedArticleCard = React.memo(ArticleCard);
  const [noResults, setNoResults] = useState(false);
  const brojStranica = Math.ceil(totalCount / pageSize);

  const idiNaStranu = (broj: number, event?: React.MouseEvent) => {
    if (event) event.preventDefault();
    if (broj < 1 || broj > brojStranica) return;
    onPageChange(broj);
  };

  useEffect(() => {
    setNoResults(artikli.length === 0);
  }, [artikli]);

  return (
    <div className="flex flex-col md:flex-row w-full px-1 gap-4">
      <div className="w-full md:w-1/4">
        <ArtikalFilter
          artikli={sviArtikli}
          kategorija={kategorija || ''}
          podkategorija={podkategorija || ''}
          onFilterChange={onFilterChange}
        />
      </div>

      <div className="w-full md:w-3/4">
        <div className="relative">
          <div className={`grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 align-middle transition-opacity duration-300 ${
            loading ? 'opacity-50 pointer-events-none' : ''
          }`}>
            {artikli.map((artikal, idx) => (
              <MemoizedArticleCard
                idPartnera={korisnik?.partner ?? ""} 
                key={artikal.idArtikla ?? idx}
                {...artikal}
              />
            ))}
          </div>
        </div>

        {noResults && (
          <p className="text-center py-5 text-red-500">Nema artikala koji odgovaraju izabranim filterima.</p>
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