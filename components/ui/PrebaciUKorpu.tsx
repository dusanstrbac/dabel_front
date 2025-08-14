import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Tip za jedan red
type Row = { sifra: string; kolicina: string };

interface Props {
  firstRow: Row;
  rows: Row[];
}

const PrebaciUKorpu = ({ firstRow, rows }: Props) => {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);

    const handleNaruci = () => {
        const allRows = [firstRow, ...rows];

        const unetiArtikli = allRows.filter(
            (row) => row.sifra.trim() !== "" || row.kolicina.trim() !== ""
        );

        const sviUnetiValidni =
            unetiArtikli.length > 0 &&
            unetiArtikli.every((row) => {
            const sifraValidna = row.sifra.trim().length >= 4;
            const kolicinaValidna = parseInt(row.kolicina.trim()) > 0;
            return sifraValidna && kolicinaValidna;
            });

        setSuccess(sviUnetiValidni);
        setOpen(true);
    };


  useEffect(() => {
    if (open) {
      const timeout = setTimeout(() => setOpen(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  return (
    <div>
      <Button onClick={handleNaruci}>Prebaci u korpu</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{success ? "Uspešan prebačaj!" : "Greška!"}</DialogTitle>
            <DialogDescription>
              {success
                ? "Artikli su uspešno prebačeni u korpu."
                : "Loš unos artikala, pokušajte ponovo"}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrebaciUKorpu;
