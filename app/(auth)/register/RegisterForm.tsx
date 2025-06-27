'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  korisnickoIme: z.string().min(1, "Korisničko ime je obavezno"),
  lozinka: z.string().min(4, "Lozinka mora imati najmanje 4 karaktera"),
  email: z.string().email("Email nije validan"),
  maticniBroj: z.string().min(1, "Matični broj je obavezan"),
});

type FormValues = z.infer<typeof formSchema>;

export default function KreirajWebPartnerForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      korisnickoIme: "",
      lozinka: "",
      email: "",
      maticniBroj: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;

      const payload = {
        KorisnickoIme: values.korisnickoIme,
        Lozinka: values.lozinka,
        Email: values.email,
        MaticniBroj: values.maticniBroj,
      };

      const { data } = await axios.post(`${apiAddress}/api/Partner/KreirajPartnera`, payload, {
        withCredentials: true,
      });

      if (data?.poruka) {
        setSuccessMessage(data.poruka);
        router.push("/");
        form.reset();
      } else {
        setError("Nepoznata greška prilikom kreiranja partnera.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.poruka || err.response?.data?.message || err.message);
      } else {
        setError("Došlo je do greške prilikom slanja podataka.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 shadow rounded">
      <h1 className="text-2xl font-bold text-center">Registruj web nalog</h1>
      <p className="text-center mb-6">Unesite tražene podatke da bi ste kreirali web nalog</p>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {successMessage && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{successMessage}</div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          <FormField
            control={form.control}
            name="korisnickoIme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Korisničko ime</FormLabel>
                <FormControl>
                  <Input placeholder="Unesite korisničko ime" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Unesite email" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          


          <FormField
            control={form.control}
            name="maticniBroj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matični broj</FormLabel>
                <FormControl>
                  <Input placeholder="Unesite matični broj" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lozinka"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lozinka</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Unesite lozinku" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading} className="w-full cursor-pointer">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Kreiranje...
              </>
            ) : (
              "Kreiraj"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
