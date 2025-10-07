'use client';

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { useLocale, useTranslations } from "next-intl";
import LanguageSelector from "@/components/LanguageSelector";

export default function AktivacijaNaloga() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations();
  const token = searchParams.get("token") || "";
  const locale = useLocale();

  const [lozinka, setLozinka] = useState("");
  const [potvrdaLozinke, setPotvrdaLozinke] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (lozinka.length < 4) {
      setError(t('Aktivancija.Lozinka mora imati najmanje 4 karaktera'));
      return;
    }

    if (lozinka !== potvrdaLozinke) {
      setError(t('Aktivacija.Lozinke se ne poklapaju'));
      return;
    }

    try {
      setLoading(true);
      const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;

      const response = await axios.post(`${apiAddress}/api/Partner/PostaviLozinku`, {
        Token: token,
        Lozinka: lozinka,
      });
      setSuccessMessage(t('Aktivacija.Lozinka je uspešno postavljena! Možete se sada prijaviti'));
      setTimeout(() => {
        router.push("/login"); // ili gde god korisnik ide posle aktivacije
      }, 3000);
    } catch (err: any) {
      setError(t('Aktivacija.Greška prilikom postavljanja lozinke'))
      //setError(err.response?.data?.poruka || "Greška prilikom postavljanja lozinke.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
    <div className="flex flex-col items-center justify-center h-[100vh] gap-[20px]">
      <div className="text-center">
        <h1 className="text-2xl">{t('Aktivacija.Token nije validan ili je istekao')}</h1>
        <p className="italic text-md">{t('Aktivacija.Molimo da se vratite na početnu stranu')}</p>
      </div>
      <button onClick={() => router.push(`${locale}/`)} className="border py-3 px-15 rounded-lg cursor-pointer hover:opacity-80 bg-gray-300">{t('Aktivacija.Početna')}</button>
    </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 shadow rounded">
      <h1 className="text-2xl font-bold mb-4 text-center">{t('Aktivacija.Postavite novu lozinku')}</h1>

      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      {successMessage && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="lozinka" className="block mb-1 font-medium">{t('Aktivacija.Lozinka')}</label>
          <input
            type="password"
            id="lozinka"
            value={lozinka}
            onChange={e => setLozinka(e.target.value)}
            disabled={loading}
            className="w-full border rounded px-3 py-2"
            placeholder={t('Aktivacija.Unesite novu lozinku')}
          />
        </div>

        <div>
          <label htmlFor="potvrdaLozinke" className="block mb-1 font-medium">{t('Aktivacija.Potvrda lozinke')}</label>
          <input
            type="password"
            id="potvrdaLozinke"
            value={potvrdaLozinke}
            onChange={e => setPotvrdaLozinke(e.target.value)}
            disabled={loading}
            className="w-full border rounded px-3 py-2"
            placeholder={t('Aktivacija.Potvrdite lozinku')}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? t('Aktivacija.Postavljanje') : t('Aktivacija.Postavi lozinku')}
        </button>
      </form>
      <div className="mt-2 flex justify-end">
        <LanguageSelector />
      </div>
    </div>
  );
}
