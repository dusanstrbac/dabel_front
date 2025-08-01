'use client';
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { dajKorisnikaIzTokena } from "@/lib/auth";
import { toast } from "sonner";

const KreirajKorisnika = () => {
  const [korisnickoIme, setKorisnickoIme] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [open, setOpen] = useState(false); // State za otvaranje/zatvaranje dijaloga
  const idCounter = useRef(100);

  const validateEmail = (email: string) => {
    // Jednostavan regex za validaciju emaila
    const res = /\S+@\S+\.\S+/;
    return res.test(email);
  };

  const handleSubmit = async () => {
    const partner = dajKorisnikaIzTokena();

    // Validacija unosa
    if (!korisnickoIme || !lozinka || !email || !telefon) {
      toast.error("Sva polja moraju biti popunjena!");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Email nije u validnom formatu!");
      return;
    }

    if(lozinka.length < 6 ) {
      toast.error("Lozinka mora imati najmanje 6 karaktera!");
      return;
    }

    if (!/^(\+381|0)[6-9][0-9]{7,8}$/.test(telefon)) {
      toast.error("Telefon nije u validnom formatu. (Na primer: +38160XXXXXXX)");
      return;
    }

    const payload = {
      korisnickoIme,
      lozinka,
      email,
      telefon,
      partner: partner?.idKorisnika,
    };

    try {
      const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
      const res = await fetch(`${apiAddress}/api/Partner/KreirajKorisnika`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Uspešno ste kreirali korisnika");
        setOpen(false);
        setTimeout(() => {
          window.location.reload();
        }, 500); // 500ms delay
      } else {
        toast.error(data.message || "Greška prilikom kreiranja korisnika");
      }
    } catch (error) {
      console.error("Greška prilikom slanja zahteva:", error);
      toast.error(String(error));
    }
  };

  const handleDialogClose = (openStatus: boolean) => {
    if (!openStatus) {
      window.location.reload();
    }
    setOpen(openStatus);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogTrigger asChild>
          <Button variant="outline">Kreiraj korisnika</Button>
        </DialogTrigger>

        <DialogContent className="w-full max-w-3xl h-auto max-h-[95vh] overflow-y-auto px-4">
          <DialogHeader>
            <DialogTitle className="font-bold text-xl">Kreiranje novog korisnika</DialogTitle>
            <DialogDescription>
              Unesite sve podatke da biste registrovali novog korisnika
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="korisnickoIme" className="font-bold">Korisničko ime</Label>
              <Input
                id="korisnickoIme"
                value={korisnickoIme}
                onChange={(e) => setKorisnickoIme(e.target.value)}
                className="border-2 border-gray-300"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="font-bold">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-gray-300"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="lozinka" className="font-bold">Lozinka</Label>
              <Input
                type="password"
                id="lozinka"
                value={lozinka}
                onChange={(e) => setLozinka(e.target.value)}
                className="border-2 border-gray-300"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="telefon" className="font-bold">Telefon</Label>
              <Input
                id="telefon"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                className="border-2 border-gray-300"
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" onClick={handleSubmit} className="px-5 cursor-pointer">Kreiraj korisnika</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KreirajKorisnika;
