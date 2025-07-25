'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { dajKorisnikaIzTokena } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export default function PrikazDokumenta() {
  const params = useParams();
  const brojDokumenta = params.brojDokumenta as string;
  const router = useRouter();

  const [dokument, setDokument] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const korisnik = dajKorisnikaIzTokena();

  useEffect(() => {
    if (!brojDokumenta) return;

    const fetchDokument = async () => {
      try {
        const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
        const res = await fetch(`${apiAddress}/api/Dokument/DajDokumentPoBroju?brojDokumenta=${brojDokumenta}&idPartnera=${korisnik?.idKorisnika}`);
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

  const handleStampanje = () => {
    if (!dokument?.brojDokumenta) return;
      router.push(`/${korisnik?.korisnickoIme}/dokument/stampaj/${dokument.brojDokumenta}`)
  };

  if (loading) return <p className="text-center py-8">Učitavanje dokumenta...</p>;
  if (error) return <p className="text-red-500 text-center py-8">Greška: {error}</p>;
  if (!dokument) return <p className="text-center py-8">Dokument nije pronađen.</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-4xl w-full py-10 px-6 bg-white shadow-lg rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Dokument #{dokument.brojDokumenta}</h1>
          <Button className="cursor-pointer bg-blue-700 hover:bg-blue-500 py-5 px-8" onClick={handleStampanje}>
            Štampaj
          </Button>
        </div>

        {/* Osnovne informacije */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-500">Datum</p>
            <p className="font-semibold text-lg">{new Date(dokument.datumDokumenta).toLocaleDateString('sr-RS')}</p>
          </div>
          <div>
            <p className="text-gray-500">Partner</p>
            <p className="font-semibold text-lg">{dokument.idPartnera}</p>
          </div>
        </div>

        {/* Tabela stavki */}
        <h2 className="text-2xl font-semibold mb-4">Stavke</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4">Artikal</th>
                <th className="py-2 px-4">Količina</th>
                <th className="py-2 px-4">Cena</th>
                <th className="py-2 px-4">Ukupno</th>
              </tr>
            </thead>
            <tbody>
              {dokument.stavkeDokumenata?.map((stavka: any, idx: number) => (
                <tr key={idx} className="border-t">
                  <td className="py-2 px-4">{stavka.nazivArtikla}</td>
                  <td className="py-2 px-4">{stavka.kolicina}</td>
                  <td className="py-2 px-4">{stavka.cena.toFixed(2)}</td>
                  <td className="py-2 px-4">{stavka.ukupnaCena.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ukupna cena */}
        <div className="mt-6 text-right">
          <span className="text-lg text-gray-600 mr-2">Ukupno:</span>
          <span className="text-2xl font-bold text-blue-700">
            {dokument.stavkeDokumenata?.reduce((sum: number, s: any) => sum + s.ukupnaCena, 0).toFixed(2)} RSD
          </span>
        </div>
      </div>
    </div>
  );
}
