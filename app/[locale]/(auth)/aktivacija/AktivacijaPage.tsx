'use client';

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

export default function AktivacijaNaloga() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";

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
      setError("Lozinka mora imati najmanje 4 karaktera.");
      return;
    }

    if (lozinka !== potvrdaLozinke) {
      setError("Lozinke se ne poklapaju.");
      return;
    }

    try {
      setLoading(true);
      const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;

      const response = await axios.post(`${apiAddress}/api/Partner/PostaviLozinku`, {
        Token: token,
        Lozinka: lozinka,
      });
      setSuccessMessage("Lozinka je uspešno postavljena! Možete se sada prijaviti.");
      setTimeout(() => {
        router.push("/login"); // ili gde god korisnik ide posle aktivacije
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.poruka || "Greška prilikom postavljanja lozinke.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return <div>Token nije validan ili je istekao.</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 shadow rounded">
      <h1 className="text-2xl font-bold mb-4 text-center">Postavite novu lozinku</h1>

      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      {successMessage && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="lozinka" className="block mb-1 font-medium">Lozinka</label>
          <input
            type="password"
            id="lozinka"
            value={lozinka}
            onChange={e => setLozinka(e.target.value)}
            disabled={loading}
            className="w-full border rounded px-3 py-2"
            placeholder="Unesite novu lozinku"
          />
        </div>

        <div>
          <label htmlFor="potvrdaLozinke" className="block mb-1 font-medium">Potvrda lozinke</label>
          <input
            type="password"
            id="potvrdaLozinke"
            value={potvrdaLozinke}
            onChange={e => setPotvrdaLozinke(e.target.value)}
            disabled={loading}
            className="w-full border rounded px-3 py-2"
            placeholder="Potvrdite lozinku"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Postavljanje..." : "Postavi lozinku"}
        </button>
      </form>
    </div>
  );
}
