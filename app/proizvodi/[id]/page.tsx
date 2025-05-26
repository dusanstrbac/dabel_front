"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PreporuceniProizvodi from "@/components/PreporuceniProizvodi";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Image from "next/image";
import dynamic from 'next/dynamic';

// Dinamičko učitavanje React Lightbox-a
const ReactLightbox = dynamic(() => import('yet-another-react-lightbox'), { 
  ssr: false // Ne renderuj na serveru
});

import "yet-another-react-lightbox/styles.css";
import DodajUOmiljeno from "@/components/DodajUOmiljeno";
import { getCookie } from "cookies-next";

type ProizvodType = {
    id: string; // Sifra proizvoda
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

const Proizvod = () => {
    const { id } = useParams();
    const [proizvod, setProizvod] = useState<ProizvodType | null>(null);
    const [atributi, setAtributi] = useState<AtributType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isOpen, setIsOpen] = useState(false); // Lightbox stanje
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Trenutni indeks slike

    // Atributi koji ce se prikazivati iz API poziva - REDOSLED JE BITAN
    const prikazaniAtributi = [
        "Model",
        "Robna marka",
        "Materijal",
        "Boja",
        "Pakovanje",
        "Upotreba",
    ];

    const dajEmail = () => {
        getCookie("Email");
    }

    useEffect(() => {
        if (!id) return;

        const fetchProizvod = async () => {
            try {
                const response = await fetch(`https://localhost:44383/api/Artikal/ArtikalId?id=${id}`);
                if (!response.ok) {
                    throw new Error("Greška prilikom učitavanja proizvoda");
                }
                const data = await response.json();

                // Osnovni podaci o proizvodu
                const osnovniPodaci = data[0];
                const productData: ProizvodType = {
                    id: osnovniPodaci.id,
                    naziv: osnovniPodaci.naziv,
                    barKod: osnovniPodaci.barkod,
                    jedinicaMere: osnovniPodaci.jm,
                    cena: osnovniPodaci.cena,
                    slika: osnovniPodaci.slika,
                    opis: osnovniPodaci.opis,
                    detalji: osnovniPodaci.detalji
                };

                const allAttributes: AtributType[] = data.map((item: AtributType) => ({
                    atribut: item.atribut,
                    vrednost: item.vrednost
                }));

                // Filtriranje i sortiranje po prikazaniAtributi
                const filteredAttributes = prikazaniAtributi
                    .map(attrName => 
                        allAttributes.find(attr => attr.atribut === attrName)
                    )
                    .filter((attr): attr is AtributType => attr !== undefined);

                setProizvod(productData);
                setAtributi(filteredAttributes);
            } catch (err) {
                console.error("Greška pri učitavanju proizvoda:", err);
                setError("Došlo je do greške prilikom učitavanja proizvoda");
            } finally {
                setLoading(false);
            }
        };

        fetchProizvod();
    }, [id]);

    if (loading) {
        return <p>Učitavanje...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!proizvod) {
        return <p>Proizvod nije pronađen</p>;
    }

    // Funkcija koja otvara lightbox sa uvećanom slikom
    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setIsOpen(true);
    };

    // Slike proizvoda u ispravnom formatu
    const images = [
        { src: "/artikal.jpg", alt: "Slika proizvoda" },
        { src: "/artikal.jpg", alt: "Slika 2" },
    ];

    return (
        <main className="px-4 md:px-10 lg:px-[40px] py-6">
            <div className="container mx-auto flex flex-col lg:flex-row justify-between gap-8">
                {/* Leva sekcija: Slike i osnovni podaci */}
                <div className="flex flex-col lg:flex-row gap-6 w-full lg:w-2/3">
                    <div className="flex flex-col gap-4 items-center lg:items-start">
                        {/* Glavna slika proizvoda */}
                        <div onClick={() => openLightbox(0)}>
                            <Image
                                src={proizvod.slika || "/artikal.jpg"}
                                width={300}
                                height={300}
                                alt="Proizvod"
                                className="border border-gray-400 rounded-lg object-contain w-full max-w-[400px] mx-auto cursor-pointer"
                                priority={true}
                            />
                        </div>

                        {/* Mini slike proizvoda */}
                        <div className="flex gap-2 justify-start">
                            {images.map((img, index) => (
                                <div key={index} onClick={() => openLightbox(index)}>
                                    <Image
                                        src={img.src}
                                        width={80}
                                        height={80}
                                        alt={img.alt}
                                        className="border border-gray-400 rounded-lg object-contain cursor-pointer"
                                        priority={true}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detalji proizvoda sa atributima */}
                    <div className="flex flex-col gap-3 w-full">
                        <h1 className="text-xl md:text-2xl font-bold">{proizvod.naziv}</h1>
                        <span className="text-red-500 text-lg md:text-xl font-bold">{proizvod.cena} RSD</span>
                        <ul className="text-sm md:text-base space-y-1">
                            <li><span className="font-semibold">Šifra proizvoda:</span> {proizvod.id}</li>
                            <li><span className="font-semibold">Barkod:</span> {proizvod.barKod}</li>
                            <li><span className="font-semibold">Jedinica mere:</span> {proizvod.jedinicaMere}</li>
                            
                            {atributi.map((attr) => (
                                <li key={attr.atribut}>
                                    <span className="font-semibold">{attr.atribut}:</span> {attr.vrednost}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Desna sekcija: Akcije */}
                <div className="flex flex-col gap-4 w-full lg:w-1/3 items-start justify-end lg:items-end">
                    
                    <DodajUOmiljeno idArtikla={proizvod.id} idPartnera={dajEmail}/>

                    <div className="flex gap-2 w-full sm:w-auto flex-wrap">
                        <input
                            className="w-16 border rounded px-2 py-1 text-center"
                            type="number"
                            min="0"
                            max="50"
                            defaultValue="1"
                        />
                        <Button className="w-full sm:w-auto px-6 py-2">Dodaj u korpu</Button>
                    </div>
                </div>
            </div>
            <div className="mt-[50px]">
                <PreporuceniProizvodi />
            </div>

            {/* React Lightbox komponenta */}
            <ReactLightbox
                open={isOpen}
                close={() => setIsOpen(false)}
                index={currentImageIndex}
                slides={images}
            />
        </main>
    );
};

export default Proizvod;
