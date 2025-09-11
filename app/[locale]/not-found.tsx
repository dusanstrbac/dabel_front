'use client';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


const notFound = () => {

    const router = useRouter();


    return(
        <div className="flex flex-col items-center justify-center gap-5 min-h-screen w-full">
            <h1 className="font-light text-3xl text-center">Ova stranica nije pronadjena</h1>

            <Button
                className="w-30 h-10 cursor-pointer"
                onClick={() => router.back()}
            >
                <p className="text-lg">Nazad</p>
            </Button>
        </div>
    );
}

export default notFound;
