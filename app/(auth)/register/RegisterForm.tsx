'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ✅ Validacija za email i JMBG (8 cifara)
const emailSchema = z.object({
  email: z.string().email("Unesite validan email"),
  mb: z.string()
    .regex(/^\d{8}$/, "Maticni broj mora imati tačno 8 cifara"),
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
        mb: values.mb,
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
      <h1 className="text-3xl font-bold mb-1 text-center">Aktivirajte nalog</h1>
      <p className="text-muted-foreground text-center mb-4">Unesite svoje podatke za pristup nalogu</p>

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
          placeholder="Unesite Matični broj"
          {...form.register("mb")}
          disabled={loading}
          className="w-full border p-2 rounded"
        />
        {form.formState.errors.mb && (
          <p className="text-red-600 text-sm">{form.formState.errors.mb.message}</p>
        )}
        <p className="text-sm float-right font-semibold">Već posedujete nalog? <Link href={'/login'} className="font-normal text-blue-500 hover:text-blue-300">Prijavite se ovde</Link></p>
        <Button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer hover:opacity-90"
        >
          {loading ? "Šaljem..." : "Pošalji link za aktivaciju"}
        </Button>
      </form>
    </div>
  );
}
