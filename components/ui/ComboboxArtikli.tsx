"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type Artikal = {
  idArtikla: string
  naziv: string
  barkod: string
  jm: string
}

type Props = {
  articleList: Artikal[]
  onSelectOption: (artikal: Artikal) => void
  placeholder?: string
}

export function ComboboxArtikli({
  articleList,
  onSelectOption,
  placeholder = "Pretraži artikle",
}: Props) {
  console.log("🌀 ComboboxArtikli renderovan");

  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {
  console.log("📋 Dohvaćeni svi artikli");
}, [articleList]);


  React.useEffect(() => {
    console.log("🔍 inputValue se promenio:", inputValue);
  }, [inputValue]);

  React.useEffect(() => {
    console.log("📦 selectedId se promenio:", selectedId);
  }, [selectedId]);

  React.useEffect(() => {
    console.log("📤 Popover open state:", open ? "otvoren" : "zatvoren");
  }, [open]);

//   const filtered = React.useMemo(() => {
//     const result = articleList.filter((artikal) =>
//       artikal.naziv.toLowerCase().includes(inputValue.toLowerCase()) ||
//       artikal.barkod.toLowerCase().includes(inputValue.toLowerCase())
//     );
//     console.log("🔎 Rezultat filtriranja:", result.map(r => r.naziv));
//     return result;
//   }, [inputValue, articleList]);

    const filtered = React.useMemo(() => {
        const normalizedInput = inputValue
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

        const result = articleList.filter((artikal) => {
            const naziv = artikal.naziv
            ?.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase() || "";

            const barkod = artikal.barkod?.toLowerCase() || "";

            return naziv.includes(normalizedInput) || barkod.includes(normalizedInput);
        });

        console.log("🔎 Rezultat filtriranja:", result.map(r => r.naziv));
        return result;
    }, [inputValue, articleList]);



  console.log("📊 Broj filtriranih rezultata:", filtered.length);


  const selected = articleList.find((a) => a.idArtikla === selectedId);

  function handleSelect(id: string) {
    console.log("✅ Kliknuto na artikal sa id-jem:", id);
    const artikal = articleList.find((a) => a.idArtikla === id);
    if (artikal) {
      console.log("🎯 Artikal selektovan:", artikal);
      setSelectedId(id);
      setOpen(false);
      setInputValue("");
      console.log("📤 Pozivam onSelectOption iz props sa artiklom:", artikal);
      onSelectOption(artikal);
    } else {
      console.warn("⚠️ Nema artikla sa tim ID-jem:", id);
    }
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[450px] justify-between"
          onClick={() => {
            console.log("🖱 Kliknuto na combobox dugme")
            setOpen(true);
          }}
        >
          {selected?.naziv || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent 
        disablePortal        
        className="w-[500px] p-2"
      >
        <Command>
          <CommandInput
            placeholder={placeholder}
            value={inputValue}
            onValueChange={(value) => {
              console.log("⌨️ Unos promenjen:", value);
              setInputValue(value);
            }}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>
              <span>🚫 Nema rezultata za: "{inputValue}"</span>
            </CommandEmpty>
            <CommandGroup>
              {filtered.map((artikal) => (
                <CommandItem
                  key={artikal.idArtikla}
                  value={artikal.idArtikla}
                  onSelect={() => {
                    console.log("👉 Kliknut item:", artikal.naziv);
                    handleSelect(artikal.idArtikla);
                    console.log("🖱 Kliknut artikal:", artikal.naziv, "ID:", artikal.idArtikla);
                  }}
                >
                  {artikal.naziv}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedId === artikal.idArtikla ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
