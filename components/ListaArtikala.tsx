'use client'

import { useState, useEffect, useMemo } from "react"
import ArticleCard from "./ArticleCard"
import ArtikalFilter from "./ArtikalFilter"
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
import { ArtikalFilterProp, ListaArtikalaProps } from "@/types/artikal"

const ListaArtikala = ({ artikli = [] }: ListaArtikalaProps) => {
  const [trenutnaStrana, setTrenutnaStrana] = useState(1)
  const artikliPoStrani = 8
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filteri, setFilteri] = useState<ArtikalFilterProp>({
    naziv: '',
    jedinicaMere: '',
    Materijal: [],
    Model: [],
    Pakovanje: [],
    RobnaMarka: [],
    Upotreba: [],
    Boja: [],
  })

  // Sinhronizuj trenutnu stranu sa query parametrom
  useEffect(() => {
    const page = searchParams.get('page')
    if (page) {
      const pageNumber = parseInt(page, 10)
      if (!isNaN(pageNumber) && pageNumber >= 1) {
        setTrenutnaStrana(pageNumber)
      }
    }
  }, [searchParams])

  const filtriraniArtikli = useMemo(() => {
    return artikli.filter((artikal) => {
      // Filtriraj po jedinici mere
      if (filteri.jedinicaMere && artikal.jm !== filteri.jedinicaMere) return false

      // Atributi
      const atributi = artikal.artikalAtributi || []

      const proveriAtribut = (ime: keyof ArtikalFilterProp) => {
        const vrednosti = filteri[ime] as string[]
        if (!vrednosti || vrednosti.length === 0) return true

        const atribut = atributi.find(a =>
          a.imeAtributa.toLowerCase().includes(String(ime).toLowerCase())
        )
        return atribut && vrednosti.includes(atribut.vrednost)
      }

      const atributKljucevi: (keyof ArtikalFilterProp)[] = [
        'Materijal', 'Model', 'Pakovanje', 'RobnaMarka', 'Upotreba', 'Boja'
      ]

      return atributKljucevi.every(proveriAtribut)
    })
  }, [artikli, filteri])

  const brojStranica = useMemo(() =>
    Math.ceil(filtriraniArtikli.length / artikliPoStrani), [filtriraniArtikli])

  const prikazaniArtikli = useMemo(() => {
    return filtriraniArtikli.slice(
      (trenutnaStrana - 1) * artikliPoStrani,
      trenutnaStrana * artikliPoStrani
    )
  }, [trenutnaStrana, filtriraniArtikli])

  const idiNaStranu = (broj: number) => {
    if (broj < 1 || broj > brojStranica || broj === trenutnaStrana) return
    setTrenutnaStrana(broj)

    const url = new URL(window.location.href)
    url.searchParams.set('page', broj.toString())
    router.push(`${url.pathname}${url.search}`, { scroll: false })
  }

  const onFilterChange = (noviFilteri: ArtikalFilterProp) => {
    setFilteri(noviFilteri)
    setTrenutnaStrana(1) // Resetuj na prvu stranu pri svakom filteru
  }

  return (
    <div className="flex flex-col md:flex-row w-full px-1 gap-4">
      {/* Filter sekcija */}
      <div className="w-full md:w-1/4">
        <ArtikalFilter artikli={artikli} onFilterChange={onFilterChange} />
      </div>

      {/* Lista artikala */}
      <div className="w-full md:w-3/4">
        {filtriraniArtikli.length === 0 ? (
          <p className="text-center py-5 text-gray-500">Nema artikala koji odgovaraju filterima.</p>
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
            {brojStranica > 1 && (
              <Paginacija className="my-[20px]">
                <PaginacijaSadrzaj>
                  <PaginacijaStavka>
                    <PaginacijaPrethodna
                      onClick={() => idiNaStranu(trenutnaStrana - 1)}
                      disabled={trenutnaStrana === 1}
                    />
                  </PaginacijaStavka>

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
                            isActive={trenutnaStrana === broj}
                            onClick={() => idiNaStranu(broj)}
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

                  <PaginacijaStavka>
                    <PaginacijaSledeca
                      onClick={() => idiNaStranu(trenutnaStrana + 1)}
                      disabled={trenutnaStrana === brojStranica}
                    />
                  </PaginacijaStavka>
                </PaginacijaSadrzaj>
              </Paginacija>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ListaArtikala
