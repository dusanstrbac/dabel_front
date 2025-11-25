'use client';
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const ZaboravljenaLozinka = () => {
  const t = useTranslations();
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false);

  const validateEmail = (email: string) => {
    // Jednostavan regex za validaciju emaila
    const res = /\S+@\S+\.\S+/;
    return res.test(email);
  };

  const handleSubmit = async () => {

    if (!validateEmail(email)) {
      toast.error(t('kreirajKorisnika.Email nije u validnom formatu!'));
      return;
    }

    try {
      const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
      const res = await fetch(`${apiAddress}/api/Web/VratiLozinku?email=${email}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || t('PovratLozinke.Uspesno ste poslali zahtev'));

      } else {
        toast.error(data.message || t('PovratLozinke.Greska prilikom slanja zahteva'));
      }
    } catch (error) {
      console.error("Greška prilikom slanja zahteva:", error);
      toast.error(String(error));
    }
  };

  const handleDialogClose = (openStatus: boolean) => {
    setOpen(openStatus);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogTrigger asChild>
          <Button variant="default" className="cursor-pointer border-0 bg-transparent hover:bg-transparent p-0 font-normal text-blue-500 hover:text-blue-300 text-md">{t('Logovanje.Zaboravili ste lozinku')}</Button>
        </DialogTrigger>

        <DialogContent className="w-full max-w-3xl h-auto max-h-[95vh] overflow-y-auto px-4 z-[200]">
          <DialogHeader>
            <DialogTitle className="font-bold text-xl">{t('PovratLozinke.Vracanje naloga')}</DialogTitle>
            <DialogDescription>
              {t('PovratLozinke.Unesite trazene podatke da biste vratili nalog')}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="font-bold">{t('korisnici.E-mail')}</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-gray-300"
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" onClick={handleSubmit} className="px-5 cursor-pointer">{t('PovratLozinke.Posalji zahtev')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ZaboravljenaLozinka;
