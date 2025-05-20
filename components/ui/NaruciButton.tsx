"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const NaruciButton = () => {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  // Simulacija poručivanja
  const handleNaruci = () => {
    // Možeš ovde pozvati API ako želiš
    setSuccess(true);
    setOpen(true); // Otvori modal
  };

  // Opcionalno: automatsko zatvaranje posle 3 sekunde
  useEffect(() => {
    if (open) {
      const timeout = setTimeout(() => {
        setOpen(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  return (
    <div>
      <Button variant="outline" className="px-10 py-4" onClick={handleNaruci}>
        Naruči
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hvala na porudžbini</DialogTitle>
            <DialogDescription>
              Uspešno ste poručili artikle.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NaruciButton;
