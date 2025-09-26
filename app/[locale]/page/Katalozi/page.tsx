'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type Katalog = {
  naziv: string;
  putanja: string;
  thumbnailPutanja?: string | null;
  datumDodavanja: string;
};

const KataloziPage = () => {
  const [katalozi, setKatalozi] = useState<Katalog[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations();

  useEffect(() => {
    const fetchKatalozi = async () => {
      try {
        const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
        const res = await fetch(`${apiAddress}/api/Web/DajSveKataloge`);
        const data = await res.json();
        setKatalozi(data);
      } catch (err) {
        console.error('Greška prilikom dohvatanja kataloga:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchKatalozi();
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-gray-600">Učitavanje kataloga...</div>;
  }

  if (katalozi.length === 0) {
    return <div className="text-center mt-20 text-red-500">{t('main.Nema dostupnih kataloga')}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('main.Naši katalozi')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {katalozi.map(({ naziv, putanja, thumbnailPutanja, datumDodavanja }, i) => (
        <a
          key={i}
          href={putanja}
          target="_blank"
          rel="noopener noreferrer"
          className="block border rounded shadow hover:shadow-lg transition bg-white"
        >
          {thumbnailPutanja ? (
            <img
              src={thumbnailPutanja}
              alt={`Thumbnail za ${naziv}`}
              className="w-full h-64 object-full rounded-t"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center bg-gray-100 text-gray-400 text-sm rounded-t">
              Nema thumbnaila
            </div>
          )}

          <div className="p-4 text-center">
            <div className="font-semibold text-lg truncate" title={naziv}>
              {naziv}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {new Date(datumDodavanja).toLocaleDateString("sr-RS", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
              })}
            </div>
          </div>
        </a>
      ))}

      </div>
    </div>
  );
};

export default KataloziPage;
