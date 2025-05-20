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

// Simulirani podaci za artikle
const sviArtikli = Array.from({ length: 42 }, (_, i) => ({
  id: i + 1,
  naslov: `Artikal ${i + 1} - Naziv proizvoda`,
  cena: (500 + i * 10),
  slika: "/Artikal.jpg",
}))

const ListaArtikala = () => {
  const [trenutnaStrana, setTrenutnaStrana] = useState(1)
  const artikliPoStrani = 8
  const router = useRouter()
  const searchParams = useSearchParams()

  // Koristimo useMemo da bi brojStranica bio stabilan između renderovanja
  const brojStranica = useMemo(() => Math.ceil(sviArtikli.length / artikliPoStrani), [])

  // Inicijalizacija stranice na osnovu parametra iz URL-a
  useEffect(() => {
    const page = searchParams.get('page')
    if (page) {
      const pageNumber = parseInt(page, 10)
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= brojStranica) {
        setTrenutnaStrana(pageNumber)
      }
    }
  }, [searchParams]) // Sada smo uklonili brojStranica iz dependency array-a

  const prikazaniArtikli = useMemo(() => {
    return sviArtikli.slice(
      (trenutnaStrana - 1) * artikliPoStrani,
      trenutnaStrana * artikliPoStrani
    )
  }, [trenutnaStrana])

  const idiNaStranu = (broj: number) => {
    if (broj < 1 || broj > brojStranica || broj === trenutnaStrana) return
    
    setTrenutnaStrana(broj)
    router.push(`?page=${broj}`, { scroll: false })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      {/* Mreža artikala */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {prikazaniArtikli.map((artikal) => (
          <ArticleCard
            key={artikal.id}
            naslov={artikal.naslov}
            cena={artikal.cena}
            slika={artikal.slika}
          />
        ))}
      </div>

      {/* Paginacija */}
      <Paginacija>
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