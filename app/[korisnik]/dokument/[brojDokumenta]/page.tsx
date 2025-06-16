'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function PrikazDokumenta() {
  const params = useParams();
  const brojDokumenta = params.brojDokumenta as string;

  const [dokument, setDokument] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!brojDokumenta) return;

    const fetchDokument = async () => {
      try {
        const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
        const res = await fetch(`${apiAddress}/api/Dokument/DajDokumentPoBroju?brojDokumenta=${brojDokumenta}`);
        console.log(brojDokumenta);

        if (!res.ok) throw new Error('Greška pri učitavanju dokumenta.');

        const data = await res.json();
        setDokument(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDokument();
  }, [brojDokumenta]);

  if (loading) return <p>Učitavanje dokumenta...</p>;
  if (error) return <p className="text-red-500">Greška: {error}</p>;
  if (!dokument) return <p>Dokument nije pronađen.</p>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Dokument #{dokument.brojDokumenta}</h1>
      <p><strong>Datum:</strong> {new Date(dokument.datumDokumenta).toLocaleDateString('sr-RS')}</p>
      <p><strong>Partner:</strong> {dokument.nazivPartnera}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Stavke:</h2>
      <ul className="space-y-2">
        {dokument.stavkeDokumenata?.map((stavka: any, idx: number) => (
          <li key={idx} className="border p-2 rounded-md bg-gray-100">
            <p><strong>Artikal:</strong> {stavka.nazivArtikla}</p>
            <p><strong>Količina:</strong> {stavka.kolicina}</p>
            <p><strong>Cena:</strong> {stavka.cena}</p>
            <p><strong>Ukupno:</strong> {stavka.ukupnaCena}</p>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-right text-xl font-bold">
        Ukupno: {dokument.stavkeDokumenata?.reduce((sum: number, s: any) => sum + s.ukupnaCena, 0).toFixed(2)}
      </div>
    </div>
  );
}
