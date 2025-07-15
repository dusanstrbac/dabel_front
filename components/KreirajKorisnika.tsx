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

const KreirajKorisnika = () => {
  const [korisnickoIme, setKorisnickoIme] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [statusAktivnosti, setStatusAktivnosti] = useState('');
  const [uloga, setUloga] = useState('');
  const [adresa, setAdresa] = useState('');
  const [grad, setGrad] = useState('');
  const [delatnost, setDelatnost] = useState('');
  const [pib, setPib] = useState('');
  const [maticniBroj, setMaticniBroj] = useState('');
  const [zip, setZip] = useState('');
  const [kredit, setKredit] = useState('');

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
    const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
    const res = await fetch(`${apiAddress}/api/Partner/KreirajPartnera`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.text())
  }



  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Kreiraj korisnika</Button>
        </DialogTrigger>

        <DialogContent className="w-full max-w-3xl h-auto max-h-[95vh] overflow-y-auto px-4">
          <DialogHeader>
            <DialogTitle className="font-bold text-xl">Kreiranje novog korisnika</DialogTitle>
            <DialogDescription>
              Unesite sve podatke da biste registrovali novog partnera
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Leva kolona */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="korisnickoIme" className="font-bold">Korisničko ime</Label>
                <Input
                  id="korisnickoIme"
                  value={korisnickoIme}
                  onChange={(e) => setKorisnickoIme(e.target.value)}
                  className="border-2 border-gray-300"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lozinka" className="font-bold">Lozinka</Label>
                <Input
                  type="password"
                  id="lozinka"
                  value={lozinka}
                  onChange={(e) => setLozinka(e.target.value)}
                  className="border-2 border-gray-300"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="font-bold">Email</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2 border-gray-300"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="telefon" className="font-bold">Telefon</Label>
                <Input
                  id="telefon"
                  value={telefon}
                  onChange={(e) => setTelefon(e.target.value)}
                  className="border-2 border-gray-300"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status" className="font-bold">Status</Label>
                <Select onValueChange={setStatusAktivnosti}>
                  <SelectTrigger>
                    <SelectValue placeholder="Odaberite status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Aktivan" className="cursor-pointer">Aktivan</SelectItem>
                      <SelectItem value="Pasivan" className="cursor-pointer">Pasivan</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="uloga" className="font-bold">Uloga</Label>
                <Select onValueChange={setUloga}>
                  <SelectTrigger>
                    <SelectValue placeholder="Odaberite ulogu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="sveAktivnosti" className="cursor-pointer">Sve aktivnosti</SelectItem>
                      <SelectItem value="rezervisanjeRobe" className="cursor-pointer">Rezervisanje robe</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Desna kolona */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="grad" className="font-bold">Grad</Label>
                <Input
                  id="grad"
                  value={grad}
                  onChange={(e) => setGrad(e.target.value)}
                  className="border-2 border-gray-300"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="adresa" className="font-bold">Adresa</Label>
                <Input
                  id="adresa"
                  value={adresa}
                  onChange={(e) => setAdresa(e.target.value)}
                  className="border-2 border-gray-300"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="zip" className="font-bold">ZIP</Label>
                <Input
                  id="zip"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="border-2 border-gray-300"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="delatnost" className="font-bold">Delatnost</Label>
                <Input
                  id="delatnost"
                  value={delatnost}
                  onChange={(e) => setDelatnost(e.target.value)}
                  className="border-2 border-gray-300"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pib" className="font-bold">PIB</Label>
                <Input
                  id="pib"
                  value={pib}
                  onChange={(e) => setPib(e.target.value)}
                  className="border-2 border-gray-300"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maticniBroj" className="font-bold">Matični broj</Label>
                <Input
                  id="maticniBroj"
                  value={maticniBroj}
                  onChange={(e) => setMaticniBroj(e.target.value)}
                  className="border-2 border-gray-300"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="kredit" className="font-bold">Kredit</Label>
                <Input
                  id="kredit"
                  value={kredit}
                  onChange={(e) => setKredit(e.target.value)}
                  className="border-2 border-gray-300"
                />
              </div>
            </div>
          </div>


          <DialogFooter className="mt-4">
            <Button type="submit" onClick={handleSubmit} className="px-7 cursor-pointer">Sačuvaj</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KreirajKorisnika;
