'use client';
import ListaArtikala from "@/components/ListaArtikala";

  
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  


const akcije = () => {

    return (
        <div className="lg:p-4">
            <div className="w-full mx-auto flex justify-between items-center p-2">
                {/*Naslov*/}
                <h1 className="font-bold text-3xl">Akcija</h1>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-sm font-semibold border px-3 py-1 rounded-md hover:bg-gray-100">
                  Sortiraj
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col gap-2">
                  <button onClick={() => {}} className="text-left hover:underline hover:bg-gray-400 px-4 py-1">
                    Cena: Rastuće
                  </button>
                  <button onClick={() => {}} className="text-left hover:underline px-4 py-2">
                    Cena: Opadajuće
                  </button>
                </div>
              </PopoverContent>
            </Popover>
            </div>

      
            {/* Kartice */}
            <ListaArtikala />
        </div>
      )
}

export default akcije;