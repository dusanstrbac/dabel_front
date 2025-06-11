'use client';
import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";

interface Korisnik {
  korisnickoIme: string;
  lozinka?: string;
  email: string;
  telefon: string;
  status: string;
  uloga: string;
  adresa: string;
  grad?: string;
  delatnost?: string;
  pib?: string;
  maticniBroj?: string;
  zip: string;
  finKarta: {
    kredit: string;
  }
}

const PromenaPodatakaKorisnika = ({ korisnik }: { korisnik: Korisnik }) => {
  const [korisnickoIme, setKorisnickoIme] = useState(korisnik.korisnickoIme);
  const [lozinka, setLozinka] = useState(korisnik.lozinka || '');
  const [email, setEmail] = useState(korisnik.email);
  const [telefon, setTelefon] = useState(korisnik.telefon);
  const [statusAktivnosti, setStatusAktivnosti] = useState(korisnik.status);
  const [uloga, setUloga] = useState(korisnik.uloga);
  const [adresa, setAdresa] = useState(korisnik.adresa);
  const [grad, setGrad] = useState(korisnik.grad || '');
  const [delatnost, setDelatnost] = useState(korisnik.delatnost || '');
  const [pib, setPib] = useState(korisnik.pib || '');
  const [maticniBroj, setMaticniBroj] = useState(korisnik.maticniBroj || '');
  const [zip, setZip] = useState(korisnik.zip || '');
  const [kredit, setKredit] = useState(korisnik.finKarta.kredit || '0');

  const handleSubmit = async () => {

    const payload = {
      ime: korisnickoIme,
      korisnickoIme,
      lozinka,
      email,
      telefon,
      statusAktivnosti,
      uloga,
      grad,
      adresa,
      zip,
      delatnost,
      pib,
      maticniBroj,
      FinKarta: {
        Kredit: kredit,
      }
    };

    const res = await fetch("http://localhost:7235/api/Partner/KreirajPartnera", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.text())
    .then(poruka => {
      console.log(poruka);
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">Promena</Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-3xl h-auto max-h-[95vh] overflow-y-auto px-4">
        <DialogHeader>
          <DialogTitle className="font-bold text-xl">Izmena podataka korisnika</DialogTitle>
          <DialogDescription>
            Ažurirajte informacije o korisniku
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Leva kolona */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="korisnickoIme">Korisničko ime</Label>
              <Input value={korisnickoIme} onChange={(e) => setKorisnickoIme(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lozinka">Lozinka</Label>
              <Input type="password" value={lozinka} onChange={(e) => setLozinka(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telefon">Telefon</Label>
              <Input value={telefon} onChange={(e) => setTelefon(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={statusAktivnosti} onValueChange={setStatusAktivnosti}>
                <SelectTrigger>
                  <SelectValue placeholder="Odaberite status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Aktivan">Aktivan</SelectItem>
                    <SelectItem value="Pasivan">Pasivan</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Uloga</Label>
              <Select value={uloga} onValueChange={setUloga}>
                <SelectTrigger>
                  <SelectValue placeholder="Odaberite ulogu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="sveAktivnosti">Sve aktivnosti</SelectItem>
                    <SelectItem value="rezervisanjeRobe">Rezervisanje robe</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Desna kolona */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="grad">Grad</Label>
              <Input value={grad} onChange={(e) => setGrad(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="adresa">Adresa</Label>
              <Input value={adresa} onChange={(e) => setAdresa(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="zip">Zip</Label>
              <Input value={zip} onChange={(e) => setZip(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="delatnost">Delatnost</Label>
              <Input value={delatnost} onChange={(e) => setDelatnost(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pib">PIB</Label>
              <Input value={pib} onChange={(e) => setPib(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maticniBroj">Matični broj</Label>
              <Input value={maticniBroj} onChange={(e) => setMaticniBroj(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="kredit">Kredit</Label>
              <Input value={kredit} onChange={(e) => setKredit(e.target.value)} />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button type="submit" onClick={handleSubmit}>Sačuvaj promene</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PromenaPodatakaKorisnika;
