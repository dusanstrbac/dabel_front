import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { SortiranjeButtonProps } from "@/types/artikal";

const SortiranjeButton = ({ artikli, setArtikli } : SortiranjeButtonProps ) => {
    
// Funkcije za sortiranje
    const sortirajRastuce = () => {
        const sorted = [...artikli].sort((a, b) => a.cena - b.cena);
        setArtikli(sorted);
    };

    const sortirajOpadajuce = () => {
        const sorted = [...artikli].sort((a, b) => b.cena - a.cena);
        setArtikli(sorted);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="text-sm font-semibold border px-3 py-1 rounded-md hover:bg-gray-100">
                    Sortiraj
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-44">
                <div className="flex flex-col gap-2">
                    <button onClick={sortirajRastuce} className="text-left hover:underline">
                        Cena: Rastuće
                    </button>
                    <button onClick={sortirajOpadajuce} className="text-left hover:underline">
                        Cena: Opadajuće
                    </button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default SortiranjeButton;