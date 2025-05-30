"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PreporuceniProizvodi from "@/components/PreporuceniProizvodi";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getCookie } from "cookies-next";
import DodajUOmiljeno from "@/components/DodajUOmiljeno";
import ClientLightbox from "./ui/ClientLightbox";

type ProizvodType = {
  id: string;
  naziv: string;
  barKod: string;
  jedinicaMere: string;
  cena: number;
  slika: string;
  opis: string;
  detalji: string;
};

type AtributType = {
  atribut: string;
  vrednost: string;
};

const prikazaniAtributi = [
  "Model",
  "Robna marka",
  "Materijal",
  "Boja",
  "Pakovanje",
  "Upotreba",
];

export default function Proizvod() {
  const { id } = useParams();
  const [proizvod, setProizvod] = useState<ProizvodType | null>(null);
  const [atributi, setAtributi] = useState<AtributType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const productId = Array.isArray(id) ? id[0] : id;
    if (!productId) return;

    const fetchData = async () => {
      try {
        const e = getCookie("Email");
        if (typeof e === "string") setEmail(e);

        const res = await fetch(
          `http://localhost:7235/api/Artikal/ArtikalId?ids=${productId}`
        );
        if (!res.ok) throw new Error("Greška prilikom učitavanja proizvoda");

        const data = await res.json();
        const osnovni = data[0];

        setProizvod({
          id: osnovni.id,
          naziv: osnovni.naziv,
          barKod: osnovni.barkod,
          jedinicaMere: osnovni.jm,
          cena: osnovni.cena,
          slika: osnovni.slika,
          opis: osnovni.opis,
          detalji: osnovni.detalji,
        });

        const filtered = data
          .filter((item: AtributType) => prikazaniAtributi.includes(item.atribut))
          .map((item: AtributType) => ({
            atribut: item.atribut,
            vrednost: item.vrednost,
          }));

        setAtributi(filtered);
      } catch {
        setError("Došlo je do greške prilikom učitavanja proizvoda");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="px-4 md:px-10 lg:px-[40px] py-6">Učitavanje...</div>
    );
  if (error)
    return <div className="px-4 md:px-10 lg:px-[40px] py-6">{error}</div>;
  if (!proizvod)
    return (
      <div className="px-4 md:px-10 lg:px-[40px] py-6">Proizvod nije pronađen</div>
    );

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsOpen(true);
  };

  const images = [
    { src: proizvod.slika || "/artikal.jpg", alt: "Slika proizvoda" },
    { src: "/artikal.jpg", alt: "Slika 2" },
  ];

  return (
    <main className="px-4 md:px-10 lg:px-[40px] py-6">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between gap-8">
        <div className="flex flex-col lg:flex-row gap-6 w-full lg:w-2/3">
          <div className="flex flex-col gap-4 items-center lg:items-start">
            <div onClick={() => openLightbox(0)}>
              <Image
                src={proizvod.slika || "/artikal.jpg"}
                width={300}
                height={300}
                alt="Proizvod"
                className="border border-gray-400 rounded-lg object-contain w-full max-w-[400px] mx-auto cursor-pointer"
                priority
              />
            </div>

            <div className="flex gap-2 justify-start">
              {images.map((img, i) => (
                <div key={i} onClick={() => openLightbox(i)}>
                  <Image
                    src={img.src}
                    width={80}
                    height={80}
                    alt={img.alt}
                    className="border border-gray-400 rounded-lg object-contain cursor-pointer"
                    priority
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <h1 className="text-xl md:text-2xl font-bold">{proizvod.naziv}</h1>
            <span className="text-red-500 text-lg md:text-xl font-bold">
              {proizvod.cena} RSD
            </span>
            <ul className="text-sm md:text-base space-y-1">
              <li>
                <span className="font-semibold">Šifra proizvoda:</span>{" "}
                {proizvod.id}
              </li>
              <li>
                <span className="font-semibold">Barkod:</span> {proizvod.barKod}
              </li>
              <li>
                <span className="font-semibold">Jedinica mere:</span>{" "}
                {proizvod.jedinicaMere}
              </li>
              {atributi.map((attr) => (
                <li key={attr.atribut}>
                  <span className="font-semibold">{attr.atribut}:</span>{" "}
                  {attr.vrednost}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full lg:w-1/3 items-start justify-end lg:items-end">
          {email && <DodajUOmiljeno idArtikla={proizvod.id} />}
          <div className="flex gap-2 w-full sm:w-auto flex-wrap">
            <input
              className="w-16 border rounded px-2 py-1 text-center"
              type="number"
              min={0}
              max={50}
              defaultValue={1}
            />
            <Button className="w-full sm:w-auto px-6 py-2">Dodaj u korpu</Button>
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
