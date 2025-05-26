'use client'
import { Heart } from "lucide-react";
import { useState } from "react";


const DodajUOmiljeno = ({idArtikla, idPartnera} : { idArtikla : string, idPartnera: any}) => {
    const [lajkovano, setLajkovano] = useState(false);

// Izvuci ID partnera, ID artikla i status da li je lajkovano ili nije ( SVE IZVUCI IZ SQL-a)

    const lajkujArtikal = () => {
        setLajkovano(!lajkovano);
        console.log("Lajkovan artikal", idArtikla);
    }

    return(
        <div className="flex items-center gap-2">
            <p className="text-[16px]">Dodaj u omiljeno</p>
            <Heart 
                width={25} 
                height={25}
                onClick={lajkujArtikal}
                className="cursor-pointer"
                color={lajkovano ? "red" : "gray"}
                fill={lajkovano ? "red" : "none"}
            />
        </div>
    )
}
export default DodajUOmiljeno;