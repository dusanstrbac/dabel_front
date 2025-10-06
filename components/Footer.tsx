'use client'

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

const Footer = () => {
    const [WEBKontaktTelefon, setWEBKontaktTelefon] = useState("N/A");
    const [WebKontaktEmail, setWebKontaktEmail] = useState("N/A");
    const [AdresaZaPrijemPoste, setAdresaZaPrijemPoste] = useState("N/A");
    const t = useTranslations('footer');

    useEffect(() => {
        const parametriIzLocalStorage = JSON.parse(localStorage.getItem('webparametri') || '[]');
        const telefon = parametriIzLocalStorage.find((param: any) => param.naziv === 'WEBKontaktTelefon')?.vrednost || 'N/A';
        const email = parametriIzLocalStorage.find((param: any) => param.naziv === 'WebKontaktEmail')?.vrednost || 'N/A';
        const adresa = parametriIzLocalStorage.find((param: any) => param.naziv === 'AdresaZaPrijemPoste')?.vrednost || 'N/A';
        setWEBKontaktTelefon(telefon);
        setWebKontaktEmail(email);
        setAdresaZaPrijemPoste(adresa);
    }, []);

    return (
        <footer className="w-full border-t-2 mt-4 px-4 py-6 bg-white text-black">
            <div className="max-w-7xl mx-auto flex flex-wrap gap-10 justify-center md:justify-between items-start">

                <div className="w-[280px]">
                    <h1 className="text-xl font-bold underline underline-offset-4 mb-4">{t('footer-KontaktInformacije')}</h1>
                    <p className="font-bold">{t('footer-DabelDOO')}</p>
                    <p>{AdresaZaPrijemPoste}</p>
                    <p><span className="font-bold">{t('footer-Email')}</span> {WebKontaktEmail}</p>
                    <p><span className="font-bold">{t('footer-MB')}</span> 17141724</p>
                    <p><span className="font-bold">{t('footer-PIB')}</span> 100267585</p>
                </div>

                <div className="w-[280px]">
                    <h1 className="text-xl font-bold underline underline-offset-4 mb-4">{t('footer-KontaktPravnaLica')}</h1>
                    <p><span className="font-bold">{t('footer-Telefon')}</span> {WEBKontaktTelefon}</p>
                    <p><span className="font-bold">{t('footer-RadnoVreme')}</span> {t('footer-RadniDani')}<br />{t('footer-RadniSati')}</p>
                    <p><span className="font-bold">{t('footer-AdresaPrijemPoste')}</span><br />{AdresaZaPrijemPoste}</p>
                </div>

                <div className="w-[280px]">
                    <h1 className="text-xl font-bold underline underline-offset-4 mb-4">{t('footer-Informacije')}</h1>
                    <div className="flex flex-col gap-2">
                        <Link href="/page/oNama" className="hover:text-gray-600 transition-colors">{t('footer-oNamaLink')}</Link>
                        <Link href="/page/usloviKoriscenja" className="hover:text-gray-600 transition-colors">{t('footer-usloviKoriscenjaLink')}</Link>
                        <Link href="/page/Katalozi" className="hover:text-gray-600 transition-colors">{t('footer-KataloziLink')}</Link>
                        <Link href="/page/Posao" className="hover:text-gray-600 transition-colors">{t('footer-PosaoLink')}</Link>
                        <Link href="/page/Kontakt" className="hover:text-gray-600 transition-colors">{t('footer-KontaktLink')}</Link>
                    </div>
                </div>
            </div>

            {/* Copyright section */}
            <div className="max-w-7xl mx-auto mt-6 pt-4 border-t text-center text-sm text-gray-500">
                © {new Date().getFullYear()} {t('footer-CopyRight')}
            </div>
        </footer>
    );
};

export default Footer;
