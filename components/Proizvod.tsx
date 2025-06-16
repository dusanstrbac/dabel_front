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
  const [email, setEmail] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [preostalo, setPreostalo] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const korisnik = dajKorisnikaIzTokena();
    const productId = Array.isArray(id) ? id[0] : id;
    const idKorisnika = korisnik?.idKorisnika;

    if (!productId) return;

    const fetchData = async () => {
      try {
        if (korisnik?.email) setEmail(korisnik.email);

        const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
        const res = await fetch(`${apiAddress}/api/Artikal/DajArtikalId?ids=${productId}`);



        if (!res.ok) throw new Error("Greška prilikom učitavanja proizvoda");

        const data = await res.json();
        if (!data || data.length === 0) throw new Error("Proizvod nije pronađen");
        //console.log(data);

        const osnovni: ArtikalType = data[0];
        setProizvod(osnovni);

        if (osnovni?.artikalAtributi) {

          const filtriraniAtributi = osnovni.artikalAtributi
          .filter(attr => prikazaniAtributi.includes(attr.imeAtributa))

          setAtributi(filtriraniAtributi);
        
        }
      } catch (e) {
        setError((e as Error).message || "Došlo je do greške prilikom učitavanja proizvoda");
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


  if (loading) return <div className="px-4 md:px-10 lg:px-[40px] py-6">Učitavanje...</div>;
  if (error) return <div className="px-4 md:px-10 lg:px-[40px] py-6 text-red-600">{error}</div>;
  if (!proizvod) return <div className="px-4 md:px-10 lg:px-[40px] py-6">Proizvod nije pronađen</div>;

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsOpen(true);
  };

  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_ADDRESS;

  const images = [
    { src: `${imageUrl}/s${proizvod.idArtikla}.jpg`, alt: "Glavna slika" },
    { src: `${imageUrl}/t${proizvod.idArtikla}.jpg`, alt: "Slika proizvoda" },
    { src: `${imageUrl}/k${proizvod.idArtikla}.jpg`, alt: "Upotreba" },
  ];

const cena = (proizvod.artikalCene && proizvod.artikalCene.length > 0) 
  ? proizvod.artikalCene[0].cena 
  : 0;

const akcijskaCena = (proizvod.artikalCene && proizvod.artikalCene.length > 0 && proizvod.artikalCene[0].akcija?.cena !== 0) 
  ? Number(proizvod.artikalCene[0].akcija.cena) 
  : undefined;

  return (
    <main className="px-4 md:px-10 lg:px-[40px] py-6">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between gap-8">
        <div className="flex flex-col lg:flex-row gap-6 w-full lg:w-2/3">
          <div className="flex flex-col gap-4 items-center lg:items-start">
            <div onClick={() => openLightbox(0)}>
              <img
                src={images[0].src}
                width={300}
                height={300}
                alt={images[0].alt}
                className="border border-gray-400 rounded-lg object-contain w-full max-w-[400px] mx-auto cursor-pointer"
              />
            </div>

            <div className="flex gap-2 justify-start">
              {images.map((img, i) => (
                <div key={i} onClick={() => openLightbox(i)}>
                  <img
                    src={img.src}
                    width={80}
                    height={80}
                    alt={img.alt}
                    className="border border-gray-400 rounded-lg object-contain cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
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
            {Number(proizvod.kolicina) == 0 ? (
                <span className="text-red-500">Proizvod ponovo dostupan od: 12.06.2025</span>//dodati datum kada ce proizvod biti opet na stanju
              ) : (
                <span className="text-red-500"></span>
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
              <ul className="text-sm md:text-base space-y-1">
                {atributi.map(attr => (
                  <li key={attr.imeAtributa}>
                    <span className="font-semibold">{attr.imeAtributa}:</span>{" "}
                    {attr.vrednost || "-"}
                  </li>
                ))}
              </ul>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full lg:w-1/3 items-start justify-end lg:items-end">
          {email && <DodajUOmiljeno idArtikla={proizvod.idArtikla} idPartnera={email} />}
          <div className="flex gap-2 w-full sm:w-auto flex-wrap">
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
              getKolicina={() => Math.min(Number(inputRef.current?.value || 1), preostalo)}
              nazivArtikla={proizvod.naziv}
              disabled={Number(proizvod.kolicina) <= 0 || preostalo===0}
              ukupnaKolicina={preostalo}
            />      
          </div>
        </div>
      </div>

      <div className="mt-[50px]">
        <PreporuceniProizvodi />
      </div>

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
