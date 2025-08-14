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

const formSchema = z.object({
  lozinka: z.string().min(4, 'Lozinka mora imati najmanje 4 karaktera'),
  novalozinka: z.string().min(6, 'Lozinka mora imati najmanje 6 karaktera'),
  plozinka: z.string().min(6, 'Lozinka mora imati najmanje 6 karaktera'),
});

export default function Podesavanja() {
  const [isMounted, setIsMounted] = useState(false);

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
      alert("Doslo je do greske. Molimo ulogujte se opet");
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
        <h1 className="text-3xl font-bold">Promena lozinke</h1>
        <p className="text-gray-500">Popunite polja ispod da bi ste promenili lozinku</p>
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
                  <FormLabel>Trenutna lozinka</FormLabel>
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
                  <FormLabel>Nova lozinka</FormLabel>
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
                  <FormLabel>Potvrda nove lozinke</FormLabel>
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
            Sačuvaj
          </Button>
        </form>
      </Form>
    </div>
  );
}
