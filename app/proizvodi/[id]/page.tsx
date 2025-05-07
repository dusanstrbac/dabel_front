import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Image from "next/image";

const Proizvod = () => {
    return (
        <main className="px-4 md:px-10 lg:px-[40px] py-6">
            <div className="container mx-auto flex flex-col lg:flex-row justify-between gap-8">
                {/* Leva sekcija: Slike */}
                <div className="flex flex-col lg:flex-row gap-6 w-full lg:w-2/3">
                    <div className="flex flex-col gap-4">
                        <Image 
                            src="/artikal.jpg"
                            width={300}
                            height={300}
                            alt="Proizvod"
                            className="border border-gray-400 rounded-lg object-contain w-full max-w-[300px] mx-auto"
                        />
                        <div className="flex gap-2 justify-start">
                            <Image 
                                src="/artikal.jpg"
                                width={80}
                                height={80}
                                alt="Proizvod"
                                className="border border-gray-400 rounded-lg object-contain"
                            />
                            <Image 
                                src="/artikal.jpg"
                                width={80}
                                height={80}
                                alt="Proizvod"
                                className="border border-gray-400 rounded-lg object-contain"
                            />
                        </div>
                    </div>

                    {/* Detalji o proizvodu */}
                    <div className="flex flex-col gap-3 w-full">
                        <h1 className="text-xl md:text-2xl font-bold">CILINDAR ZA VRATA CL2036 MAT MS60mm(30-30) 3K DBP1</h1>
                        <span className="text-red-500 text-lg md:text-xl font-bold">729 RSD</span>
                        <ul className="text-sm md:text-base space-y-1">
                            <li><span className="font-semibold">Šifra proizvoda:</span> 3398017</li>
                            <li><span className="font-semibold">Barkod:</span> 8605004203857</li>
                            <li><span className="font-semibold">Model:</span> CL2036</li>
                            <li><span className="font-semibold">Robna Marka:</span> DABEL</li>
                            <li><span className="font-semibold">Materijal:</span> DABEL</li>
                            <li><span className="font-semibold">Boja:</span> Mat-mesing</li>
                            <li><span className="font-semibold">Jedinica Mere:</span> KD</li>
                            <li><span className="font-semibold">Pakovanje:</span> Trgovačko kačenje</li>
                            <li><span className="font-semibold">Upotreba:</span> drvo</li>
                            <li><span className="font-semibold">Marketing:</span> 6pin</li>
                        </ul>
                    </div>
                </div>

                {/* Desna sekcija: Akcije */}
                <div className="flex flex-col gap-4 w-full lg:w-1/3 items-start justify-end lg:items-end">
                    <div className="flex items-center gap-2">
                        <p className="text-[16px]">Dodaj u omiljeno</p>
                        <Heart width={25} height={25} />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto flex-wrap">
                        <input 
                            className="w-16 border rounded px-2 py-1 text-center"
                            type="number"
                            min="0"
                        />
                        <Button className="w-full sm:w-auto px-6 py-2">Dodaj u korpu</Button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Proizvod;
