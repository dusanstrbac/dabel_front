    'use client';

    import { useRef } from "react";
    import { KeyboardEvent, RefObject } from "react";
    import { useEffect, useState } from "react";
    import { dajKorisnikaIzTokena } from "@/lib/auth";
    import { Input } from "@/components/ui/input";
    import KreirajNarudzbenicu from "@/components/ui/KreirajNarudzbenicu";
    import { ArtikalType } from "@/types/artikal";

    


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


        const [idDokumenta, setIdDokumenta] = useState<number>(0);

        const [greske, setGreske] = useState<{ [key: string]: string }>({});
        const imeRef = useRef<HTMLInputElement>(null);
        const emailRef = useRef<HTMLInputElement>(null);
        const gradRef = useRef<HTMLInputElement>(null);
        const telefonRef = useRef<HTMLInputElement>(null);
        const adresaRef = useRef<HTMLInputElement>(null);
        const napomenaRef = useRef<HTMLInputElement>(null);

        const handleKeyDown = (
            e: KeyboardEvent<HTMLInputElement>,
            nextRef: RefObject<HTMLInputElement | null>
        ) => {
            if (e.key === "Enter" || e.key === "Return") {
                e.preventDefault();
                nextRef.current?.focus();
            }
        };

        const proveriPolja = () => {
            const novaGreske: { [key: string]: string } = {};

            if (!email.trim()) novaGreske.email = "Niste uneli e-mail";
            if (!telefon.trim()) novaGreske.telefon = "Niste uneli Telefon";
            if (!grad.trim()) novaGreske.grad = "Niste uneli Grad";
            if (!imeiPrezime.trim()) novaGreske.imeiPrezime = "Niste uneli Ime i Prezime";
            if (!mestoIsporuke.trim()) novaGreske.mestoIsporuke = "Niste uneli Adresu"; //adresa

            setGreske(novaGreske);
            return Object.keys(novaGreske).length === 0;
        };
        

        useEffect(() => {
            setIsClient(true);

            let cart: Record<string, any> = {};
            try {
                const storedCart = localStorage.getItem("cart");
                cart = storedCart ? JSON.parse(storedCart) : {};
            } catch (e) {
                console.error("Nevalidan JSON u localStorage za 'cart'", e);
            }

            const storedIds = Object.keys(cart);
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
                    kolicina: cart[artikal.idArtikla]?.kolicina,
                }));

                console.log("Dobijeni artikli: ", transformed);

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
                    const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
                    const res = await fetch(`${apiAddress}/api/Partner/DajPartnere?email=${email}`);
                    const data = await res.json();
                    setPartner(data[0]);

                    console.log("Dobijeni partner: ", data);

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
        }, []);

    if (!isClient) return null;

    return (
        <div className="flex flex-col gap-5 p-4 min-w-[320px]">
            <div className="flex flex-col gap-5">


                {/* PODACI O LJUDIMA */}
                <div className="mb-4 space-y-1 w-full">
                    <div className="flex flex-col max-w-[1200px] mx-auto">
                        
                            {/* OSOBA */}
                        <div className="flex flex-col w-full">
                            <h1 className="text-center font-light text-2xl border-b pb-2">Podaci o kontakt osobi</h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="flex flex-col">
                                    <label className="font-semibold mb-1">Ime i prezime</label>
                                    <Input
                                        ref={imeRef}
                                        type="text"
                                        value={imeiPrezime}
                                        onChange={(e) => setImeiPrezime(e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, emailRef)}
                                        placeholder="Unesite ime i prezime"
                                        className={`w-full border rounded p-2 ${greske.imeiPrezime ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    {greske.imeiPrezime && (
                                        <p className="text-red-500 text-sm mt-1">{greske.imeiPrezime}</p>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <label className="font-semibold mb-1">E-mail</label>
                                    <Input
                                        ref={emailRef}
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, gradRef)}
                                        placeholder="Unesite email adresu"
                                        className={`w-full border rounded p-2 ${greske.email ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    {greske.email && (
                                        <p className="text-red-500 text-sm mt-1">{greske.email}</p>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <label className="font-semibold mb-1">Grad</label>
                                    <Input
                                        ref={gradRef}
                                        type="text"
                                        value={grad}
                                        onChange={(e) => setGrad(e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, telefonRef)}
                                        placeholder="Unesite grad"
                                        className={`w-full border rounded p-2 ${greske.grad ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    {greske.grad && (
                                        <p className="text-red-500 text-sm mt-1">{greske.grad}</p>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <label className="font-semibold mb-1">Telefon</label>
                                    <Input
                                        ref={telefonRef}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={telefon}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const numeric = value.replace(/\D/g, "");
                                            setTelefon(numeric);
                                    }}
                                        onKeyDown={(e) => handleKeyDown(e, adresaRef)}
                                        placeholder="Unesite broj telefona"
                                        className={`w-full border rounded p-2 ${greske.telefon ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    {greske.telefon && (
                                        <p className="text-red-500 text-sm mt-1">{greske.telefon}</p>
                                    )}
                                </div>

                                <div className="flex flex-col md:col-span-2">
                                    <label className="font-semibold mb-1">Adresa isporuke</label>
                                    <Input
                                        ref={adresaRef}
                                        type="text"
                                        value={mestoIsporuke}
                                        onChange={(e) => setMestoIsporuke(e.target.value)}
                                        placeholder="Unesite adresu"
                                        className={`w-full border rounded p-2 ${greske.mestoIsporuke ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    {greske.mestoIsporuke && (
                                        <p className="text-red-500 text-sm mt-1">{greske.mestoIsporuke}</p>
                                    )}
                                </div>

                                <div className="flex flex-col md:col-span-2">
                                    <label className="font-semibold mb-1">Napomena</label>
                                    <Input
                                        ref={napomenaRef}
                                        type="text"
                                        value={napomena}
                                        onChange={(e) => setNapomena(e.target.value)}
                                        placeholder="Unesite adresu"
                                        className={`w-full border rounded p-2 "border-gray-300"`}
                                    />
                                </div>
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
                                            <p className="text-red-500 text-lg whitespace-nowrap md:hidden lg:hidden block">Cena: {(artikal.artikalCene[0].akcija.cena && artikal.artikalCene[0].akcija.cena > 0 
                                                                                                                                                                            ? artikal.artikalCene[0].akcija.cena 
                                                                                                                                                                            : artikal.artikalCene[0].cena)} RSD</p>
                                        <div className="flex flex-col lg:flex-row gap-1 justify-between text-gray-400 max-w-[300px] text-sm">
                                            <p>Šifra: {artikal.idArtikla}</p>
                                            <p>Količina: {artikal.kolicina}</p> 
                                            {/* <p>Pakovanje: {artikal.pakovanje}</p> */}
                                        </div>
                                    </div>
                                    <p className="text-red-500 text-lg whitespace-nowrap hidden md:block lg:block">Cena: {(artikal.artikalCene[0].akcija.cena && artikal.artikalCene[0].akcija.cena > 0 
                                                                                                                                                                            ? artikal.artikalCene[0].akcija.cena 
                                                                                                                                                                            : artikal.artikalCene[0].cena)} RSD</p>
                                </div>
                            ))}
                        </div>
                    )}
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
                        valid={proveriPolja}
                        napomena={napomena}
                    />
                )}
            </div>
        </div>
    );
    };

    export default DokumentUpis;
