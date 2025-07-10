'use client'

import Link from "next/link";
import { useEffect, useState } from "react";

const Footer = () => {
    const [WEBKontaktTelefon, setWEBKontaktTelefon] = useState("N/A");
    const [WebKontaktEmail, setWebKontaktEmail] = useState("N/A");

    useEffect(() => {
        const parametriIzLocalStorage = JSON.parse(localStorage.getItem('webparametri') || '[]');
        const telefon = parametriIzLocalStorage.find((param: any) => param.naziv === 'WEBKontaktTelefon')?.vrednost || 'N/A';
        const email = parametriIzLocalStorage.find((param: any) => param.naziv === 'WebKontaktEmail')?.vrednost || 'N/A';
        setWEBKontaktTelefon(telefon);
        setWebKontaktEmail(email);
    }, []);

    return (
        <footer className="w-full border-t-2 mt-4 px-4 py-6 bg-white text-black">
            <div className="max-w-7xl mx-auto flex flex-wrap gap-10 justify-center md:justify-between items-start">

                <div className="w-[280px]">
                    <h1 className="text-xl font-bold underline underline-offset-4 mb-4">Kontakt informacije</h1>
                    <p className="font-bold">Dabel d.o.o</p>
                    <p>Šesta Industrijska 12,<br />Nova Pazova, Srbija</p>
                    <p><span className="font-bold">Email:</span> {WebKontaktEmail}</p>
                    <p><span className="font-bold">MB:</span> 17141724</p>
                    <p><span className="font-bold">PIB:</span> 100267585</p>
                </div>

                <div className="w-[280px]">
                    <h1 className="text-xl font-bold underline underline-offset-4 mb-4">Kontakt za pravna lica</h1>
                    <p><span className="font-bold">Telefon:</span> {WEBKontaktTelefon}</p>
                    <p><span className="font-bold">Radno Vreme:</span> Ponedeljak - Petak<br />od 7 do 15h</p>
                    <p><span className="font-bold">Adresa za prijem pošte:</span><br />Šesta Industrijska 12,<br />22330 Nova Pazova, Srbija</p>
                </div>

                <div className="w-[280px]">
                    <h1 className="text-xl font-bold underline underline-offset-4 mb-4">Informacije</h1>
                    <div className="flex flex-col gap-2">
                        <Link href="/page/oNama" className="hover:text-gray-600 transition-colors">O nama</Link>
                        <Link href="/page/usloviKoriscenja" className="hover:text-gray-600 transition-colors">Uslovi korišćenja</Link>
                        <Link href="/page/Katalozi" className="hover:text-gray-600 transition-colors">Katalozi</Link>
                        <Link href="/page/Posao" className="hover:text-gray-600 transition-colors">Posao</Link>
                        <Link href="/page/Kontakt" className="hover:text-gray-600 transition-colors">Kontakt</Link>
                    </div>
                </div>
            </div>

            {/* Copyright section */}
            <div className="max-w-7xl mx-auto mt-6 pt-4 border-t text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Dabel d.o.o. Sva prava zadržana.
            </div>
        </footer>
    );
};

export default Footer;
