'use client';
import Image from "next/image";

type Stavka = {
    artikl: string;
    jm: string;
    kolicina: number;
    cena: number;
    rabat: number; // procenat
    pdv: number; // procenat
};

const stavke: Stavka[] = [
  {
    artikl: "Kvaka rozeta za vrata ANA F1 fi52/11/110/8/9mm  .Klj DBP3",
    jm: "kom",
    kolicina: 5,
    cena: 100,
    rabat: 10,
    pdv: 20,
  },
  {
    artikl: "Kvaka rozeta za vrata JOVA Hr/Mat-Hr fi54/10/120/8/9mm  Cil DBP3",
    jm: "pak",
    kolicina: 3,
    cena: 200,
    rabat: 0,
    pdv: 20,
  },
  {
    artikl: "Kvaka rozeta za metalna vrata JACA Cm 30/61/6/105/9mm  Cil DBP3",
    jm: "kg",
    kolicina: 7,
    cena: 150,
    rabat: 5,
    pdv: 10,
  },
  {
    artikl: "Rozeta za vrata R47 Hr fi50mm (2kom) .Klj DBP1",
    jm: "l",
    kolicina: 10,
    cena: 50,
    rabat: 0,
    pdv: 20,
  },
  {
    artikl: "Kvaka rozeta za vrata NEVENA Hr/Mat-Hr fi46/9/110/8/9mm  Cil DBP3",
    jm: "kom",
    kolicina: 2,
    cena: 300,
    rabat: 15,
    pdv: 20,
  },
  {
    artikl: "Kvaka rozeta za vrata DODO  8x8/fi 50mm",
    jm: "pak",
    kolicina: 4,
    cena: 80,
    rabat: 0,
    pdv: 10,
  }
];

