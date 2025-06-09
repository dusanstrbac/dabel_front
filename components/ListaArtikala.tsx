'use client'

import { useState, useEffect, useMemo } from "react"
import ArticleCard from "./ArticleCard"
import {
  Paginacija,
  PaginacijaSadrzaj,
  PaginacijaStavka,
  PaginacijaLink,
  PaginacijaPrethodna,
  PaginacijaSledeca,
  PaginacijaTackice,
} from "@/components/ui/pagination"
import { useRouter, useSearchParams } from "next/navigation"
import { ListaArtikalaProps } from "@/types/artikal"

const ListaArtikala = ({ artikli = [] }: ListaArtikalaProps) => {
  const [trenutnaStrana, setTrenutnaStrana] = useState(1)
  const artikliPoStrani = 8
  const router = useRouter()
  const searchParams = useSearchParams()


  const brojStranica = useMemo(() => Math.ceil(artikli.length / artikliPoStrani), [artikli])

  useEffect(() => {
    const page = searchParams.get('page')
    if (page) {
      const pageNumber = parseInt(page, 10)
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= brojStranica) {
        setTrenutnaStrana(pageNumber)
      }
    }
  }, [searchParams, brojStranica])

  const prikazaniArtikli = useMemo(() => {
    return artikli.slice(
      (trenutnaStrana - 1) * artikliPoStrani,
      trenutnaStrana * artikliPoStrani
    )
  }, [trenutnaStrana, artikli])

  const idiNaStranu = (broj: number) => {
    if (broj < 1 || broj > brojStranica || broj === trenutnaStrana) return
    
    setTrenutnaStrana(broj)

    const url = new URL(window.location.href)
    url.searchParams.set('page', broj.toString())

    router.push(`${url.pathname}${url.search}`, { scroll: false })
  }

  if (artikli.length === 0) {
    return <p className="text-center py-5 text-gray-500">Nema artikala za prikaz.</p>
  }


  return (
    <div className="flex flex-col w-full px-1">
      {/* Mreža artikala */}
      <div className="grid gap-1 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 align-middle">
        {prikazaniArtikli.map((artikal) => (
          <ArticleCard
            key={artikal.idArtikla}
            naziv={artikal.naziv}
            artikalCene={artikal.artikalCene}
            idArtikla={artikal.idArtikla}
            jm={artikal.jm}
            kategorijaId={artikal.kategorijaId}
            barkod={artikal.barkod}
            artikalAtributi={artikal.artikalAtributi}
          />
        ))}
      </div>

      {/* Paginacija */}
      <Paginacija className="my-[20px]">
        <PaginacijaSadrzaj>
          {trenutnaStrana > 1 && (
            <PaginacijaStavka>
              <PaginacijaPrethodna
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  idiNaStranu(trenutnaStrana - 1)
                }}
              />
            </PaginacijaStavka>
          )}

          {[...Array(brojStranica)].map((_, i) => {
            const broj = i + 1

            if (
              broj === 1 ||
              broj === brojStranica ||
              Math.abs(trenutnaStrana - broj) <= 1
            ) {
              return (
                <PaginacijaStavka key={broj}>
                  <PaginacijaLink
                    href="#"
                    isActive={trenutnaStrana === broj}
                    onClick={(e) => {
                      e.preventDefault()
                      idiNaStranu(broj)
                    }}
                  >
                    {broj}
                  </PaginacijaLink>
                </PaginacijaStavka>
              )
            }

            if (
              (broj === 2 && trenutnaStrana > 3) ||
              (broj === brojStranica - 1 && trenutnaStrana < brojStranica - 2)
            ) {
              return (
                <PaginacijaStavka key={`ellipsis-${broj}`}>
                  <PaginacijaTackice />
                </PaginacijaStavka>
              )
            }

            return null
          })}

          {trenutnaStrana < brojStranica && (
            <PaginacijaStavka>
              <PaginacijaSledeca
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  idiNaStranu(trenutnaStrana + 1)
                }}
              />
            </PaginacijaStavka>
          )}
        </PaginacijaSadrzaj>
      </Paginacija>
    </div>
  )
}

export default ListaArtikala
