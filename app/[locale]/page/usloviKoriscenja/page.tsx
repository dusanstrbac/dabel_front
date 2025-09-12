'use client';

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

const UsloviKoriscenja = () => {

    const [WEBKontaktEmail, setWEBKontaktEmail] = useState<string>('N/A');
    const [AdresaZaPrijemPoste, setAdresaZaPrijemPoste] = useState<string>('N/A');

    const t = useTranslations('usloviKoriscenja');

    
    useEffect(() => {
        const parametriString = localStorage.getItem('webparametri');
        if (parametriString) {
            try {
                const parami = JSON.parse(parametriString);
                const email = parami.find((p: any) => p.naziv === 'WebKontaktEmail')?.vrednost;
                const adresa = parami.find((p: any) => p.naziv === 'AdresaZaPrijemPoste')?.vrednost;
                if (email) {
                    setWEBKontaktEmail(email);
                }
                if (adresa) {
                    setAdresaZaPrijemPoste(adresa);
                }
            } catch (err) {
                console.error("Greška pri parsiranju localStorage parametara:", err);
            }
        }
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 text-gray-800">
            <h1 className="text-3xl font-bold mb-6 text-center">{t('usloviKoriscenja-String')}</h1>

            <p className="mb-4">
                {t('usloviKoriscenja-KompanijaString')} <strong>{t('usloviKoriscenja-firmaDoo')}</strong> {t('usloviKoriscenja-Jedan')} <a href="https://www.dabel.rs" className="text-blue-600 underline hover:text-blue-800" target="_blank">{t('usloviKoriscenja-DabelLink')}</a>.
            </p>
            <p className="mb-4">
                {t('usloviKoriscenja-Dva')}
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-3">{t('usloviKoriscenja-PodaciOKompanijiNaslov')}</h2>

            <Image src="/Dabel-logo-2.png" alt="Dabel logo" width={150} height={150} className="mb-[15px]"/>
            <span className="font-semibold">{t('usloviKoriscenja-firmaDoo')} – {t('usloviKoriscenja-firmaDesk')}</span>

            <ul className="list-none space-y-1 mb-6">
                <li><strong>{t('usloviKoriscenja-AdresaString')}</strong> {AdresaZaPrijemPoste}</li>
                <li><strong>{t('usloviKoriscenja-EmailString')}</strong> {WEBKontaktEmail}</li>
                <li><strong>{t('usloviKoriscenja-WebString')}</strong> {t('usloviKoriscenja-DabelLink')}</li>
                <li><strong>{t('usloviKoriscenja-MaticniBrojString')}</strong> 17141724</li>
                <li><strong>{t('usloviKoriscenja-PIBString')}</strong> 100267585</li>
                <li><strong>{t('usloviKoriscenja-SifraDelatnostiString')}</strong> 4690 – {t('usloviKoriscenja-SifraDelatnosti')}</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-3">{t('usloviKoriscenja-OpsteOdredbeNaslov')}</h2>
            <p className="mb-4">

                {t('usloviKoriscenja-SajtString')} <strong>{t('usloviKoriscenja-DabelLink')}</strong> {t('usloviKoriscenja-Tri')}
            </p>
            <p className="mb-4">
                {t('usloviKoriscenja-Cetiri')}
            </p>
            <p className="mb-4">
                {t('usloviKoriscenja-Pet')}
            </p>
            <p className="mb-4">
                {t('usloviKoriscenja-Sest')}
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-3">{t('usloviKoriscenja-LicniPodaciNaslov')}</h2>
            <p className="mb-4">
                {t('usloviKoriscenja-Sedam')}
            </p>
            <p className="mb-4">
                {t('usloviKoriscenja-Osam')}
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-3">{t('usloviKoriscenja-VezeNaslov')}</h2>
            <p className="mb-4">
                {t('usloviKoriscenja-Devet')}
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-3">{t('usloviKoriscenja-ZaposljavanjeNaslov')}</h2>
            <p className="mb-4">
                {t('usloviKoriscenja-Deset')}
                
            </p>
            <p className="mb-4">    
                {t('usloviKoriscenja-Jedanest_Jedan')} <a href="mailto:zeljka.jankovic@dabel.rs" className="text-blue-600 underline">zeljka.jankovic@dabel.rs</a>, {t('usloviKoriscenja-Jedanest_Dva')}
            </p>
        </div>
    );
};

export default UsloviKoriscenja;
