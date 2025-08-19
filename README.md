# Dabel Frontend

Dabel je frontend aplikacija napravljena u Next.js/React okruženju, namenjena za web interfejs poslovnog sistema. Klijent omogućava korisnicima da pristupaju i upravljaju različitim funkcionalnostima kao što su pregled i izmena artikala, korisnički podaci, narudžbine, dokumenti i podešavanja.

---

## Čemu služi aplikacija

Dabel frontend predstavlja korisnički interfejs (UI) za poslovnu aplikaciju koja omogućava sledeće funkcionalnosti:
- Pregled narudžbenica
- Kreiranje i pregled narudžbenica
- Prikaz i kreiranje korisnika
- Svaki korisnik ima svoj asortiman
- Podešavanje sistemskih parametara (samo Admin)
- Prijava korisnika (login) i rad sa JWT tokenima
- Responsivni dizajn sa podrškom za mobilne uređaje

---

## Glavne funkcionalnosti aplikacije

### Kreiranje narudžbenice
- Partner ili korisnik može da doda artikle u korpu.
- Nakon potvrde narudžbenice, korisnik dobija stranicu sa dokumentom spremnim za štampu.
- Narudžbenica uključuje podatke o partneru, mestu isporuke, datumu, artiklima i napomeni.

### Višekorisnička podrška
- Svaki partner može kreirati dodatne korisnike sa različitim email adresama.
- Svaki korisnik ima pristup svom profilu i artiklima.
- Partneri imaju kontrolu nad korisnicima i pristupom.

### Brzo naručivanje
- Moguće je naručivanje preko QR koda (skeniranje artikla).
- Podržana je i opcija naručivanja putem .csv fajla (bulk upload).

### Tab za Akcije i Novopristigle
- Prikazuju se sekcije sa akcijama i novopristiglim artiklima.

### Pregledi i istorija
- Pregled svih prethodnih narudžbenica sa detaljima.
- Pregled svih izvršenih uplata.
- Pregled sopstvenih podataka i mogućnost izmene (npr. lozinke).

### Cenovnici i omiljeni artikli
- Mogućnost preuzimanja ličnog cenovnika.
- Filtriranje artikala po kategorijama.
- Dodavanje artikala u listu omiljenih.
- Pregled svih omiljenih artikala.

### Korpa
- Prikaz svih stavki u korpi.
- Mogućnost menjanja količina i brisanja.

### Web parametri (osvežavanje svakih 6h)
- Hero image, akcije, osnovne informacije o sajtu se automatski refetch-uju u pozadini.

---

## 🛠 Tehnologije

### Frontend

- **Next.js** (v15+) — React framework za SSR/SSG
- **React** (v18+)
- **Tailwind CSS** — Utility-first stilizovanje
- **TypeScript** — Statički tipiziran JavaScript
- **Radix UI** — UI primitives (dialog, accordion, popover itd.)
- **React Hook Form** — Validacija formi
- **Zod** — Validacija podataka
- **React Query (TanStack)** — Server state menadžment
- **SWR** — Alternativa za fetch i caching
- **Axios** — HTTP klijent
- **JWT + cookies-next + nookies** — Autentifikacija

### Dodatne biblioteke

- `emailjs-com` — slanje emailova iz aplikacije
- `pdf-lib`, `exceljs`, `pdfjs-dist` — rad sa dokumentima (PDF, Excel)
- `lucide-react`, `react-icons` — ikonice
- `framer-motion`, `sonner` — animacije i notifikacije
- `jsqr`, `react-qr-scanner`, `react-qr-barcode-scanner` — QR skeniranje
- `embla-carousel-react`, `yet-another-react-lightbox` — carousel i prikaz slika

---

## 📁 Struktura projekta

```
/app            - Next.js stranice i layout
/components     - Komponente korisničkog interfejsa (UI)
/contexts       - React context za globalne podatke (auth, korpa, itd.)
/lib            - Pomoćne funkcije i servisi (API, kalkulacije...)
/providers      - Globalni provider-i (theme, query, auth...)
/public         - Staticki fajlovi (slike, favicon...)
/types          - TypeScript tipovi i interfejsi
```

---

## 🚀 Pokretanje aplikacije lokalno

### Zahtevi

- Node.js 18+
- Yarn ili npm

### Instalacija

```bash
git clone https://github.com/dusanstrbac/dabel_front -b test
cd dabel_front
npm install
npm run dev
```

Aplikacija će biti dostupna na: `http://localhost:3000`

---

## 📜 Skripte

- `dev` – Pokreće development server (sa Turbopack)
- `build` – Build-uje aplikaciju za produkciju
- `start` – Pokreće produkcijsku verziju
- `lint` – Pokreće ESLint proveru

---

## 🧾 Licence

Ovaj projekat je zatvorenog koda (privatni repo), nije predviđen za javnu distribuciju bez dozvole autora.

---

## 👤 Autor

Dabel aplikaciju razvijaju članovi tima [@dusanstrbac](https://github.com/dusanstrbac) i saradnici.

---

Za dodatne opise, uputstva za backend (ako postoji), deploy ili integracije, slobodno dopuni ili mi reci šta još da uvrstim.
