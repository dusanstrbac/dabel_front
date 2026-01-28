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
import { toast } from "sonner";
import { delay } from "framer-motion";
import { useTranslations } from "next-intl";
import { ComboboxAdrese } from "./ui/ComboboxAdrese";

interface Korisnik {
  korisnickoIme: string;
  idKorisnika: string;
  lozinka?: string;
  email: string;
  telefon: string;
}

interface PromenaPodatakaKorisnikaProps {
  korisnik: Korisnik;
  partner: KorisnikPodaciType;
}




const PromenaPodatakaKorisnika = ({ korisnik, partner }: PromenaPodatakaKorisnikaProps) => {
  const t = useTranslations();
  const [korisnickoIme, setKorisnickoIme] = useState(korisnik.korisnickoIme);
  const [lozinka, setLozinka] = useState(korisnik.lozinka || '');
  const [lokacija, setLokacija] = useState('');
  const [email, setEmail] = useState(korisnik.email);
  const [telefon, setTelefon] = useState(korisnik.telefon);
  const [open, setOpen] = useState(false);

  // if (!partner) return null; // ili disabled UI

 const sveLokacijeOption: KorisnikDostavaType = {
    idPartnera: partner.idPartnera ?? "",
    adresa: "Sve lokacije",
    grad: "",
    drzava: "",
    postBroj: "",
    opstina: "",
    kontaktOsoba: "",
    telefon: "",
    email: "",
    sifra: ""
  };
  const [listaZaPrikaz, setListaZaPrikaz] = useState(partner?.partnerDostava.concat(sveLokacijeOption) || []);

  const handleSubmit = async () => {
    const payload: any = {
      korisnickoIme,
      email,
      telefon,
      lokacija
    };

    // Ako je lozinka promenjena, dodajemo je u payload
    if (lozinka !== korisnik.lozinka) {
      payload.lozinka = lozinka;
    }

    // Validacija broja telefona
    if (!/^(\+381|0)[6-9][0-9]{7,8}$/.test(telefon)) {
      toast.error(t('promenaPodatakaKorisnika.Telefon nije u validnom formatu (Na primer: +38160XXXXXXX)'));

      return;
    }

    const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
    try {
      const res = await fetch(`${apiAddress}/api/Partner/PromeniPodkorisnika`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        try {
          const data = await res.json();
          toast.success(t('promenaPodatakaKorisnika.Podaci o korisniku u uspešno ažurirani'));
          setOpen(false);
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } catch (jsonError) {
          const errorText = await res.text();
          toast.error(errorText);
        }
      } else {
        const errorText = await res.text();
        toast.error(errorText || t('promenaPodatakaKorisnika.Došlo je do greške'));
      }
    } catch (error) {
      console.error("Greška prilikom slanja zahteva:", error);
      toast.error(t('promenaPodatakaKorisnika.Došlo je do greške pri slanju podataka.'));
    }
  };

  const handleDeleteUser = async () => {
    const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
    try {
      const res = await fetch(`${apiAddress}/api/Partner/ObrisiKorisnika?KorisnickoIme=${korisnickoIme}&idKorisnika=${korisnik.idKorisnika}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message || t('promenaPodatakaKorisnika.Korisnik je uspešno obrisan'));
        window.location.reload();
      } else {
        const data = await res.json();
        toast.error(data.message || t('promenaPodatakaKorisnika.Greška prilikom brisanja korisnika'));
      }
    } catch (error) {
      console.error("Greška prilikom brisanja korisnika:", error);
      toast.error(t('promenaPodatakaKorisnika.Došlo je do greške pri brisanju korisnika'));
    }
  };

  // Osvežavamo stranicu kada dijalog bude zatvoren
  const handleDialogClose = (openStatus: boolean) => {
    if (!openStatus) {
      window.location.reload();
    }
    setOpen(openStatus);
  };


 

  const adreseSaDefault: KorisnikDostavaType[] = [
    sveLokacijeOption,
    ...(partner?.partnerDostava ?? [])
  ] as KorisnikDostavaType[];

  // const adreseSaDefault: KorisnikDostavaType[] = [
  //   {
  //     ...sveLokacijeOption,
  //     adresa: "Sve lokacije" // ako se u comboboxu prikazuje `adresa`
  //   },
  //   ...(partner?.partnerDostava ?? [])
  // ];


  console.log("dobijeni partner u promeni podataka korisnika:", partner);
  console.log("dobijene adrese u promeni podataka korisnika:", partner.partnerDostava);
  //ovo za adrese mi je undefined, kako onda to radi?

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">{t('promenaPodatakaKorisnika.Promena')}</Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-3xl h-auto max-h-[95vh] overflow-y-auto px-4 z-[200]">
        <DialogHeader>
          <DialogTitle className="font-bold text-xl">{t('promenaPodatakaKorisnika.Izmena podataka korisnika')}</DialogTitle>
          <DialogDescription>{t('promenaPodatakaKorisnika.Ažurirajte informacije o korisniku')}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="korisnickoIme">{t('korisnici.Korisničko ime')}</Label>
            <Input value={korisnickoIme} disabled />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="lozinka">{t('promenaPodatakaKorisnika.Lozinka')}</Label>
            <Input 
              type="password"
              value={lozinka} 
              onChange={(e) => setLozinka(e.target.value)} 
              placeholder={t('promenaPodatakaKorisnika.Unesite novu lozinku (ako želite da je promenite)')} 
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">{t('korisnici.E-mail')}</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="telefon">{t('korisnici.Telefon')}</Label>
            <Input 
              value={telefon} 
              onChange={(e) => setTelefon(e.target.value)} 
            />
          </div>

          <div>
            <Label htmlFor="email" className="font-bold mb-2">{t('korisnici.Lokacija')}</Label>
            <ComboboxAdrese
                dostavaList={listaZaPrikaz}
                onSelectOption={(adresa) => {
                    setLokacija(adresa.sifra);
                }}
                defaultValue={lokacija}
            />
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-between">
          <Button type="button" onClick={handleSubmit}>{t('promenaPodatakaKorisnika.Sačuvaj promene')}</Button>
          <Button type="button" onClick={handleDeleteUser} variant="destructive">{t('promenaPodatakaKorisnika.Obriši korisnika')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PromenaPodatakaKorisnika;
