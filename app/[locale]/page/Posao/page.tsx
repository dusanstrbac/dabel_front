'use client';

import { useTranslations } from "next-intl";

const Posao = () => {

  const t = useTranslations('posao')

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('posao-Naslov')}</h1>

      <section className="mb-8 bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">
          {t('posao-PosaoTitl')}
        </h2>
      </section>

      <section className="bg-white p-6 rounded shadow-md">
        <p className="mb-4 text-lg leading-relaxed">
          {t('posao-Jedan')}
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          {t('posao-Dva')}
        </p>
        <p className="text-blue-600 font-semibold mb-6 text-lg">
          <a href="mailto:branka.makivic@dabel.rs" className="underline">
            branka.makivic@dabel.rs
          </a>
        </p>
        <p className="text-lg font-medium text-center">
          {t('posao-Tri')}
        </p>
      </section>
    </div>
  );
};

export default Posao;
