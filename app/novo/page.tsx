'use client';
import ListaArtikala from "@/components/ListaArtikala";
import SortiranjeButton from "@/components/SortiranjeButton";

const novo = () => {

    return (
        <div className="lg:p-4">
            <div className="w-full mx-auto flex justify-between items-center p-2">    
              {/*Naslov*/}
              <h1 className="font-bold text-3xl">Novopristigli artikli</h1>
              <SortiranjeButton />
            </div>
            {/* LISTA ARTIKALA */}
            <ListaArtikala />
        </div>
      )
}

export default novo;