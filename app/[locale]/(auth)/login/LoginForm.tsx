'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import LanguageSelector from "@/components/LanguageSelector";
import { useLocale, useTranslations } from "next-intl";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations();
  const locale = useLocale();

  // Validation schema
  const formSchema = z.object({
    korisnickoIme: z.string().min(1, t('Logovanje.Korisničko ime je obavezno')),
    lozinka: z.string().min(4, t('promenaLozinke.lozinka6karaktera')),
  });

  type FormValues = z.infer<typeof formSchema>;

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
      const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;

      const { data } = await axios.post(
        `${apiAddress}/api/Auth/LoginPodaci`,
        {
          korisnickoIme: values.korisnickoIme,
          lozinka: values.lozinka,
        },
        {
          withCredentials: true,
        }
      );
      
      setCookie("NEXT_LOCALE", locale, { path: "/" });
      const redirectTo = searchParams.get("redirectTo") || await getCookie("poslednjaRuta") || '/';

      if (data.token) {
        setCookie("AuthToken", data.token, {
          maxAge: 60 * 60 * 24 * 5, // Korisnicki token traje 5 dana
          path: "/",
          encode: (value) => value,
        });

        router.push(redirectTo);
        router.refresh();
        deleteCookie("poslednjaRuta")
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
    <div className="mx-auto max-w-md space-y-6 pt-10 px-4 sm:px-6 lg:px-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">{t('Logovanje.Prijava')}</h1>
        <p className="text-muted-foreground">{t('Logovanje.Unesite svoje podatke za pristup nalogu')}</p>
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
                <FormLabel>{t('Logovanje.Korisničko ime')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('Logovanje.Unesite korisničko ime')}
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
                <FormLabel>{t('Logovanje.Lozinka')}</FormLabel>
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
          <p className="float-right text-sm font-semibold">{t('Logovanje.Nemate nalog')} <Link href={`/${locale}/register`} className="font-normal text-blue-500 hover:text-blue-300">{t('Logovanje.Registrujte se besplatno')}</Link></p>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('Logovanje.Prijavljivanje')}
              </>
            ) : (
              t('Logovanje.Prijavi se')
            )}
          </Button>
          <div className="float-right">
            <LanguageSelector />
          </div>
        </form>
      </Form>
    </div>
  );
}
