"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

type Props = {
  dostavaList: KorisnikDostavaType[];
  onSelectOption: (dostava: KorisnikDostavaType) => void;
  placeholder?: string;
  defaultValue?: string; // Dodajemo novi prop za default vrednost
};

export const ComboboxAdrese: React.FC<Props> = ({
  dostavaList,
  onSelectOption,
  placeholder = "Izaberi adresu dostave",
  defaultValue, // Dodajemo defaultValue u props
}) => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<KorisnikDostavaType | null>(null);
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {
    if (dostavaList.length === 1) {
      // Samo ako postoji JEDNA adresa — automatski je selektuj
      const jedinaAdresa = dostavaList[0];
      setSelected(jedinaAdresa);
      onSelectOption(jedinaAdresa);
    } else if (dostavaList.length > 1) {
      // Ako ih ima više — ne selektuj ništa, samo placeholder
      dostavaList.sort();
      setSelected(null);
      onSelectOption({ adresa: "", postBroj: "", grad: "", drzava: "" } as KorisnikDostavaType);
    }
  }, [dostavaList]);

  //const sortiranaAdresa = React.useMemo(()=>return[...dostavaList].sort((a,b)=>
  //`$(a.adresa)$(a.grad)`.localeCompare(`$(b.adresa)$(b.grad)`, 'sr'),{sensitivity}));

  const sortedList = React.useMemo(() => {
    return [...dostavaList].sort((a, b) =>
      `${a.adresa} ${a.grad}`.localeCompare(`${b.adresa} ${b.grad}`, "sr", { sensitivity: "base" })
    );
  }, [dostavaList]);

  const filtered = React.useMemo(() => {
    const search = inputValue.toLowerCase();
    return sortedList.filter((item) => {
      const combined = `${item.adresa} ${item.grad} ${item.postBroj} ${item.drzava}`.toLowerCase();
      return combined.includes(search);
    });
  }, [inputValue, sortedList]);


  // const filtered = React.useMemo(() => {
  //   const search = inputValue.toLowerCase();
  //   return dostavaList.filter((item) => {
  //     const combined = `${item.adresa} ${item.grad} ${item.postBroj} ${item.drzava}`.toLowerCase();
  //     return combined.includes(search);
  //   });
  // }, [inputValue, dostavaList]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full max-w-[220px] sm:max-w-[570px] truncate justify-between"
        >
          {selected
            ? `${selected.adresa}, ${selected.postBroj} ${selected.grad}`
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full sm:max-w-[280px] sm:min-w-[570px] p-2">
        <Command>
          <CommandList>
            <CommandEmpty>Nema rezultata za pretragu.</CommandEmpty>
            <CommandGroup>
              {filtered.map((dostava, idx) => (
                <CommandItem
                  key={`${dostava.idPartnera}-${idx}`}
                  value={`${dostava.adresa}, ${dostava.grad}`}
                  onSelect={() => {
                    setSelected(dostava);
                    onSelectOption(dostava);
                    setOpen(false);
                    setInputValue("");
                  }}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{dostava.adresa}</span>
                    <span className="text-xs text-muted-foreground">
                      {dostava.postBroj}, {dostava.grad}, {dostava.drzava}
                    </span>
                  </div>
                  {selected?.adresa === dostava.adresa && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};