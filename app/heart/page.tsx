'use client';
import ListaArtikala from "@/components/ListaArtikala";
import { Paginacija, PaginacijaLink, PaginacijaPrethodna, PaginacijaSadrzaj, PaginacijaSledeca, PaginacijaStavka, PaginacijaTackice } from "@/components/ui/pagination";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  

//OVO NIJE ZAVRSENO, TEK SAM POCEO
const heart = () => {

    return (
        <div className="p-4">
          
          
          {/* Dugme Sortiraj poravnato desno
            Ali ne znam šta se tačno dešava MORA PONOVO
          */}
            <div className="max-w-7xl mx-auto flex justify-between items-center p-2">
                
                {/*Naslov*/}
                <h1 className="font-bold text-3xl">Novopristigli artikli</h1>
            
            <Popover>
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
            </Popover>
            </div>

      
            {/* Kartice */}
            <div className="max-w-7xl mx-auto grid gap-4 p-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <ListaArtikala />
            </div>
            



            {/* Paginacija */}
            <Paginacija className="mt-5 mb-5 flex items-center">
                <PaginacijaSadrzaj>
                    <PaginacijaStavka>
                        <PaginacijaPrethodna href="#" />
                    </PaginacijaStavka>
                    <PaginacijaStavka>
                        <PaginacijaLink href="#">1</PaginacijaLink>
                    </PaginacijaStavka>
                    <PaginacijaStavka>
                        <PaginacijaTackice />
                    </PaginacijaStavka>
                    <PaginacijaStavka>
                        <PaginacijaSledeca href="#" />
                    </PaginacijaStavka>
                </PaginacijaSadrzaj>
            </Paginacija>
        </div>
      )
}

export default heart;