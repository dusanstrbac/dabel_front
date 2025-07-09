"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import PreporuceniProizvodi from "@/components/PreporuceniProizvodi";
import DodajUOmiljeno from "@/components/DodajUOmiljeno";
import AddToCartButton from "./AddToCartButton";
import ClientLightbox from "./ui/ClientLightbox";
import { dajKorisnikaIzTokena } from "@/lib/auth";
import { ArtikalAtribut, ArtikalType } from "@/types/artikal";
import { CircleAlert } from "lucide-react";
import { toast } from "sonner";


// Dinamički uvoz Lightbox-a
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
});

const prikazaniAtributi = [
  "Model",
  "Robna marka",
  "Materijal",
  "Boja",
  "Pakovanje",
  "Upotreba",
  "Dimenzija",
];

export default function Proizvod() {
  const { id } = useParams();
  const [proizvod, setProizvod] = useState<ArtikalType | null>(null);
  const [atributi, setAtributi] = useState<ArtikalAtribut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [preostalo, setPreostalo] = useState<number>(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [lajkovano, setLajkovano] = useState(false);

  const korisnik = dajKorisnikaIzTokena();

  useEffect(() => {
    const productId = Array.isArray(id) ? id[0] : id;
    if (!productId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
        const res = await fetch(`${apiAddress}/api/Artikal/DajArtikalPoId?ids=${productId}`);

        if (!res.ok) throw new Error("Greška prilikom učitavanja proizvoda");

        const data = await res.json();
        if (!data || data.length === 0) throw new Error("Proizvod nije pronađen");

        const osnovni: ArtikalType = data[0];
        setProizvod(osnovni);

        if (osnovni?.artikalAtributi) {
          const filtriraniAtributi = osnovni.artikalAtributi.filter(attr =>
            prikazaniAtributi.includes(attr.imeAtributa)
          );
          setAtributi(filtriraniAtributi);
        }

        setLajkovano(osnovni?.status === "1");
      } catch (e) {
        setError((e as Error).message || "Došlo je do greške prilikom učitavanja proizvoda");
        setProizvod(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!proizvod) return;

    const lokalnaKorpa = localStorage.getItem("korpa");
    const korpa = lokalnaKorpa ? JSON.parse(lokalnaKorpa) : [];

    const stavka = korpa.find((item: { id: number }) => item.id === Number(proizvod.idArtikla));
    const vecUKorpi = stavka ? stavka.kolicina : 0;

    const dozvoljeno = Math.max(Number(proizvod.kolicina) - vecUKorpi, 0);
    setPreostalo(dozvoljeno);
  }, [proizvod]);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsOpen(true);
  };

  const images = [
    { src: `/images/s${proizvod?.idArtikla}.jpg`, alt: "Glavna slika" },
    { src: `/images/t${proizvod?.idArtikla}.jpg`, alt: "Slika proizvoda" },
    { src: `/images/k${proizvod?.idArtikla}.jpg`, alt: "Upotreba" },
  ];



  const cena =
    proizvod?.artikalCene && proizvod.artikalCene.length > 0
      ? proizvod.artikalCene[0].cena
      : 0;

  const akcijskaCena =
    proizvod?.artikalCene &&
    proizvod.artikalCene.length > 0 &&
    proizvod.artikalCene[0].akcija?.cena !== 0
      ? Number(proizvod.artikalCene[0].akcija.cena)
      : undefined;

  // Loader i error handling
  if (loading) return <div className="px-4 md:px-10 lg:px-[40px] py-6">Učitavanje...</div>;
  if (error) return <div className="px-4 md:px-10 lg:px-[40px] py-6 text-red-600">{error}</div>;
  if (!proizvod) return <div className="px-4 md:px-10 lg:px-[40px] py-6">Proizvod nije pronađen</div>;

  return (
    <main className="px-4 md:px-10 lg:px-[40px] py-6">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between gap-8">
        {/* Slike i osnovni podaci */}
        <div className="flex flex-col lg:flex-row gap-6 w-full lg:w-2/3">
          <div className="flex flex-col gap-4 items-center lg:items-start">
            <div onClick={() => openLightbox(0)} className="cursor-pointer">
              <img
                src={images[0].src}
                width={300}
                height={300}
                alt={images[0].alt}
                className="border border-gray-400 rounded-lg object-contain w-full max-w-[400px] mx-auto"
              />
            </div>

            <div className="flex gap-2 justify-start mt-2">
              {images.map((img, i) => (
                <div key={i} onClick={() => openLightbox(i)} className="cursor-pointer">
                  <img
                    src={img.src}
                    width={80}
                    height={80}
                    alt={img.alt}
                    className="border border-gray-400 rounded-lg object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <h1 className="text-xl md:text-2xl font-bold">{proizvod.naziv}</h1>
            <span className="text-red-500 text-lg md:text-xl font-bold">
              {Number(proizvod.kolicina) > 0 ? (
                akcijskaCena ? (
                  <>
                    <span className="line-through text-gray-400">{cena} RSD</span>
                    <span className="pl-[5px]">{akcijskaCena} RSD</span>
                  </>
                ) : (
                  `${cena} RSD`
                )
              ) : (
                <span className="text-red-500">Nije dostupno</span>
              )}
            </span>
            {Number(proizvod.kolicina) == 0 && (
              <span className="text-red-500">Proizvod ponovo dostupan od: 12.06.2025</span>
            )}
            <ul className="text-sm md:text-base space-y-1">
              <li>
                <span className="font-semibold">Šifra proizvoda:</span> {proizvod.idArtikla}
              </li>
              <li>
                <span className="font-semibold">Barkod:</span> {proizvod.barkod}
              </li>
              <li>
                <span className="font-semibold">Jedinica mere:</span> {proizvod.jm}
              </li>
            </ul>
            <ul className="text-sm md:text-base space-y-1 mt-2">
              {atributi.length > 0 ? (
                atributi.map(attr => (
                  <li key={attr.imeAtributa}>
                    <span className="font-semibold">{attr.imeAtributa}:</span> {attr.vrednost || "-"}
                  </li>
                ))
              ) : (
                <li>Nema dodatnih atributa</li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full lg:w-1/3 items-start justify-end lg:items-end">
          {korisnik?.idKorisnika && (
            <DodajUOmiljeno
              inicijalniStatus={proizvod.status === "1"}
              idArtikla={proizvod.idArtikla}
              idPartnera={korisnik.idKorisnika}
            />
          )}
          <p className="text-sm text-gray-600">Datum poslednje kupovine: 19.06.2025.</p>
          <div className="flex gap-2 w-full sm:w-auto flex-wrap">
            <div className="flex items-center gap-1">
              {Number(proizvod.kolicina) <= 10 && (
                <div className="relative">
                  <div className="group cursor-pointer">
                    <CircleAlert width={18} height={18} color="red" />
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-white text-red-500 border border-red-300 text-sm px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap pointer-events-none">
                      Preostala količina artikla: {proizvod.kolicina}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {Number(proizvod.kolicina) > 0 ? (
              <input
                ref={inputRef}
                name="inputProizvod"
                className="w-16 border rounded px-2 py-1 text-center"
                type="number"
                min={preostalo > 0 ? 1 : 0}
                max={preostalo}
                defaultValue={preostalo > 0 ? 1 : 0}
                disabled={preostalo === 0}
                onChange={(e) => {
                  const input = e.currentTarget;
                  const vrednost = Number(input.value);
                  if (vrednost > preostalo) {
                    input.value = preostalo.toString();
                  }
                }}
              />
            ) : (
              <input
                ref={inputRef}
                name="inputProizvod"
                className="w-16 border rounded px-2 py-1 text-center"
                type="number"
                min={0}
                max={0}
                defaultValue={0}
              />
            )}
            <AddToCartButton
              id={proizvod.idArtikla}
              className="w-full sm:w-auto px-6 py-2"
              title="Dodaj u korpu"
              getKolicina={() => Number(inputRef.current?.value || 1)}
              nazivArtikla={proizvod.naziv}
              disabled={Number(proizvod.kolicina) <= 0 || preostalo === 0}
              ukupnaKolicina={preostalo}
              onPreAdd={() => {
                const uneta = Number(inputRef.current?.value || 1);
                if (uneta > preostalo) {
                  toast.error("Nema dovoljno artikala na stanju!", {
                    description: `Maksimalno možete dodati ${preostalo} kom.`,
                  });
                  return false;
                }
                return true;
              }}
            />
          </div>
        </div>
      </div>

      {/* Preporučeni proizvodi */}
      <div className="mt-[50px]">
        <PreporuceniProizvodi />
      </div>

      {/* Lightbox za slike */}
      {isOpen && (
        <ClientLightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          index={currentImageIndex}
          slides={images}
        />
      )}
    </main>
  );
}
