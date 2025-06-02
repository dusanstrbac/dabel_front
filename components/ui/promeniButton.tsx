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

type Option = {
  value: string;
  label: string;
};

const PromeniButton = ({
  artikal,
  articleList,
}: {
  artikal: artikalProp;
  articleList: artikalProp[];
}) => {
  const [localArticleList, setLocalArticleList] = useState<artikalProp[]>([]);
  const [selectedArtikal, setSelectedArtikal] = useState<artikalProp | null>(null);

  console.log("🌀 PromeniButton renderovan");

  // Kada se komponenta učita ili se promeni articleList, update lokalne kopije
  useEffect(() => {
    console.log("📦 useEffect: articleList promenjen, upisujem u lokalni state...");
    setLocalArticleList(articleList);
  }, [articleList]);

  useEffect(() => {
    console.log("🔁 PromeniButton se ponovo renderovao");
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

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Izaberite artikals</DialogTitle>
          <DialogDescription className="w-[800px]">
            Odaberite artikal koji zelite da izmenite
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 border-2">
                <ComboboxArtikli
                  articleList={localArticleList}
                  onSelectOption={(artikal) => {
                    console.log("🔽 Combobox: izabran artikal:", artikal);
                    setSelectedArtikal(artikal);
                  }}
                  placeholder="Pretraži artikle"
                />

                <Button
                  className="w-[100px]"
                  onClick={() => {
                    console.log("💾 Kliknuto na 'Sačuvaj' dugme");
                    if (selectedArtikal) {
                      console.log("✅ Artikal za čuvanje:", selectedArtikal);
                    } else {
                      console.warn("⚠️ Nije izabran nijedan artikal za čuvanje!");
                    }
                  }}
                >
                  Sačuvaj
                </Button>

                <Button
                  className="w-[100px]"
                  onClick={() => {
                    console.log("❌ Kliknuto na 'Odbaci'");
                    setSelectedArtikal(null);
                  }}
                >
                  Odbaci
                </Button>
          </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromeniButton;
