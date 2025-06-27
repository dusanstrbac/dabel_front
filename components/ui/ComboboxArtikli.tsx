"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FixedSizeList as List } from "react-window";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type Artikal = {
  idArtikla: string;
  naziv: string;
  barkod: string;
  jm: string;
};

type Props = {
  articleList: Artikal[];
  onSelectOption: (artikal: Artikal) => void;
  placeholder?: string;
  currentArtikalId?: string;
  iskljuceniArtikli?: Artikal[];
};

// Custom debounce hook
function useDebounce<T>(value: T, delay = 150): T {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

// String normalization helper
const normalizeString = (str: string = "") =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const ComboboxArtikliComponent: React.FC<Props> = ({
  articleList,
  onSelectOption,
  placeholder = "Pretraži artikle",
  currentArtikalId,
  iskljuceniArtikli = [],
}) => {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const debouncedInput = useDebounce(inputValue, 150);

  const selectedArtikal = React.useMemo(() => {
    return articleList.find((a) => a.idArtikla === currentArtikalId) || null;
  }, [articleList, currentArtikalId]);

  const filteredList = React.useMemo(() => {
    if (!debouncedInput) return articleList;

    const normalizedInput = normalizeString(debouncedInput);

    return articleList.filter((artikal) =>
      normalizeString(artikal.naziv).includes(normalizedInput) ||
      normalizeString(artikal.barkod).includes(normalizedInput) ||
      normalizeString(artikal.idArtikla).includes(normalizedInput)
    );
  }, [debouncedInput, articleList]);

  const isDisabled = (artikal: Artikal): boolean =>
    iskljuceniArtikli.some(
      (a) => a.idArtikla === artikal.idArtikla && a.idArtikla !== currentArtikalId
    );

  const handleSelect = (id: string) => {
    const artikal = articleList.find((a) => a.idArtikla === id);
    if (artikal && !isDisabled(artikal)) {
      onSelectOption(artikal);
      setOpen(false);
      setInputValue("");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between h-full"
          onClick={() => setOpen(true)}
        >
          <p className="max-w-[400px] whitespace-break-spaces">{selectedArtikal?.naziv || placeholder}</p>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent 
          side="bottom"
          disablePortal 
          align="center"
          sideOffset={8}
          avoidCollisions={false}
          className="w-[clamp(220px,80vw,600px)] p-2"
      
      >
        <Command className="flex w-full">
          <input
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full h-9 px-3 py-1.5 border rounded-md mb-2 text-sm"
            autoFocus
          />

          <CommandList className="w-full">
            <CommandEmpty>
              {inputValue
                ? `🚫 Nema rezultata za: "${inputValue}"`
                : "🚫 Nema dostupnih artikala"}
            </CommandEmpty>
            <CommandGroup className="w-full">
              <List
                height={215}
                itemCount={filteredList.length}
                itemSize={45}
                width="100%"
              >
                {({ index, style }) => {
                  const artikal = filteredList[index];
                  const isSelected = artikal.idArtikla === currentArtikalId;
                  const disabled = isDisabled(artikal);

                  return (
                    <div style={style} key={artikal.idArtikla}>
                      <CommandItem
                        value={artikal.idArtikla}
                        onSelect={() => handleSelect(artikal.idArtikla)}
                        className={cn(
                          "flex items-center px-3 py-2 text-sm w-full",
                          disabled
                            ? "text-muted-foreground cursor-not-allowed opacity-60"
                            : "cursor-pointer hover:bg-accent"
                        )}
                        disabled={disabled}
                      >
                        <span className="truncate">{artikal.naziv}</span>
                        {isSelected && (
                          <Check className="ml-auto h-4 w-4 opacity-100" />
                        )}
                        {disabled && (
                          <Ban className="ml-2 h-4 w-4 opacity-70 text-red-400" />
                        )}
                      </CommandItem>
                    </div>
                  );
                }}
              </List>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const ComboboxArtikli = React.memo(ComboboxArtikliComponent);