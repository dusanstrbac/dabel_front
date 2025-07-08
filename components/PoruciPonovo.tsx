'use client';

import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import AddToCartButton from "./AddToCartButton";
import { dajKorisnikaIzTokena } from "@/lib/auth";

type ArtikalIstorijaDTO = {
  idPartnera: string;
  idArtikla: string;
  datumPoslednjeKupovine: string;
  kolicina: number;
  naziv: string;
  preostalaKolicina: string;
};

const PoruciPonovo = () => {
  const [artikli, setArtikli] = useState<ArtikalIstorijaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Record<string, { kolicina: number }> | null>(null);
  const router = useRouter();
  const korisnik = dajKorisnikaIzTokena();
  const idKorisnika = korisnik?.idKorisnika;

  useEffect(() => {
    const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
    fetch(`${apiAddress}/api/Artikal/ArtikalDatumKupovine?idPartnera=${idKorisnika}`)
      .then((res) => {
        if (!res.ok) throw new Error("Greška prilikom učitavanja");
        return res.json();
      })
      .then((data) => setArtikli(data))
      .catch((err) => console.error("Greška:", err))
      .finally(() => setLoading(false));
  }, []);

  // Učitavamo korpu iz localStorage i pratimo promene preko eventa storage
  useEffect(() => {
    const loadCart = () => {
      const existing = localStorage.getItem("cart");
      if (existing) {
        setCart(JSON.parse(existing));
      } else {
        setCart({});
      }
    };

    loadCart();
    window.addEventListener("storage", loadCart);
    return () => window.removeEventListener("storage", loadCart);
  }, []);

  return (
    <section className="w-full bg-muted py-10">
      <div className="px-6">
        <h2 className="text-3xl font-bold mb-6">Poruči ponovo</h2>

        {loading ? (
          <p className="text-gray-500">Učitavanje...</p>
        ) : artikli.length === 0 ? (
          <p className="text-gray-500">Nema prethodnih porudžbina.</p>
        ) : (
          <Carousel opts={{ align: "start", loop: false }} className="w-full">
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: [-0, -20, 0] }}
              transition={{ duration: 1.2, ease: "easeInOut", delay: 0.5 }}
            >
              <CarouselContent className="-ml-4">
                {artikli.slice(0, 8).map((artikal) => {
                  const preostaloUKorpi = cart?.[artikal.idArtikla]?.kolicina ?? 0;
                  const ukupnoPreostalo = Number(artikal.preostalaKolicina);
                  const mozeJos = Math.max(ukupnoPreostalo - preostaloUKorpi, 0);
                  const disabled = mozeJos <= 0;

                  return (
                    <CarouselItem
                        key={artikal.idArtikla}
                        className="pl-4 basis-[80%] sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
                        >
                        <div className="bg-white rounded-2xl shadow p-4 h-full flex flex-col min-h-[400px]">
                            <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden">
                            <Image
                                src={`/images/s${artikal.idArtikla}.jpg`}
                                alt={artikal.naziv}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover"
                            />
                            </div>

                            <div
                            className="flex flex-col flex-grow justify-end mb-4 cursor-pointer hover:opacity-60"
                            onClick={() => router.push(`/proizvodi/${artikal.idArtikla}`)}
                            >
                            <h3 className="text-lg font-semibold">{artikal.naziv}</h3>
                            <div className="flex justify-between text-sm text-gray-500 mt-2">
                                <p>
                                Datum:{" "}
                                {new Date(artikal.datumPoslednjeKupovine).toLocaleDateString("sr-RS")}
                                </p>
                                <p>Količina: {artikal.kolicina}</p>
                            </div>
                            </div>

                            <AddToCartButton
                            id={artikal.idArtikla}
                            className="w-full sm:w-auto px-6 py-2"
                            title="Dodaj u korpu"
                            getKolicina={() => artikal.kolicina}
                            nazivArtikla={artikal.naziv}
                            disabled={disabled}
                            ukupnaKolicina={mozeJos}
                            />
                        </div>
                        </CarouselItem>

                  );
                })}
              </CarouselContent>
            </motion.div>
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default PoruciPonovo;
