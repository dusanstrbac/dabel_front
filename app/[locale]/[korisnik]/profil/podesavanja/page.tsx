'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { dajKorisnikaIzTokena } from '@/lib/auth';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';


export default function Podesavanja() {
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations('promenaLozinke');

  const formSchema = z.object({
    lozinka: z.string().min(4, t('lozinka4karaktera')),
    novalozinka: z.string().min(6, t('lozinka6karaktera')),
    plozinka: z.string().min(6, t('lozinka6karaktera')),
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lozinka: '',
      novalozinka: '',
      plozinka: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const korisnik = dajKorisnikaIzTokena();
    const idPartnera = korisnik?.idKorisnika;
    const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;

    if(!idPartnera) {
      alert(t('greskaUlogujSeOpet'));
      return;
    }

    fetch(`${apiAddress}/api/Partner/PromenaLozinke`, {
      method:"PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idPartnera: idPartnera,
        lozinka: values.lozinka,
        novaLozinka: values.novalozinka,
        potvrdaLozinke: values.plozinka,
      }),
    })
    .then(async (res) => {
      if(!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }
      return res.text();
    })
    .then((msg) => {
      toast.success(msg);
      form.reset();
    })
    .catch((err) => {
      toast.error(`${err}`);
    })

  }

  if (!isMounted) {
    return null;
  }

  return (
    <div className="mx-auto max-w-md space-y-6 pt-10">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">{t('naslov')}</h1>
        <p className="text-gray-500">{t('uputstvo')}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Lozinka polje */}
          <FormField
            control={form.control}
            name="lozinka"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>{t('trenutnaLozinka')}</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    className="mt-1"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* Nova lozinka polje */}
          <FormField
            control={form.control}
            name="novalozinka"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>{t('novaLozinka')}</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    className="mt-1"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* Potvrda nove lozinke polje */}
          <FormField
            control={form.control}
            name="plozinka"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>{t('potvrdaNoveLozinke')}</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    className="mt-1"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full cursor-pointer">
            {t('sacuvaj')}
          </Button>
        </form>
      </Form>
    </div>
  );
}
