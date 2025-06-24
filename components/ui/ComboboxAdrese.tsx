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
};

export const ComboboxAdrese: React.FC<Props> = ({
  dostavaList,
  onSelectOption,
  placeholder = "Izaberi adresu dostave",
}) => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<KorisnikDostavaType | null>(null);
  const [inputValue, setInputValue] = React.useState("");

  const filtered = React.useMemo(() => {
    const search = inputValue.toLowerCase();
    return dostavaList.filter((item) => {
      const combined = `${item.adresa} ${item.grad} ${item.postBroj} ${item.drzava}`.toLowerCase();
      return combined.includes(search);
    });
  }, [inputValue, dostavaList]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full max-w-[280px] sm:max-w-[570px] truncate justify-between"
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
