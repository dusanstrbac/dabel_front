'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import ArtikalFilter from '@/components/ArtikalFilter'
import ListaArtikala from '@/components/ListaArtikala'
import { ArtikalFilterProp, ArtikalType } from '@/types/artikal'

export default function KategorijaPage() {
  const { slug } = useParams()
  const [artikli, setArtikli] = useState<ArtikalType[]>([])
  const [filteri, setFilteri] = useState<ArtikalFilterProp | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchArtikli = async (kategorijaId: string, filteri?: ArtikalFilterProp) => {
    setLoading(true)

    const queryParams = new URLSearchParams()
    queryParams.append('kategorija', kategorijaId)

    if (filteri?.cena) {
        // Provera da li je tuple validan
        const [cenaOd, cenaDo] = filteri.cena
        if (cenaOd !== undefined && cenaOd !== null) queryParams.append('cenaOd', cenaOd.toString())
        if (cenaDo !== undefined && cenaDo !== null) queryParams.append('cenaDo', cenaDo.toString())
    }
    if (filteri?.naziv) queryParams.append('naziv', filteri.naziv)
    if (filteri?.jedinicaMere) queryParams.append('jedinicaMere', filteri.jedinicaMere)

    const res = await fetch(`http://localhost:5000/api/DajArtikle?${queryParams.toString()}`)
    const data = await res.json()
    setArtikli(data)
    setLoading(false)
  }

  useEffect(() => {
    if (slug) {
      fetchArtikli(slug as string)
    }
  }, [slug])

  const handleFilterChange = (filters: ArtikalFilterProp) => {
    setFilteri(filters)
    if (slug) {
      fetchArtikli(slug as string, filters)
    }
  }

  return (
    <div className="flex flex-row gap-6 px-6 py-4">
      {/* Leva strana - filter */}
      <div className="w-1/4">
        <ArtikalFilter onFilterChange={handleFilterChange} />
      </div>

      {/* Desna strana - artikli */}
      <div className="w-3/4">
        <h1 className="text-2xl font-semibold mb-4">Kategorija: {slug}</h1>
        {loading ? (
          <p>Učitavanje...</p>
        ) : (
          <ListaArtikala artikli={artikli} />
        )}
      </div>
    </div>
  )
}
