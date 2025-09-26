'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AddToCartButton from "./AddToCartButton";
import { dajKorisnikaIzTokena } from "@/lib/auth";
import { useTranslations } from "next-intl";

type ArtikalIstorijaDTO = {
  idPartnera: string;
  idArtikla: string;
  datumPoslednjeKupovine: string;
  kolicina: number;
  naziv: string;
  preostalaKolicina: string;
};

const Najprodavanije = () => {
  const [artikli, setArtikli] = useState<ArtikalIstorijaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Record<string, { kolicina: number }> | null>(null);
  const router = useRouter();
  const korisnik = dajKorisnikaIzTokena();
  const t = useTranslations();

  useEffect(() => {
    const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
    fetch(`${apiAddress}/api/Artikal/DajNajprodavanije?idPartnera=${korisnik?.partner}&idKorisnika=${korisnik?.idKorisnika}`)
      .then((res) => {
        if (!res.ok) throw new Error("Greška prilikom učitavanja");
        return res.json();
      })
      .then((data) => setArtikli(data))
      .catch((err) => console.error("Greška:", err))
      .finally(() => setLoading(false));
  }, []);

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
    <section className="w-full bg-muted pb-[20px]">
        <div className="px-6">
            <h2 className="text-3xl font-bold mb-6">{t('main.Najprodavanije')}</h2>

            {loading ? (
            <p className="text-gray-500">{t('main.Učitavanje')}</p>
            ) : artikli.length === 0 ? (
            <p className="text-gray-500">Nema prethodnih porudžbina.</p>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {artikli.slice(0, 10).map((artikal) => {
                const preostaloUKorpi = cart?.[artikal.idArtikla]?.kolicina ?? 0;
                const ukupnoPreostalo = Number(artikal.preostalaKolicina);
                const mozeJos = Math.max(ukupnoPreostalo - preostaloUKorpi, 0);
                const disabled = mozeJos <= 0;

                return (
                    <div
                    key={artikal.idArtikla}
                    className="bg-white rounded-2xl shadow p-4 flex flex-col min-h-[400px]"
                    >
                    <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden">
                        <Image
                        src={`/images/s${artikal.idArtikla}.jpg`}
                        alt={artikal.naziv}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain"
                        />
                    </div>

                    <div
                        className="flex flex-col flex-grow justify-end mb-4 cursor-pointer hover:opacity-60"
                        onClick={() => router.push(`/proizvodi/${artikal.idArtikla}`)}
                    >
                        <h3 className="text-lg font-semibold">{artikal.naziv}</h3>
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
                );
                })}
            </div>
            )}
        </div>
    </section>

  );
};

export default Najprodavanije;
