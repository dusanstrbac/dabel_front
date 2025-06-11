import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./button";
import { ComboboxArtikli } from "./ComboboxArtikli";

type artikalProp = {
  idArtikla: string;
  naziv: string;
  barkod: string;
  jm: string;
};

const PromeniButton = ({
  artikal,
  articleList,
  onArtikalPromenjen,
  iskljuceniArtikli,
}: {
  artikal: artikalProp;
  articleList: artikalProp[];
  onArtikalPromenjen: (stariId: string, novi: artikalProp) => void;
  iskljuceniArtikli: artikalProp[];
}) => {
  const [localArticleList, setLocalArticleList] = useState<artikalProp[]>([]);
  const [selectedArtikal, setSelectedArtikal] = useState<artikalProp | null>(null);

  console.log("🌀 PromeniButton renderovan");

  useEffect(() => {
    console.log("📦 useEffect: articleList promenjen, upisujem u lokalni state...");
    setLocalArticleList(articleList);
  }, [articleList]);

  useEffect(() => {
    console.log("🔁 PromeniButton se ponovo renderovao");
  });

  // Filtriraj artikle koji su već u upotrebi, osim trenutnog
  const dostupniArtikli = localArticleList.filter((a) => {
    const isAlreadyUsed =
      iskljuceniArtikli.some(
        (used) =>
          used.idArtikla === a.idArtikla &&
          used.idArtikla !== artikal.idArtikla
      );
    return !isAlreadyUsed;
  });

  return (
    <Dialog
      onOpenChange={(open) => {
        console.log(`📍 Dialog ${open ? "otvoren" : "zatvoren"}`);
        if (open) {
          console.log("✅ Kliknuto na dugme 'Promeni'");
        }
      }}
    >
      <DialogTrigger asChild>
        <button
          onClick={() => console.log("🖱 Klik na <Promeni> dugme")}
          className="flex items-center justify-center mr-15 mx-4 my-2 w-[150px] h-[40px] border-2 rounded-md text-lg hover:bg-gray-100 cursor-pointer"
        >
          Promeni
        </button>
      </DialogTrigger>

      <DialogContent className="flex flex-col min-w-[700px] max-w-[1000px] boder-2 border-amber-800"> 
        {/* hocu da ovaj dialogContent malo prosirim u sirinu da bi on ispao lepsi */}
        <DialogHeader>
          <DialogTitle>Izaberite artikals</DialogTitle>
          <DialogDescription className="w-[800px]">
            Odaberite artikal koji želite da zamenite
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <ComboboxArtikli
            articleList={dostupniArtikli}
            onSelectOption={(artikal) => {
              console.log("🔽 Combobox: izabran artikal:", artikal);
              setSelectedArtikal(artikal);
            }}
            placeholder="Pretraži artikle"
            currentArtikalId={artikal.idArtikla}
          />
          <div className="flex justify-between">
            <Button
              className="min-w-[100px]"
              onClick={() => {
                console.log("❌ Kliknuto na 'Odbaci'");
                setSelectedArtikal(null);
              }}
            >
              Odbaci (ovo je višak??)
            </Button>

            <Button
              className="w-[100px]"
              onClick={() => {
                console.log("💾 Kliknuto na 'Sačuvaj' dugme");
                if (selectedArtikal) {
                  console.log("✅ Artikal za čuvanje:", selectedArtikal);
                  onArtikalPromenjen(artikal.idArtikla, selectedArtikal);
                } else {
                  console.warn("⚠️ Nije izabran nijedan artikal za čuvanje!");
                }
              }}
            >
              Sačuvaj
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromeniButton;
