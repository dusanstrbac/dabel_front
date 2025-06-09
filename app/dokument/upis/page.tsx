'use client';

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { dajKorisnikaIzTokena } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import KreirajNarudzbenicu from "@/components/ui/KreirajNarudzbenicu";


const DokumentUpis = () => {
    const [artikli, setArtikli] = useState<any[]>([]);
    const [isClient, setIsClient] = useState(false);
    const [partner, setPartner] = useState<any>(null);

    const [mestoIsporuke, setMestoIsporuke] = useState("");
    const [grad, setGrad] = useState("");
    const [telefon, setTelefon] = useState("");
    const [email, setEmail] = useState("");


    

    useEffect(() => {
        setIsClient(true);
        const cart = JSON.parse(localStorage.getItem("cart") || "{}");
        const storedIds = Object.keys(cart);
        if (storedIds.length === 0) return;

        const queryString = storedIds.map(id => `ids=${id}`).join("&");
        const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
        const url = `${apiAddress}/api/Artikal/DajArtikalId?${queryString}`;


        const fetchArtikli = async () => {
            try {
            const response = await fetch(url);
            const data = await response.json();

            const transformed = data.map((artikal: any) => ({
            ...artikal,
            id: artikal.idArtikla,
            cena: artikal.artikalCene?.[0]?.cena ?? 0,
            pakovanje: Number(artikal.pakovanje) || 1,
            kolicina: cart[artikal.idArtikla]?.kolicina ?? artikal.pakovanje,
            }));

            setArtikli(transformed);
            } catch (err) {
                console.error("Greška pri učitavanju artikala:", err);
            }
        };

        const fetchPartner = async () => {
            const korisnik = dajKorisnikaIzTokena();
            if (!korisnik) {
                console.warn("Nema korisnika iz tokena.");
                return;
            }

            const email = korisnik.email;

            try {
                const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
                const res = await fetch(`${apiAddress}/api/Partner/DajPartnere`);
                const data = await res.json();

                const nadjeni = data.find((p: any) => p.email?.toLowerCase() === korisnik.email?.toLowerCase());
                console.log("Stigli partneri:", data);
                
                if (nadjeni) {
                    setPartner(nadjeni);
                } else {
                    console.warn("Nije pronađen partner za korisnikov email:", korisnik.email);
                }

            } catch (err) {
                console.error("Greška pri fetchovanju partnera:", err);
            }
        };

        fetchArtikli();
        fetchPartner();
    }, []);

  if (!isClient) return null;

  return (
    <div className="flex flex-col gap-5 p-4">
        <div className="flex gap-5">
            {/* TELO */}
            <div className="flex flex-col w-1/2 gap-4">
                {artikli.length === 0 ? (
                    <p className="italic">Nema artikala u korpi.</p>
                ) : (
                    artikli.map((artikal) => (
                        <div
                            key={artikal.id}
                            className="w-full flex items-center gap-4 border p-3 rounded shadow-sm"
                        >
                            <img
                                src="/artikal.jpg"
                                alt={artikal.naziv}
                                className="w-16 h-16 object-cover"
                            />
                            <div>
                                <p className="font-semibold">{artikal.naziv}</p>
                                <p>Šifra: {artikal.id}</p>
                                <p>Količina: {artikal.kolicina}</p>
                                <p>Cena: {artikal.cena} RSD</p>
                                <p>Pakovanje: {artikal.pakovanje}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* GLAVA */}
            <div className="mb-4 w-1/2 space-y-1">

                {/* Partner podaci */}
                <div className="flex flex-col w-full mt-4 gap-1">
                    <p><strong>Partner ID:</strong> {partner?.idPartnera ?? "Učitavanje..."}</p>
                    <p><strong>Naziv:</strong> {partner?.ime ?? "Učitavanje..."}</p>
                    <p><strong>PIB:</strong> {partner?.pib ?? "Učitavanje..."}</p>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <p className="font-bold whitespace-nowrap">Mesto isporuke:</p>
                            <Input
                                type="text"
                                value={mestoIsporuke}
                                onChange={(e) => setMestoIsporuke(e.target.value)}
                                className="border p-1 rounded ml-2 max-w-[500px]"
                                placeholder="Unesite mesto"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="font-bold whitespace-nowrap">Grad:</p>
                            <Input
                                type="text"
                                value={grad}
                                onChange={(e) => setGrad(e.target.value)}
                                className="border p-1 rounded ml-2 max-w-[500px] "
                                placeholder="Unesite mesto"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="font-bold whitespace-nowrap">Telefon:</p>
                            <Input
                                type="text"
                                value={telefon}
                                onChange={(e) => setTelefon(e.target.value)}
                                className="border p-1 rounded ml-2 max-w-[500px]"
                                placeholder="Unesite mesto"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="font-bold whitespace-nowrap">E-mail:</p>
                            <Input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border p-1 rounded ml-2 max-w-[500px]"
                                placeholder="Unesite mesto"
                            />
                        </div>
                    </div>
                    
                    {/* <p><strong>Adresa:</strong> {partner?.adresa ?? "Učitavanje..."}</p> */}
                    {/* <p><strong>Grad:</strong> {partner?.grad ?? "Učitavanje..."}</p> */}
                    {/* <p><strong>Telefon:</strong> {partner?.telefon ?? "Učitavanje..."}</p> */}
                    {/* <p><strong>Email:</strong> {partner?.email ?? "Učitavanje..."}</p> */}
                </div>


                {/* api/Partner/DajPartnere ide po mailu */}
            </div>
        </div>

        

        {/* NARUCI DUGME */}
        <div className="pt-5 flex justify-end">
        {/* Ovdje kasnije dodajemo dugme za upis dokumenta */}
            <KreirajNarudzbenicu
                artikli={artikli}
                partner={partner}
                mestoIsporuke={mestoIsporuke}
                grad={grad}
                telefon={telefon}
                email={email}
            />
            {/* posle cemo da obrisemo vse iz lokalne memorije */}
        </div>
    </div>
  );
};

export default DokumentUpis;