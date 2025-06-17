"use client";
import { Button } from "./button";
import { useRouter } from "next/navigation";

const NaruciButton = () => {
  const router = useRouter();

  const handleNaruci = () => {
    router.push('/dokument/upis');
  };

  return (
    <div>
      <Button variant="outline" className="px-10 py-4 cursor-pointer" onClick={handleNaruci}>
        Naruči
      </Button>
    </div>
  );
};

export default NaruciButton;
