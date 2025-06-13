"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import PrebaciUKorpu from "@/components/PrebaciUKorpu";

const BrzoNarucivanje = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Unos za pretragu (šifra/naziv/barkod)
  const [rows, setRows] = useState([
    { sifra: "", kolicina: "", naziv: "", barkod: "" }
  ]);

  // Funkcija za ažuriranje vrednosti u searchTerm (input polje)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Funkcija za slanje zahteva prema backendu kada se menja pretraga
  const handleSearch = async () => {
    // Ovde šaljemo zahtev prema backendu sa unosom iz searchTerm
    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ searchTerm })
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Podaci sa servera:", data);
      // Ovdje možemo obraditi odgovor sa servera (ako je potrebno)
    } else {
      console.error("Greška prilikom pretrage");
    }
  };

  // Funkcija za dodavanje novog reda
  const handleAddRow = () => {
    setRows([...rows, { sifra: "", kolicina: "", naziv: "", barkod: "" }]);
  };

  // Funkcija za uklanjanje reda
  const handleRemoveRow = (index: number) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  // Funkcija za ažuriranje vrednosti u svakom redu
  const handleChange = (index: number, field: "sifra" | "kolicina" | "naziv" | "barkod", value: string) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  // Filtriraj validne redove (neprazne) kada se promeni kolicina ili sifra
  const validItems = rows
    .filter(row => row.sifra && row.kolicina)
    .map(row => ({
      sifra: row.sifra,
      kolicina: parseInt(row.kolicina, 10),
    }));

  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-full max-w-xl px-4 space-y-8 mb-20">
        <h1 className="font-bold text-3xl text-center lg:text-4xl">Brzo naručivanje</h1>

        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              className="border-2 border-[#323131cc] w-80"
              placeholder="Unesite šifru, naziv ili barkod"
              value={searchTerm}
              onChange={handleSearchChange}
              onBlur={handleSearch}  // Aktivira pretragu kada korisnik izađe iz inputa
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-10 lg:gap-20">
          <p>
            <span className="font-bold text-lg">Preostalo je: </span>
            <span className="text-lg whitespace-nowrap">300.000 RSD</span>
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          {rows.map((row, index) => {
            const isDummy = index === rows.length - 1 && row.sifra === "" && row.kolicina === "";

            return (
              <div
                key={index}
                className="flex w-full items-end justify-center gap-2 transition-all duration-200"
              >
                <div className="flex flex-col items-center">
                  <p className={isDummy ? "opacity-50" : ""}>Šifra</p>
                  <Input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className={`border-2 border-[#323131cc] w-45 ${isDummy ? "opacity-50 cursor-pointer" : ""}`}
                    value={row.sifra}
                    onChange={(e) => handleChange(index, "sifra", e.target.value)}
                    onFocus={() => {
                      if (isDummy) handleAddRow();
                    }}
                  />
                </div>

                <div className="flex flex-col items-center">
                  <p className={isDummy ? "opacity-40" : ""}>Količina</p>
                  <Input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className={`border-2 border-[#323131cc] w-20 ${isDummy ? "opacity-40 cursor-pointer" : ""}`}
                    value={row.kolicina}
                    onChange={(e) => handleChange(index, "kolicina", e.target.value)}
                    onFocus={() => {
                      if (isDummy) handleAddRow();
                    }}
                  />
                </div>

                <button
                  onClick={() => handleRemoveRow(index)}
                  className={`mb-1 text-red-500 font-bold text-xl px-2 hover:text-red-700 ${isDummy ? "invisible" : ""}`}
                  title="Ukloni red"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center">
          <PrebaciUKorpu rows={validItems} />
        </div>
      </div>
    </div>
  );
};

export default BrzoNarucivanje;
