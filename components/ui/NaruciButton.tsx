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
import { useRouter } from "next/navigation";

const NaruciButton = () => {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleNaruci = () => {
    setSuccess(true);
    router.push('/dokument/upis');
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
      <Button variant="outline" className="px-10 py-4 cursor-pointer" onClick={handleNaruci}>
        Naruči
      </Button>
    </div>
  );
};

export default NaruciButton;
