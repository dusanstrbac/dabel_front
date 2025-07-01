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

type Option = {
  value: string;
  label: string;
};

type ComboboxDemoProps = {
  options: Option[];
  onSelectOption: (label: string) => void;
  placeholder?: string;
};

export function ComboboxDemo({
      options,
      onSelectOption,
      placeholder = "Izaberite opciju"
    }: ComboboxDemoProps) {

  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState<string | null>(null);
  const [inputValue, setInputValue] = React.useState("");

  const filtrirani = React.useMemo(() => {
    return options.filter((opt) =>
      opt.value.toLowerCase().includes(inputValue.toLowerCase()) ||
      opt.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, options]);


  const selectedOption = options.find((opt) => opt.value === selectedValue);

  //Funkcija za selekciju koja postavlja stanje, poziva callback i zakazuje zatvaranje sa delay
  function handleSelect(value: string) {
  const option = options.find((option) => option.value === value);
    if (option) {
      setSelectedValue(option.value);
      onSelectOption(option.label);
      setOpen(false);
    }
  }


  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setInputValue("");
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full min-w-[250px] justify-between right-0 flex"
        >
          {selectedOption?.label || placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[250px] p-2 max-h-80">
        <Command>
          <CommandInput
            placeholder={placeholder} 
            className="h-9"
            value={inputValue}
            onValueChange={setInputValue}
          /> 
          <CommandList className="max-h-64 overflow-y-scroll cursor-pointer">
            <CommandEmpty>Nema rezultata</CommandEmpty>
            <CommandGroup>
              {filtrirani.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className={cn(
                    "cursor-pointer p-2"
                  )}
                  
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedValue === option.value ? "opacity-100" : "opacity-0"
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
