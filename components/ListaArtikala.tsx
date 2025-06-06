'use client'

import { useState, useEffect, useMemo } from "react"
import ArticleCard from "./ArticleCard"
import ArtikalFilter from "./ArtikalFilter"  // <-- import filtera
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

  // Primer: dodaj state za filtere (ako želiš da ih koristiš)
  const [filteri, setFilteri] = useState({})

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

  const onFilterChange = (noviFilteri: any) => {
    setFilteri(noviFilteri)
    // Dodaj ovde logiku za filtriranje ako želiš
  }

  if (artikli.length === 0) {
    return <p className="text-center py-5 text-gray-500">Nema artikala za prikaz.</p>
  }

  return (
  <div className="flex flex-col md:flex-row w-full px-1 gap-4">
    {/* Filter sekcija - levo na desktopu */}
    <div className="w-full md:w-1/4">
      <ArtikalFilter onFilterChange={onFilterChange} />
    </div>

    {/* Artikli - desno na desktopu */}
    <div className="w-full md:w-3/4">
      {artikli.length === 0 ? (
        <p className="text-center py-5 text-gray-500">Nema artikala za prikaz.</p>
      ) : (
        <>
          <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 align-middle">
            {prikazaniArtikli.map((artikal) => (
              <ArticleCard
                key={artikal.idArtikla}
                naziv={artikal.naziv}
                idArtikla={artikal.idArtikla}
                barkod={artikal.barkod}
                kategorijaId={artikal.kategorijaId}
                jm={artikal.jm}
                artikalAtributi={artikal.artikalAtributi}
                artikalCene={artikal.artikalCene}
              />
            ))}
          </div>

          {/* Paginacija */}
          <Paginacija className="my-[20px]">
            <PaginacijaSadrzaj>
              {/* ... ostatak paginacije ostaje isti ... */}
            </PaginacijaSadrzaj>
          </Paginacija>
        </>
      )}
    </div>
  </div>
)
}

export default ListaArtikala
