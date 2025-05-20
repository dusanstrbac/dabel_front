import { Button } from "@/components/ui/button";
import Image from "next/image";


const dokument = () => {

    return(
        <div>
            {/* gornja polovina */}
            <div className="flex flex-col items-center"> 
                {/* Dabel Logo i print */}
                <div className="mt-4 flex items-center justify-between w-[600px]">
                    <Image
                        src="/Dabel-logo-2.png" 
                        alt="Dabel logo"
                        height={164}
                        width={140}
                        className="h-[75px] object-contain"
                    />
                    <Button>Print</Button>
                </div>

                <div className="mt-2 w-[600px] flex justify-start border-2">
                    {/* leva polovina */}
                    <div className="flex flex-col text-left self-start border-2">
                        <p>NP</p>
                        <p>Nova Pazova, Šesta Industrijska 12</p>
                        <span className="font-bold">Kontakt osoba: Nikola Cvetković</span>
                        
                        <div className="ml-3">
                            <p>Mob: +381607211022</p>
                            <p>Fax: </p>
                            <p>eMail: nikola.cvetkovic@dabel.rs</p>
                        </div>

                        <div className="flex flex-col items-center border-2 py-4 px-15 text-xl font-bold">
                            <p>Naručeno</p>
                            <p>1027/09 - 1-1027</p>
                        </div>

                        <p>Datum izdavanja 20.02.2024 00:00</p>
                    </div>

                    {/* desna polovina */}
                    <div className="flex flex-col items-start mt-[110px]">
                        <p>Partner: 3005</p>
                        <div className="flex flex-col w-full border-2 ">
                            <p className="mb-3">BANE OKOV</p>
                            <p>35000 Jagodina, Kneza Lazara 118</p>
                            <p>Fax: +38135232316 Tel: +38135232316</p>
                            <p>PIB: 103200595</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default dokument;