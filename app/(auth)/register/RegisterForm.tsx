'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

// ✅ Validacija za email i JMBG (13 cifara)
const emailSchema = z.object({
  email: z.string().email("Unesite validan email"),
  jmbg: z.string()
    .regex(/^\d{13}$/, "JMBG mora imati tačno 13 cifara"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export default function PosaljiLinkZaAktivacijuForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });

  async function onSubmit(values: EmailFormValues) {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
      const response = await axios.post(`${apiAddress}/api/Partner/PosaljiLinkZaAktivaciju`, {
        Email: values.email,
        JMBG: values.jmbg,
      });

      if (response.data?.poruka) {
        setSuccess(response.data.poruka);
      } else {
        setError("Nepoznata greška prilikom slanja linka.");
      }
    } catch (e: any) {
      setError(e.response?.data?.poruka || e.message || "Greška u slanju linka.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 shadow rounded mt-10">
      <h1 className="text-3xl font-bold mb-4 text-center">Aktivirajte nalog</h1>

      {error && <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">{error}</div>}
      {success && <div className="mb-4 text-green-600 bg-green-100 p-2 rounded">{success}</div>}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="email"
          placeholder="Unesite email"
          {...form.register("email")}
          disabled={loading}
          className="w-full border p-2 rounded"
        />
        {form.formState.errors.email && (
          <p className="text-red-600 text-sm">{form.formState.errors.email.message}</p>
        )}

        <input
          type="text"
          placeholder="Unesite JMBG"
          {...form.register("jmbg")}
          disabled={loading}
          className="w-full border p-2 rounded"
        />
        {form.formState.errors.jmbg && (
          <p className="text-red-600 text-sm">{form.formState.errors.jmbg.message}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-4 cursor-pointer hover:opacity-90"
        >
          {loading ? "Šaljem..." : "Pošalji link za aktivaciju"}
        </Button>
      </form>
    </div>
  );
}
