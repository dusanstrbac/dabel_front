'use client';
import ListaArtikala from "@/components/ListaArtikala";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import SortirajDugme from "@/components/ui/sortirajDugme";
  


const akcije = () => {

    return (
        <div className="p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center p-2">
                
                {/*Naslov*/}
                <h1 className="font-bold text-3xl">Akcija</h1>
            
                {/* <Popover>
                  <PopoverTrigger asChild>
                    <button className="text-sm font-semibold border px-3 py-1 rounded-md hover:bg-gray-100">
                      Sortiraj
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-44">
                    <div className="flex flex-col gap-2">
                      <button onClick={() => {}} className="text-left hover:underline">
                        Cena: Rastuće
                      </button>
                      <button onClick={() => {}} className="text-left hover:underline">
                        Cena: Opadajuće
                      </button>
                    </div>
                  </PopoverContent>
                </Popover> */}

                <SortirajDugme/>
            </div>
            {/* LISTA ARTIKALA */}
            <ListaArtikala />
        </div>
      )
}

export default akcije;