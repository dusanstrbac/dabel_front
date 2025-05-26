"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { setCookie } from "cookies-next";
import { Loader2 } from "lucide-react";

// Validation schema
const formSchema = z.object({
//  email: z.string().min(1, "Email je obavezan").email("Unesite ispravan email"),
  korisnickoIme: z.string().min(1, "Korisnicko ime je obavezno"),
  lozinka: z.string().min(4, "Lozinka mora imati najmanje 4 karaktera"),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      korisnickoIme: "",
      lozinka: "",
    },
  });

  async function onSubmit(values: FormValues) {
  setLoading(true);
  setError(null);

  try {
    const { data } = await axios.post("https://localhost:44383/LoginPodaci", {
      korisnickoIme: values.korisnickoIme,
      lozinka: values.lozinka,
    }, {
      withCredentials: true,
    });

    // Ovo proveravamo da li je server poslao uspešan odgovor
    console.log("Odgovor sa servera:", data);

    if (data.email) {
      // Ako je server vratio email, znači logovanje je uspešno
      setCookie("Email", data.email, {
        maxAge: 60 * 60 * 24 * 2, // Kolacic traje 2 dana
        path: "/",
        encode: (value) => value,
      });

      setCookie("KorisnickoIme", values.korisnickoIme, {
        maxAge: 60 * 60 * 24 * 2, // Kolacic traje 2 dana
        path: "/",
        encode: (value) => value,
      });

      router.push("/");  // Ovdje bi trebalo da budeš preusmeren na početnu stranu
      router.refresh();
    } else {
      setError(data.message || "Došlo je do greške prilikom prijave");
    }

  } catch (err) {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.message || err.message);
    } else {
      setError("Došlo je do greške prilikom prijavljivanja");
    }
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="mx-auto max-w-md space-y-6 pt-10">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Prijava</h1>
        <p className="text-muted-foreground">Unesite svoje podatke za pristup nalogu</p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
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
                  <Input
                    placeholder="Unesite korisničko ime"
                    {...field}
                    autoComplete="username"
                    disabled={loading}
                  />
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
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    autoComplete="current-password"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Prijavljivanje...
              </>
            ) : (
              "Prijavi se"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
