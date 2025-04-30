import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  

const videoUputstva = () => {


    
    return (
        <div className="flex justify-baseline gap-10 items-center">
            <div className="ml-4">
                <div>
                    <h1 className="text-3xl font-bold">Video uputstva</h1>
                </div>

                <div className="flex flex-col gap-2 mb-5 mt-5 justify-start items-start border border-grey-300 w-[250px] rounded-[10px]">
                    <button className="bg-transparent text-black cursor-pointer px-4 w-full py-3 text-left">
                        Cenovnik.mp4
                    </button>
                    <button className="bg-transparent text-black cursor-pointer px-4 w-full py-3 text-left">
                        Finansijski izvestaji.mp4
                    </button>
                    <button className="bg-transparent text-black cursor-pointer px-4 w-full py-3 text-left">
                        Definisanje korisnika za kreiranje rezervacija.mp4
                    </button>
                    <button className="bg-transparent text-black cursor-pointer px-4 w-full py-3 text-left">
                        Korisnici.mp4
                    </button>
                    <button className="bg-transparent text-black cursor-pointer px-4 w-full py-3 text-left">
                        Moja dokumenta.mp4
                    </button>
                    <button className="bg-transparent text-black cursor-pointer px-4 w-full py-3 text-left">
                        Narucivanje robe.mp4
                    </button>
                    <button className="bg-transparent text-black cursor-pointer px-4 w-full py-3 text-left">
                        Ponude i predracuni.mp4
                    </button>
                    <button className="bg-transparent text-black cursor-pointer px-4 w-full py-3 text-left">
                        Promena lozinke.mp4
                    </button>
                    <button className="bg-transparent text-black cursor-pointer px-4 w-full py-3 text-left">
                        Rezervacija robe.mp4
                    </button>
                    <button className="bg-transparent text-black cursor-pointer px-4 w-full py-3 text-left">
                        Snimljene narudzbenice.mp4
                    </button>
                    <button className="bg-transparent text-black cursor-pointer px-4 w-full py-3 text-left">
                        Unos artikala u korpu preko Excel tabele.mp4
                    </button>
                </div>
            </div>

            <div>
                <video width="1080" height="640" controls preload="none">
                    <source src="/path/to/video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
                </video>
            </div>    
        </div>

    )
}

export default videoUputstva;