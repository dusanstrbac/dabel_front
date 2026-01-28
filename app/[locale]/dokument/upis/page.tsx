'use client';

import { useEffect, useState } from "react";
import KreirajNarudzbenicu from "@/components/ui/KreirajNarudzbenicu";
import { AritkalKorpaType } from "@/types/artikal";
import { ComboboxAdrese } from "@/components/ui/ComboboxAdrese";
import { Input } from "@/components/ui/input";
import { LocationEdit } from "lucide-react";
import { useTranslations } from "next-intl";

const DokumentUpis = () => {
  const [artikli, setArtikli] = useState<AritkalKorpaType[]>([]);
  const [partner, setPartner] = useState<KorisnikPodaciType>();
  const [minCena, setMinCena] = useState<number>(0);
  const [dostava] = useState<number>(1000);

  const [mestoIsporuke, setMestoIsporuke] = useState("");
  const [sifraIsporuke, setSifraIsporuke] = useState("");
  const [napomena, setNapomena] = useState("");
  const [ukupnaCenaSaPDV, setUkupnaCenaSaPDV] = useState<number>(0);

  const t = useTranslations();

  useEffect(() => {
    const local = localStorage.getItem("webparametri");
    if (!local) return;

    try {
      const parsed = JSON.parse(local);
      const minCenaRaw = parsed.find((p: any) => p.naziv === "MinCenaZaBesplatnuDostavu")?.vrednost;
      const parsedMinCena = parseFloat(minCenaRaw);

      if (!isNaN(parsedMinCena)) setMinCena(parsedMinCena);
    } catch (err) {
      console.error("Greška prilikom parsiranja webparametara:", err);
    }
  }, []);

  useEffect(() => {
    const korpaPodaciString = sessionStorage.getItem("korpaPodaci");
    if (!korpaPodaciString) return;

    const korpaPodaci = JSON.parse(korpaPodaciString);
    setPartner(korpaPodaci.partner);
    setArtikli(korpaPodaci.artikli);
    setUkupnaCenaSaPDV(korpaPodaci.ukupnaCenaSaPDV);

    // Ako ima adresa, postavi prvu kao default prikaz
    if (korpaPodaci.partner?.partnerDostava?.length > 0) {
      setMestoIsporuke(korpaPodaci.partner.partnerDostava[0].adresa);
      setSifraIsporuke(korpaPodaci.partner.partnerDostava[0].sifra);
    }
  }, []);

  // ✅ OVDJE je prava logika za "partner.lokacija"
  useEffect(() => {
    if (!partner) return;

    if (partner.lokacija && partner.lokacija.trim() !== "") {
      // ako partner već ima lokaciju (šifru), koristi je
      setSifraIsporuke(partner.lokacija);
    } else {
      // ako nema, a postoji izabrana adresa, nemoj da pregaziš
      // (ovo ostaje iz combobox-a / default adrese)
    }
  }, [partner]);

  const pravaDostava = ukupnaCenaSaPDV >= minCena ? 0 : dostava;
  const ukupnoSaDostavom = ukupnaCenaSaPDV + pravaDostava;

  useEffect(() => {
    if (ukupnaCenaSaPDV === 0) return;

    sessionStorage.setItem("dostava", JSON.stringify(dostava));
    sessionStorage.setItem("ukupnoSaDostavom", JSON.stringify(ukupnoSaDostavom));
  }, [ukupnaCenaSaPDV, dostava, ukupnoSaDostavom]);

  const koristiPartnerLokaciju = !!(partner?.lokacija && partner.lokacija.trim() !== "");

  return (
    <div className="flex flex-col gap-5 p-4 min-w-[320px]">
      <div className="flex flex-col gap-5">
        <div className="mb-4 space-y-1 w-full">
          <div className="flex flex-col max-w-[1200px] mx-auto">
            <div className="flex flex-col items-center">
              <div className="flex justify-center items-center gap-2 w-full">
                <LocationEdit className="w-6 h-6 shrink-0" />

                {koristiPartnerLokaciju ? (
                  <p className="font-medium">{mestoIsporuke}</p>
                ) : (
                  <ComboboxAdrese
                    dostavaList={partner?.partnerDostava ?? []}
                    onSelectOption={(adresa) => {
                      setMestoIsporuke(adresa.adresa);
                      setSifraIsporuke(adresa.sifra);
                    }}
                    defaultValue={mestoIsporuke}
                  />
                )}
              </div>

              <div className="flex flex-col md:col-span-2 w-full max-w-[600px] mt-5">
                <label className="font-semibold mb-1">{t('dokumentUpis.Napomena')}</label>
                <Input
                  type="text"
                  value={napomena}
                  onChange={(e) => setNapomena(e.target.value)}
                  placeholder={t('dokumentUpis.Unesite napomenu')}
                  className="w-full border rounded-md p-2 border-gray-300"
                />
              </div>
            </div>

            <div className="flex flex-col w-full mt-8">
              <h1 className="text-center font-light text-2xl border-b pb-2">
                {t('dokumentUpis.Podaci o partneru')}
              </h1>

              <div className="flex flex-col sm:flex-row items-center justify-between w-full px-5 my-8 ">
                <div>
                  <p><strong>{t('dokumentUpis.Partner ID')}</strong> {partner?.idPartnera}</p>
                  <p><strong>{t('dokumentUpis.Naziv')}</strong> {partner?.ime}</p>
                  <p><strong>{t('dokumentUpis.PIB')}</strong> {partner?.pib}</p>
                  <p><strong>{t('dokumentUpis.Matični broj')}</strong> {partner?.maticniBroj}</p>
                  <p><strong>{t('dokumentUpis.Email')}</strong> {partner?.email}</p>
                </div>
                <div>
                  <p><strong>{t('dokumentUpis.Adresa')}</strong> {partner?.adresa}</p>
                  <p><strong>{t('dokumentUpis.Grad')}</strong> {partner?.grad}</p>
                  <p><strong>{t('dokumentUpis.ZIP')}</strong> {partner?.zip}</p>
                  <p><strong>{t('dokumentUpis.Telefon')}</strong> {partner?.telefon}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="pt-5 flex justify-end">
        {partner && (
          <KreirajNarudzbenicu
            artikli={artikli}
            partner={partner}
            mestoIsporuke={sifraIsporuke}
            napomena={napomena}
            dostava={pravaDostava}
            disabled={mestoIsporuke.trim() === ""}
          />
        )}
      </div>
    </div>
  );
};

export default DokumentUpis;
