    'use client';

    import { useEffect, useState } from "react";
    import KreirajNarudzbenicu from "@/components/ui/KreirajNarudzbenicu";
    import { AritkalKorpaType  } from "@/types/artikal";
    import { ComboboxAdrese } from "@/components/ui/ComboboxAdrese";
    import { Input } from "@/components/ui/input";
    import { LocationEdit } from "lucide-react";


    const DokumentUpis = () => {
        const [artikli, setArtikli] = useState<AritkalKorpaType[]>([]);
        const [partner, setPartner] = useState<KorisnikPodaciType>();
        const [minCena, setMinCena] = useState<number>(0);

        const imageUrl = '/images';

        const [mestoIsporuke, setMestoIsporuke] = useState("");
        const [napomena, setNapomena] = useState("");
        const [ukupnaCenaSaPDV, setUkupnaCenaSaPDV] = useState<number>(0);

        useEffect(() => {
            const local = localStorage.getItem("WEBParametrizacija");
            if (local) {
            const parsed = JSON.parse(local);
            const parsedMinCena = parsed.find((p: any) => p.naziv === "MinCenaZaBesplatnuDostavu")?.vrednost;
            
            if (parsedMinCena) {
                const minCena = parseFloat(parsedMinCena);
                if(!isNaN(minCena)) {
                setMinCena(minCena);
                }        
            }
            }
        }, []);

        const dostava = 1000;

        const pravaDostava = ukupnaCenaSaPDV >= minCena ? 0 : dostava;
        const ukupnoSaDostavom = ukupnaCenaSaPDV + pravaDostava;

        

    useEffect(() => {

        const korpaPodaciString = sessionStorage.getItem("korpaPodaci");
        if (!korpaPodaciString) return;

        const korpaPodaci = JSON.parse(korpaPodaciString);
        setPartner(korpaPodaci.partner);
        setArtikli(korpaPodaci.artikli);
        setUkupnaCenaSaPDV(korpaPodaci.ukupnaCenaSaPDV);

    }, []);

    useEffect(() => {
        if (ukupnaCenaSaPDV === 0) return;

        sessionStorage.setItem("dostava", JSON.stringify(dostava));
        sessionStorage.setItem("ukupnoSaDostavom", JSON.stringify(ukupnoSaDostavom));
    }, [ukupnaCenaSaPDV, dostava, ukupnoSaDostavom]);



    return (
        <div className="flex flex-col gap-5 p-4 min-w-[320px]">
            <div className="flex flex-col gap-5">


                {/* PODACI O LJUDIMA */}
                <div className="mb-4 space-y-1 w-full">
                    <div className="flex flex-col max-w-[1200px] mx-auto">
                        
                            {/* KOMERCIJALISTA */}
                        <div className="flex flex-col items-center">
                            <div className="flex justify-center items-center gap-2 w-full">
                                <LocationEdit className="w-6 h-6 shrink-0"/>
                                {/* ovaj LocationEdit, samo kada se dovoljno smanji ekran samo nestane, zasto je to tako?? */}
                                <ComboboxAdrese
                                    dostavaList={partner?.partnerDostava ?? []}
                                    onSelectOption={(adresa) => {
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
                        {artikli.map((artikal) => {
                            const fotografijaProizvoda = `${imageUrl}/s${artikal.idArtikla}.jpg`;
                            return (
                                <div
                                    key={artikal.idArtikla}
                                    className="w-full flex items-center gap-4 border-1 p-2 rounded-lg shadow-sm max-h-[500px]"
                                >
                                    <img
                                        src={fotografijaProizvoda}
                                        alt={artikal.naziv}
                                        className="w-16 h-16 object-cover"
                                    />
                                    <div className="flex flex-col lg:flex-col w-full">
                                            <p className="flex font-semibold text-lg">{artikal.naziv}</p>
                                            {/* <p className="text-red-500 text-xl whitespace-nowrap md:hidden lg:hidden block">{(artikal.pravaCena).toLocaleString("sr-RS")} RSD</p> */}
                                            {artikal.IznosSaPDV !== undefined && (
                                                <p className="text-red-500 text-xl whitespace-nowrap md:hidden lg:hidden block">
                                                    {artikal.IznosSaPDV.toLocaleString("sr-RS")} RSD
                                                </p>
                                            )}

                                        <div className="flex flex-col lg:flex-row gap-1 justify-between text-gray-400 max-w-[400px] text-sm">
                                            <p>Šifra: {artikal.idArtikla}</p>
                                            <p>Količina: {artikal.kolicina}</p> 
                                            {artikal.koriscenaCena !== undefined && (
                                                <p>Cena: {artikal.koriscenaCena.toLocaleString("sr-RS")} RSD</p>
                                            )}
                                            
                                            <p>PDV: 20%</p>
                                            {/* <p>Pakovanje: {artikal.pakovanje}</p> */}
                                        </div>
                                    </div>
                                    {artikal.IznosSaPDV !== undefined && ( 
                                        <p className="text-red-500 text-xl whitespace-nowrap hidden md:block lg:block">{(artikal.IznosSaPDV).toLocaleString("sr-RS")} RSD</p>
                                    )}
                                </div>
                            );
                            })}
                        </div>
                    )}
                    <div className="flex flex-col w-full min-h-[40px] items-end p-2">
                        <div className="max-w-[400px] w-full">
                            <div className="flex items-center justify-between">
                                <p className="font-medium">{pravaDostava > 0
                                                            ? `Ukupno`
                                                            : ""}
                                </p>
                                <p className="text-gray-500">
                                    {pravaDostava > 0
                                        ? `${ukupnaCenaSaPDV.toLocaleString("sr-RS")} RSD`
                                        : ""}
                                </p>
                            </div>
                            
                            <div className="flex items-center justify-between text-base">
                                <p className="font-medium">Dostava:</p>
                                <p className="text-right text-gray-500">
                                    {pravaDostava > 0
                                                ? `${pravaDostava.toLocaleString("sr-RS")} RSD`
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
            </div>


            {/* NARUCI DUGME */}
            <div className="pt-5 flex justify-end">
                {partner && (
                    <KreirajNarudzbenicu
                        artikli={artikli}
                        partner={partner}
                        mestoIsporuke={mestoIsporuke}
                        napomena={napomena}
                        disabled={mestoIsporuke.trim() === ""}
                    />
                )}
            </div>
        </div>
    );
    };

    export default DokumentUpis;
