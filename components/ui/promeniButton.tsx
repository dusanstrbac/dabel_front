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

const PromeniButton = ({ artikal, articleList, onArtikalPromenjen, iskljuceniArtikli } : { artikal: artikalProp; articleList: artikalProp[]; onArtikalPromenjen: (stariId: string, novi: artikalProp) => void; iskljuceniArtikli: artikalProp[]; }) => {
  const [localArticleList, setLocalArticleList] = useState<artikalProp[]>([]);
  const [selectedArtikal, setSelectedArtikal] = useState<artikalProp | null>(null);

  useEffect(() => {
    setLocalArticleList(articleList);
  }, [articleList]);

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
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="flex items-center justify-center mr-15 mx-4 my-2 w-[150px] h-[40px] border-2 rounded-md text-lg hover:bg-gray-100 cursor-pointer"
        >
          Promeni
        </button>
      </DialogTrigger>

      <DialogContent className="flex flex-col"> 
        <DialogHeader>
          <DialogTitle>Izaberite artikal</DialogTitle>
          <DialogDescription>
            Odaberite artikal koji želite da postavite kao preporučen za sve kupce
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <ComboboxArtikli
            articleList={dostupniArtikli}
            onSelectOption={(artikal) => {
              setSelectedArtikal(artikal);
            }}
            placeholder="Pretraži artikle"
            currentArtikalId={artikal.idArtikla}
          />
          <div className="flex justify-end">
            <Button
              className="w-[100px]"
              onClick={() => {
                if (selectedArtikal) {
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
