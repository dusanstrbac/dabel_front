'use client'

import { useTranslations } from "next-intl";
import Link from "next/link";
// IZMENA 1: Uvozimo useWebParametri hook
import { useWebParametri } from "@/contexts/WebParametriContext";
import { useEffect, useState } from "react"; // Ostavljamo ih za svaki slucaj, mada nam vise ne trebaju za parametre

const Footer = () => {
    // IZMENA 2: Uklanjamo useState i useEffect za dohvat parametara.
    // Podatke dohvatamo direktno iz Contexta.
    const { getParametar } = useWebParametri(); 
    
    const WEBKontaktTelefon = getParametar('WEBKontaktTelefon') || 'N/A';
    const WebKontaktEmail = getParametar('WebKontaktEmail') || 'N/A';
    const AdresaZaPrijemPoste = getParametar('AdresaZaPrijemPoste') || 'N/A';

    const t = useTranslations('footer');

    // IZMENA 3: Uklonjen je useEffect koji je ručno čitao localStorage.

    return (
        <footer className="w-full border-t-2 mt-4 px-4 py-6 bg-white text-black">
            <div className="max-w-7xl mx-auto flex flex-wrap gap-10 justify-center md:justify-between items-start">

                <div className="w-[280px]">
                    <h1 className="text-xl font-bold underline underline-offset-4 mb-4">{t('footer-KontaktInformacije')}</h1>
                    <p className="font-bold">{t('footer-DabelDOO')}</p>
                    {/* Podaci iz Contexta */}
                    <p>{AdresaZaPrijemPoste}</p> 
                    <p><span className="font-bold">{t('footer-Email')}</span> {WebKontaktEmail}</p>
                    <p><span className="font-bold">{t('footer-MB')}</span> 17141724</p>
                    <p><span className="font-bold">{t('footer-PIB')}</span> 100267585</p>
                </div>

                <div className="w-[280px]">
                    <h1 className="text-xl font-bold underline underline-offset-4 mb-4">{t('footer-KontaktPravnaLica')}</h1>
                    {/* Podaci iz Contexta */}
                    <p><span className="font-bold">{t('footer-Telefon')}</span> {WEBKontaktTelefon}</p> 
                    <p><span className="font-bold">{t('footer-RadnoVreme')}</span> {t('footer-RadniDani')}<br />{t('footer-RadniSati')}</p>
                    {/* Podaci iz Contexta */}
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