const DokumentPage = () => {
    const handlePrint = () => window.print();
    const izracunajStavku = (stavka: Stavka) => {
        const cenaPosleRabata = stavka.cena * (1 - stavka.rabat / 100);
        const cenaBezPDV = cenaPosleRabata;
        const cenaSaPDV = cenaBezPDV * (1 + stavka.pdv / 100);
        const vrednost = cenaSaPDV * stavka.kolicina;

        return {
            cenaBezPDV,
            cenaSaPDV,
            vrednost,
        };
    };

    const ukupno = stavke.reduce(
        (acc, stavka) => {
            const { cenaBezPDV, cenaSaPDV, vrednost } = izracunajStavku(stavka);
            acc.ukupnoBezPDV += cenaBezPDV * stavka.kolicina;
            acc.ukupnoSaPDV += vrednost;
            return acc;
        },
        { ukupnoBezPDV: 0, ukupnoSaPDV: 0 }
    );

    return (
        <div className="mx-auto bg-white text-black p-10 print:p-0">
            <div className="flex items-center justify-between mb-5">
                <Image
                    src="/Dabel-logo-2.png"
                    alt="Dabel Logo"
                    width={150}
                    height={150}
                />
                <button onClick={handlePrint} className="text-blue-600 underline hover:text-blue-800 no-print">
                    Štampaj
                </button>
            </div>

            {/* Informacije */}
            <div className="mt-10 w-full">
                <p className="mt-2 font-semibold">NP</p>
                    
                <p>Nova Pazova, Šesta Industrijska 12</p>
            <div className="flex justify-between gap-8 w-full">

                <div className="border border-black p-4 w-[48%]">
                <h1 className="font-bold mb-2">Kontakt osoba:</h1>
                <p>Ime i prezime: Nikola Cvetković</p>
                <p>Mob. telefon: +381607211022</p>
                <p>Fax:</p>
                <p>Email adresa: nikola.cvetkovic@dabel.rs</p>
                </div>

                <div className="border border-black p-4 w-[48%]">
                <p>Partner: 3005</p>
                <h3 className="mb-2 font-semibold">BANE OKOV</h3>
                <p>3500 Jagodina, Kneza Lazara 118</p>
                <p>Fax: +38135232316</p>
                <p>Mob. telefon: +38135232316</p>
                <p>PIB: 103200595</p>
                </div>
            </div>

            {/* Naručeno */}
            <div className="border border-black p-4 mt-4 w-full max-w-full">
                <h3 className="font-semibold mb-1">Naručeno</h3>
                <p>1027/09-1-1027</p>
            </div>
                <p className="mt-1">Datum izdavanja: 02.06.2025 15:00</p>
            </div>

            {/* Tabela sa artiklima */}
            <div className="mt-6">
                <h2 className="font-bold text-lg mb-2">Sadržaj</h2>

                <table className="w-full table-fixed border border-black text-sm">
                    <thead>
                        <tr className="border-b border-black text-xs uppercase bg-transparent print:bg-white">
                            <th className="border-r border-black px-2 py-1 w-[40px]">R. br.</th>
                            <th className="border-r border-black px-2 py-1 text-left w-[200px]">Artikl</th>
                            <th className="border-r border-black px-2 py-1 w-[50px]">JM</th>
                            <th className="border-r border-black px-2 py-1 w-[70px]">Količina</th>
                            <th className="border-r border-black px-2 py-1 w-[90px]">Cena</th>
                            <th className="border-r border-black px-2 py-1 w-[80px]">Rabat (%)</th>
                            <th className="border-r border-black px-2 py-1 w-[100px]">Cena bez PDV</th>
                            <th className="border-r border-black px-2 py-1 w-[70px]">PDV (%)</th>
                            <th className="border-r border-black px-2 py-1 w-[100px]">Cena sa PDV</th>
                            <th className="px-2 py-1 w-[110px]">Vrednost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stavke.map((stavka, index) => {
                            const { cenaBezPDV, cenaSaPDV, vrednost } = izracunajStavku(stavka);
                            return (
                                <tr key={index} className="text-center border-t border-black">
                                    <td className="border-r border-black px-2 py-1">{index + 1}</td>
                                    <td className="border-r border-black px-2 py-1 text-left">{stavka.artikl}</td>
                                    <td className="border-r border-black px-2 py-1">{stavka.jm}</td>
                                    <td className="border-r border-black px-2 py-1">{stavka.kolicina}</td>
                                    <td className="border-r border-black px-2 py-1">{stavka.cena.toFixed(2)}</td>
                                    <td className="border-r border-black px-2 py-1">{stavka.rabat}%</td>
                                    <td className="border-r border-black px-2 py-1">{cenaBezPDV.toFixed(2)}</td>
                                    <td className="border-r border-black px-2 py-1">{stavka.pdv}%</td>
                                    <td className="border-r border-black px-2 py-1">{cenaSaPDV.toFixed(2)}</td>
                                    <td className="px-2 py-1">{vrednost.toFixed(2)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {/* Ukupno ispod tabele */}
            <div className="mt-4 flex flex-col items-end text-sm">
                <div className="flex gap-4">
                    <span className="font-semibold">Ukupno bez PDV:</span>
                    <span>{ukupno.ukupnoBezPDV.toFixed(2)} RSD</span>
                </div>
                <div className="flex gap-4">
                    <span className="font-semibold">Ukupno sa PDV:</span>
                    <span>{ukupno.ukupnoSaPDV.toFixed(2)} RSD</span>
                </div>
            </div>

            {/* Napomena i kreirao */}
            <div className="mt-10 space-y-2">
                <p className="text-center">
                    Isporučene količine mogu biti manje u zavisnosti od stanja na lageru
                </p>

                <div className="border border-black w-full">
                    <div className="border-b border-black px-2 py-1">
                    <p className="font-semibold uppercase text-sm tracking-wide">Dokument kreirao:</p>
                </div>
                <div className="px-2 py-1 text-sm space-y-1">
                    <p><span className="">Korisničko ime:</span> 3005</p>
                    <p><span className="">Ime i prezime:</span></p>
                    <p><span className="">Email adresa:</span></p>
                    <p><span className="">Mob. telefon:</span></p>
                </div>
            </div>


            </div>
        </div>
    );
};

export default DokumentPage;
