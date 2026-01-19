"use client";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Pagination } from "./ui/pagination";
import KreirajKorisnika from "./KreirajKorisnika";
import { Input } from "./ui/input";
import { dajKorisnikaIzTokena } from "@/lib/auth";
import PromenaPodatakaKorisnika from "./PromenaPodatakaKorisnika";
import { useTranslations } from "next-intl";

interface myProps {
    title: string;
}

const KorisniciTable = ({ title }: myProps) => {
    const t = useTranslations('korisnici');
    const [tabelaStavke, setTabelaStavke] = useState<any[]>([]);
    const [pretraga, setPretraga] = useState("");
    const [trenutnaStrana, setTrenutnaStrana] = useState(1);
    const korisnikaPoStrani = 10;
    const [partner, setPartner] = useState<KorisnikPodaciType>();
    const [idPartner, setIdPartner] = useState<string>();

    // useEffect(() => {
    //     const korisnik = dajKorisnikaIzTokena();
    //     setPartner(korisnik);
    //     if (!partner) return;

    //     const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;

    //     const fetchPartneri = async () => {
    //         try {
    //             const res = await fetch(`${apiAddress}/api/Partner/DajPartnerKorisnike?Partner=${partner}`);
    //             const data = await res.json();
    //             setTabelaStavke(data);
    //         } catch (err) {
    //             console.error("Greška pri dobijanju podataka:", err);
    //         }
    //     };

    //     fetchPartneri();
    // }, [partner]);

    // ...existing code...
    useEffect(() => {
        const korisnik = dajKorisnikaIzTokena();
        if (!korisnik) return; // avoids passing null

        setIdPartner(String(korisnik.idKorisnika));

        const fetchPartner = async () => {
            try {
                const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
                const res = await fetch(`${apiAddress}/api/Partner/DajPartnerKorisnike?Partner=${korisnik.partner}`);
                if (!res.ok) throw new Error("Failed to fetch partner");
                const data = await res.json();
                setTabelaStavke(data);


                const response = await fetch(`${apiAddress}/api/Partner/DajPartnere?idPartnera=${korisnik.partner}&idKorisnika=${korisnik.idKorisnika}`);
                const partner_data = await response.json();
                setPartner(partner_data[0]);
            } catch (err) {
                console.error(err);
            }
        };

        fetchPartner();
    }, []); // run once
// ...existing code...



    // useEffect(() => {
    //     const korisnik = dajKorisnikaIzTokena();
    //     if (!korisnik) return;

    //     setIdPartner(String(korisnik.idKorisnika));

    //     const fetchPartner = async () => {
    //         try {
    //             const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
    //             const res = await fetch(`${apiAddress}/api/Partner/DajPartnere?idPartnera=${korisnik.partner}&idKorisnika=${korisnik.idKorisnika}`);
    //             if (!res.ok) {
    //                 console.error("Failed to fetch partner");
    //                 return;
    //             }
    //             const data = await res.json();
    //             const fullPartner = Array.isArray(data) ? data[0] : data;
    //             // fullPartner should match KorisnikPodaciType
    //             setPartner(fullPartner);
    //         } catch (err) {
    //             console.error("Greška pri dobijanju partnera:", err);
    //         }
    //     };

    //     fetchPartner();
    // }, []);


    const getAdresa = (lokacijaSifra: string) => {
        return partner?.partnerDostava?.find(
            (d) => d.sifra === lokacijaSifra
        )?.adresa;
    };



    const filtriraniKorisnici = tabelaStavke.filter((korisnik) =>
        korisnik.korisnickoIme.toLowerCase().includes(pretraga.toLowerCase()) ||
        korisnik.email.toLowerCase().includes(pretraga.toLowerCase())
    );

    const trenutniBrojKorisnika = filtriraniKorisnici.slice(
        (trenutnaStrana - 1) * korisnikaPoStrani,
        trenutnaStrana * korisnikaPoStrani
    );

    return (
        <div className="mt-2 flex flex-col gap-2 lg:gap-4">
            <div className="flex justify-between items-center w-full px-2 lg:px-4 flex-wrap">
                <h1 className="font-bold text-3xl text-center">{t('Korisnici')}</h1>
                {/* prevedi naslov */}
                <div className="flex gap-2">
                    <Input
                        type="text"
                        placeholder={t('Pretraga korisnika')}
                        className="border-2"
                        value={pretraga}
                        onChange={(e) => setPretraga(e.target.value)}
                    />
                    <KreirajKorisnika partner={partner} />
                </div>
            </div>

            <div className="w-full overflow-x-auto">
                <Table className="min-w-full">
                    <TableHeader className="bg-gray-400 hover:bg-gray-400">
                        <TableRow>
                            <TableHead className="text-xl">{t('Promeni korisnika')}</TableHead>
                            <TableHead className="text-xl">{t('Korisničko ime')}</TableHead>
                            <TableHead className="text-xl">{t('E-mail')}</TableHead>
                            <TableHead className="text-xl">{t('Telefon')}</TableHead>
                            <TableHead className="text-xl">{t('Lokacija')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trenutniBrojKorisnika.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    {t('Nema registrovanih korisnika')}
                                </TableCell>
                            </TableRow>
                        ) : (
                            trenutniBrojKorisnika.map((stavka) => (
                                <TableRow key={stavka.idKorisnika}>
                                    <TableCell>
                                        {partner &&
                                        <PromenaPodatakaKorisnika korisnik={stavka} partner={partner} />
                                        }
                                    </TableCell>
                                    <TableCell>{stavka.korisnickoIme}</TableCell>
                                    <TableCell>{stavka.email}</TableCell>
                                    <TableCell>{stavka.telefon}</TableCell>
                                    <TableCell>
                                        {getAdresa(stavka.lokacija) || "Sve lokacije"}
                                    </TableCell>

                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Pagination
                totalItems={filtriraniKorisnici.length}
                itemsPerPage={korisnikaPoStrani}
                currentPage={trenutnaStrana}
                onPageChange={setTrenutnaStrana}
            />
        </div>
    );
};

export default KorisniciTable;
