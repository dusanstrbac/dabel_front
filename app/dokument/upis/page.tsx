    'use client';

    import { useMemo, useRef } from "react";
    import { KeyboardEvent, RefObject } from "react";
    import { useEffect, useState } from "react";
    import { dajKorisnikaIzTokena } from "@/lib/auth";
    import KreirajNarudzbenicu from "@/components/ui/KreirajNarudzbenicu";
    import { ArtikalType } from "@/types/artikal";
    import { ComboboxAdrese } from "@/components/ui/ComboboxAdrese";
    import { Input } from "@/components/ui/input";
import { LocationEdit } from "lucide-react";


    const DokumentUpis = () => {
        const [artikli, setArtikli] = useState<ArtikalType[]>([]);
        const [isClient, setIsClient] = useState(false);
        const [partner, setPartner] = useState<KorisnikPodaciType>();


        const [mestoIsporuke, setMestoIsporuke] = useState("");
        const [imeiPrezime, setImeiPrezime] = useState("");
        const [grad, setGrad] = useState("");
        const [telefon, setTelefon] = useState("");
        const [email, setEmail] = useState("");
        const [napomena, setNapomena] = useState("");

        const [cart, setCart] = useState<Record<string, { kolicina: number }>>({});

        const [idDokumenta, setIdDokumenta] = useState<number>(0);
        const [ukupnaCenaSaPDV, setUkupnaCenaSaPDV] = useState<number>(0);

        // const proveriPolja = () => {
        //     const novaGreske: { [key: string]: string } = {};

        //     if (!email.trim()) novaGreske.email = "Niste uneli e-mail";
        //     if (!telefon.trim()) novaGreske.telefon = "Niste uneli Telefon";
        //     if (!grad.trim()) novaGreske.grad = "Niste uneli Grad";
        //     if (!imeiPrezime.trim()) novaGreske.imeiPrezime = "Niste uneli Ime i Prezime";
        //     if (!mestoIsporuke.trim()) novaGreske.mestoIsporuke = "Niste uneli Adresu"; //adresa

        //     return Object.keys(novaGreske).length === 0;
        // };

        // const ukupnaCenaArtikala = useMemo(() => {
        //     return artikli.reduce((suma, artikal) => {
        //         const cena = artikal.artikalCene[0].akcija.cena && artikal.artikalCene[0].akcija.cena > 0
        //             ? artikal.artikalCene[0].akcija.cena
        //             : artikal.artikalCene[0].cena;
        //         return suma + (cena * (cart[artikal.idArtikla]?.kolicina || 1));
        //     }, 0);
        // }, [artikli]);

        const dostava = ukupnaCenaSaPDV >= 10000 ? 0 : 1000;
        const ukupnoSaDostavom = ukupnaCenaSaPDV + dostava;

        

        useEffect(() => {
            setIsClient(true);

            try {
            
            const storedCart = localStorage.getItem("cart");
            const parsedCart = storedCart ? JSON.parse(storedCart) : {};
            setCart(parsedCart);

            const parsedPartner = JSON.parse(sessionStorage.getItem("partner") || "null");
            if (parsedPartner) {
                setPartner(parsedPartner);
            } else {
                console.warn("Partner nije pronadjen u sesiji");
            }

            
            const ukupnaCenaSaPDV = sessionStorage.getItem("ukupnaCenaSaPDV");


            if (ukupnaCenaSaPDV){
                setUkupnaCenaSaPDV(Number(ukupnaCenaSaPDV));
            }
            const storedIds = Object.keys(parsedCart);
            const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;


            const fetchArtikli = async () => {
                if (storedIds.length === 0) return;

                const queryString = storedIds.map(id => `ids=${id}`).join("&");
                const url = `${apiAddress}/api/Artikal/DajArtikalId?${queryString}`;

                try {
                const response = await fetch(url);
                const data = await response.json();


                const transformed = data.map((artikal: ArtikalType) => ({
                    ...artikal,
                    id: artikal.idArtikla,
                    naziv: artikal.naziv,
                    cena: artikal.artikalCene[0].akcija.cena ?? 0,  
                    originalnaCena: artikal.artikalCene[0].cena,
                    // pdv: artikal.pdv ?? 20,
                    //OVO MORA DA SE VIDI
                    kolicina: parsedCart[artikal.idArtikla]?.kolicina,
                }));

                setArtikli(transformed);
                } catch (err) {
                    console.error("Greška pri učitavanju artikala:", err);
                }
            };

            const fetchPartner = async () => {
                const korisnik = dajKorisnikaIzTokena();
                if (!korisnik) {
                    console.warn("Nema korisnika iz tokena.");
                    return;
                }

                const email = korisnik.email;

                try {
                    const res = await fetch(`${apiAddress}/api/Partner/DajPartnere?email=${email}`);
                    const data = await res.json();
                    setPartner(data[0]);

                    
                } catch (err) {
                    console.error("Greška pri fetchovanju partnera:", err);
                }
            };

            // Generisanje novog ID-ja
            const poslednjiId = parseInt(localStorage.getItem("poslednjiIdDokumenta") || "0", 10);
            const noviId = poslednjiId + 1;
            setIdDokumenta(noviId);
            

            fetchArtikli();
            fetchPartner();
            } catch (e) {
                console.error("Nevalidan JSON u localStorage za 'cart'", e);
            }
        }, []);


    const rabat = useMemo(() => {
        const vrednost = partner?.partnerRabat?.rabat ?? 1;
        return 1 - vrednost / 100;
    }, [partner]);


    if (!isClient) return null;
    return (
        <div className="flex flex-col gap-5 p-4 min-w-[320px]">
            <div className="flex flex-col gap-5">


                {/* PODACI O LJUDIMA */}
                <div className="mb-4 space-y-1 w-full">
                    <div className="flex flex-col max-w-[1200px] mx-auto">
                        
                            {/* KOMERCIJALISTA */}
                        <div className="flex flex-col items-center">
                            <div className="flex justify-center items-center gap-2 w-full">
                                <LocationEdit className=""/>
                                <ComboboxAdrese
                                    dostavaList={partner?.partnerDostava ?? []}
                                    onSelectOption={(adresa) => {
                                        console.log("Izabrana adresa:", adresa);
                                        setMestoIsporuke(adresa.adresa);
                                    }}
                                />
                            </div>

                            <div className="flex flex-col md:col-span-2 w-full max-w-[600px] mt-5">
                                <label className="font-semibold mb-1">Napomena</label>
                                <Input
                                    type="text"
                                    value={napomena}
                                    onChange={(e) => setNapomena(e.target.value)}
                                    placeholder="Unesite napomenu"
                                    className={`w-full border rounded-md p-2 "border-gray-300"`}
                                />
                            </div>
                        </div>


                        <div className="flex flex-col w-full mt-8">
                            <h1 className="text-center font-light text-2xl border-b pb-2">Podaci o partneru</h1>
                            {/* PARTNER */}
                            <div className="flex flex-col sm:flex-row items-center justify-between w-full px-5 my-8 ">
                                <div>
                                    <p><strong>Partner ID:</strong> {partner?.idPartnera}</p>
                                    <p><strong>Naziv:</strong> {partner?.ime}</p>
                                    <p><strong>PIB:</strong> {partner?.pib}</p>
                                    <p><strong>Matični broj:</strong> {partner?.maticniBroj}</p>
                                    <p><strong>Email:</strong> {partner?.email}</p>
                                </div>
                                <div>
                                    <p><strong>Adresa:</strong> {partner?.adresa}</p>
                                    <p><strong>Grad:</strong> {partner?.grad}</p>
                                    <p><strong>ZIP:</strong> {partner?.zip}</p>
                                    <p><strong>Delatnost:</strong> {partner?.delatnost}</p>
                                    <p><strong>Telefon:</strong> {partner?.telefon}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ARTIkLI */}
                <div className="flex flex-col w-full gap-4">
                    {artikli.length === 0 ? (
                        <p className="italic">Nema artikala u korpi.</p>
                    ) : (
                        <div className="flex flex-col max-h-[550px] overflow-y-auto pr-2 gap-5 ">
                        {artikli.map((artikal) => (
                                <div
                                    key={artikal.idArtikla}
                                    className="w-full flex items-center gap-4 border-1 p-1 rounded shadow-sm max-h-[500px]"
                                >
                                    <img
                                        src="/artikal.jpg"
                                        alt={artikal.naziv}
                                        className="w-16 h-16 object-cover"
                                    />
                                    <div className="flex flex-col lg:flex-col w-full">
                                            <p className="flex font-semibold text-lg">{artikal.naziv}</p>
                                            <p className="text-red-500 text-xl whitespace-nowrap md:hidden lg:hidden block">{((artikal.artikalCene[0].akcija.cena > 0 
                                                                                                                                                                        ? artikal.artikalCene[0].akcija.cena 
                                                                                                                                                                        : artikal.artikalCene[0].cena) * 1.2 * rabat * (cart[artikal.idArtikla].kolicina)).toLocaleString("sr-RS")} RSD</p>
                                        <div className="flex flex-col lg:flex-row gap-1 justify-between text-gray-400 max-w-[400px] text-sm">
                                            <p>Šifra: {artikal.idArtikla}</p>
                                            <p>Količina: {artikal.kolicina}</p> 
                                            <p>Cena: {(artikal.artikalCene[0].akcija.cena > 0 
                                                                                        ? artikal.artikalCene[0].akcija.cena
                                                                                        : artikal.artikalCene[0].cena).toLocaleString("sr-RS")} RSD</p>
                                            <p>PDV: 20%</p>
                                            {/* <p>Pakovanje: {artikal.pakovanje}</p> */}
                                        </div>
                                    </div>
                                    <p className="text-red-500 text-xl whitespace-nowrap hidden md:block lg:block">{((artikal.artikalCene[0].akcija.cena > 0 
                                                                                                                                                                ? artikal.artikalCene[0].akcija.cena  
                                                                                                                                                                : artikal.artikalCene[0].cena)* 1.2 * rabat *(cart[artikal.idArtikla].kolicina)).toLocaleString("sr-RS")} RSD</p>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex flex-col w-full min-h-[40px]">
                        <div className="flex items-center justify-between">
                            <p className="font-medium">{dostava > 0
                                                        ? `Ukupno`
                                                        : ""}
                            </p>
                            <p className="text-gray-500">
                                {dostava > 0
                                    ? `${ukupnaCenaSaPDV.toLocaleString("sr-RS")} RSD`
                                    : ""}
                            </p>
                            
                            {/* Hocu da ako postoji */}
                        </div>

                        <div className="flex items-center justify-between text-base">
                            <p className="font-medium">Dostava:</p>
                            <p className="text-right text-gray-500">
                                {dostava > 0
                                            ? `${dostava.toLocaleString("sr-RS")} RSD`
                                            : "Besplatna dostava"}
                            </p>
                        </div>
                        
                        <div className="flex items-center justify-between text-lg font-bold mt-2">
                            <p>Ukupno:</p>
                            <p className="text-2xl">{ukupnoSaDostavom.toLocaleString("sr-RS")} RSD</p>
                        </div>
                    </div>
                </div>
            </div>


            {/* NARUCI DUGME */}
            <div className="pt-5 flex justify-end">
                {partner && (
                    <KreirajNarudzbenicu
                        artikli={artikli}
                        idDokumenta={idDokumenta}
                        partner={partner}
                        //inputi
                        imeiPrezime={imeiPrezime}
                        mestoIsporuke={mestoIsporuke}
                        grad={grad}
                        telefon={telefon}
                        email={email}
                        // valid={proveriPolja}
                        napomena={napomena}
                    />
                )}
            </div>
        </div>
    );
    };

    export default DokumentUpis;
