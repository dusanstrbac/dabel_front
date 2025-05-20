'use client';
import { Button } from "./button";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const SortirajDugme = () => {

    return(
        <Popover>
              <PopoverTrigger asChild>
                <button className="text-sm font-semibold border px-3 py-1 rounded-md hover:bg-gray-100">
                  Sortiraj
                </button>
              </PopoverTrigger>
              <PopoverContent className="px-2 py-2">
                <div className="flex flex-col gap-2">
                  <button onClick={() => {}} className="text-left cursor-pointer rounded-md hover:underline hover:bg-[#ebe8e89e] px-2 py-2">
                    Cena: Rastuće
                  </button>
                  <button onClick={() => {}} className="text-left cursor-pointer rounded-md hover:underline hover:bg-[#ebe8e89e] px-2 py-2">
                    Cena: Opadajuće
                  </button>
                </div>
              </PopoverContent>
            </Popover>
    );
}

export default SortirajDugme;