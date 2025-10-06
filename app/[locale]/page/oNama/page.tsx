'use client';

import { useTranslations } from "next-intl";

const ONama = () => {

      const t = useTranslations('oNama');
    
    return (
        <div className="max-w-4xl mx-auto px-4 py-6 text-gray-800">
            <h1 className="text-3xl font-bold mb-2 text-center">{t('oNama-GlavniNaslov')}</h1>

            <p className="mb-4">
                {t('oNama-PreduzeceString')} <strong>{t('oNama-DabelIme')}</strong> {t('oNama-Info1')}
            </p>

            <p className="mb-4">
                {t('oNama-Info2')}
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">{t('oNama-KljucniTrenuciNaslov')}</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
                <li>
                    <strong>{t('oNama-Godina2005')}</strong>{t('oNama-KljucniJedan')}
                </li>
                <li>
                    <strong>{t('oNama-Godina2018')}</strong> {t('oNama-KljucniDva')}
                </li>
                <li>
                    <strong>{t('oNama-Godina2020')}</strong> {t('oNama-KljucniTri')}
                </li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">{t('oNama-NaseVrednostiNaslov')}</h2>
            <p className="mb-4">
                {t('oNama-NaseVrednostiJedan')}
            </p>

            <p className="mb-4">
                {t('oNama-NaseVrednostiOdString')} <strong>{t('oNama-Godina2020')}</strong> {t('oNama-NaseVrednostiDva')}
            </p>

            <p className="mb-4">
                {t('oNama-NaseVrednostiOdString')} <strong>{t('oNama-Godina2023')}</strong> {t('oNama-NaseVrednostiTri_Jedan')} <a href="https://www.dabel.rs" className="text-blue-600 underline hover:text-blue-800" target="_blank">{t('oNama-DabelLink')}</a>, 
                {t('oNama-NaseVrednostiTri_Dva')}
            </p>

            <p className="mb-4">
                {t('oNama-NaseVrednostiCetiri')} <strong>{t('oNama-NaseVrednostiEpiteti')}</strong>.
            </p>

            <p className="mb-4">
                {t('oNama-NaseVrednostiPet')}
            </p>
        </div>
    );
};

export default ONama;
