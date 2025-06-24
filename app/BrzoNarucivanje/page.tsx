"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import PrebaciUKorpu from "@/components/PrebaciUKorpu";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const BrzoNarucivanje = () => {
  const [rows, setRows] = useState([{ sifra: "", kolicina: "" }]);
  const [scannerActive, setScannerActive] = useState(false);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  const handleBarcodeDetected = (text: string) => {
    const sifra = text.replace(/\D/g, "");
    if (!sifra) return;

    setRows((prevRows) => {
      const alreadyExists = prevRows.find((row) => row.sifra === sifra);
      if (alreadyExists) {
        return prevRows.map((row) =>
          row.sifra === sifra
            ? { ...row, kolicina: String(Number(row.kolicina) + 1) }
            : row
        );
      } else {
        const newRows = [...prevRows];
        if (
          newRows.length > 0 &&
          newRows[newRows.length - 1].sifra === "" &&
          newRows[newRows.length - 1].kolicina === ""
        ) {
          newRows[newRows.length - 1] = { sifra, kolicina: "1" };
        } else {
          newRows.push({ sifra, kolicina: "1" });
        }
        return [...newRows, { sifra: "", kolicina: "" }];
      }
    });
  };

  const handleChange = (
    index: number,
    field: "sifra" | "kolicina",
    value: string
  ) => {
    const numericValue = value.replace(/\D/g, "");
    const newRows = [...rows];
    newRows[index][field] = numericValue;
    setRows(newRows);
  };

  const handleAddRow = () => {
    setRows([...rows, { sifra: "", kolicina: "" }]);
  };

  const handleRemoveRow = (index: number) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const validItems = rows
    .filter((row) => row.sifra && row.kolicina)
    .map((row) => ({
      sifra: row.sifra,
      kolicina: parseInt(row.kolicina, 10),
    }));

  // Novi CSV parser
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text !== "string") return;

      const lines = text.trim().split(/\r?\n/);
      if (lines.length < 2) {
        alert("CSV fajl je prazan ili nema dovoljno podataka");
        return;
      }

      const headers = lines[0].split(",").map((h) => h.trim());
      const sifraIndex = headers.findIndex((h) => h === "Šifra");
      const kolicinaIndex = headers.findIndex((h) => h === "Količina");

      if (sifraIndex === -1 || kolicinaIndex === -1) {
        alert("CSV mora imati kolone 'Šifra' i 'Količina'");
        return;
      }

      const parsedRows = lines
        .slice(1)
        .map((line) => {
          const cols = line.split(",");
          return {
            sifra: cols[sifraIndex]?.replace(/\D/g, "") || "",
            kolicina: cols[kolicinaIndex]?.replace(/\D/g, "") || "",
          };
        })
        .filter((row) => row.sifra && row.kolicina);

      if (parsedRows.length === 0) {
        alert("CSV fajl nema validne podatke");
        return;
      }

      setRows([...parsedRows, { sifra: "", kolicina: "" }]);
    };

    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    // Ručno pravljenje CSV template fajla
    const csvContent = "Šifra,Količina\n\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "brza-porudzbina-sablon.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen">
      {/* LEVI PANEL - sidebar na desktopu */}
      <aside className="hidden md:flex md:flex-col md:w-1/3 bg-gray-50 p-6 border-r border-gray-200 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Kako koristiti?</h2>
        <p className="mb-2">
          Ovde možeš da pročitaš uputstva za brzo naručivanje i skeniranje barkoda.
        </p>
        <ul className="list-disc ml-5 text-gray-700 flex flex-col gap-4">
          <li>
            <strong>Uključi kameru za skeniranje barkoda:</strong> Klikni dugme
            „Uključi kameru za skeniranje“, usmeri kameru na barkod i artikli će
            se automatski dodavati.
          </li>
          <li>
            <strong>Ručno unošenje artikala:</strong> Unesi šifru i količinu
            u polja sa desne strane. Novi redovi se dodaju automatski.
          </li>
          <li>
            <strong>Uvoz iz CSV fajla:</strong> Klikni na „Uvezi CSV“ i izaberi
            fajl sa kolonama „Šifra“ i „Količina“.
          </li>
          <li>
            <strong>Prebaci u korpu:</strong> Kada si spreman, klikni „Prebaci u korpu“.
          </li>
        </ul>
      </aside>

      {/* DESNI PANEL */}
      <main className="flex-1 p-6 flex flex-col max-h-screen">
        {/* Info dugme za mobilne */}
        <Dialog>
          <DialogTrigger asChild>
            <button
              aria-label="Informacije"
              className="fixed bottom-6 left-6 z-50 md:hidden w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg hover:bg-blue-700 transition"
              type="button"
            >
              i
            </button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Kako koristiti?</DialogTitle>
            </DialogHeader>
            <p className="mb-2">
              Ovde možeš da pročitaš uputstva za brzo naručivanje i skeniranje barkoda.
            </p>
            <ul className="list-disc ml-5 text-gray-700 flex flex-col gap-3">
              <li>
                <strong>Uključi kameru za skeniranje barkoda:</strong> Klikni dugme
                „Uključi kameru za skeniranje“, usmeri kameru na barkod i artikli
                će se automatski dodavati.
              </li>
              <li>
                <strong>Ručno unošenje artikala:</strong> Unesi šifru i količinu
                u polja sa desne strane. Novi redovi se dodaju automatski.
              </li>
              <li>
                <strong>Uvoz iz CSV fajla:</strong> Klikni na „Uvezi CSV“ i izaberi
                fajl sa kolonama „Šifra“ i „Količina“.
              </li>
              <li>
                <strong>Prebaci u korpu:</strong> Kada si spreman, klikni „Prebaci u korpu“.
              </li>
            </ul>
            <DialogClose className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Zatvori
            </DialogClose>
          </DialogContent>
        </Dialog>

        <h1 className="font-bold text-3xl text-center lg:text-4xl mb-4">
          Brzo naručivanje
        </h1>

        {/* Dugme za paljenje skenera - centrirano ispod h1 */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setScannerActive((prev) => !prev)}
            className={`px-6 py-2 rounded-md font-semibold transition-colors duration-300 cursor-pointer ${
              scannerActive ? "bg-red-600 text-white" : "bg-blue-600 text-white"
            }`}
          >
            {scannerActive
              ? "Isključi kameru za skeniranje"
              : "Uključi kameru za skeniranje"}
          </button>
        </div>

        {/* Komponenta kamere za skeniranje */}
        {scannerActive && (
          <div className="w-full max-w-md mb-6 mx-auto">
            <BarcodeScannerComponent
              width={350}
              height={250}
              onUpdate={(err, result) => {
                if (result) {
                  handleBarcodeDetected(result.getText());
                }
              }}
            />
          </div>
        )}

        {/* Input za barkod - nevidljiv */}
        <input
          ref={barcodeInputRef}
          type="text"
          autoFocus
          className="absolute opacity-0 pointer-events-none h-0 w-0"
        />

        {/* Dugme za preuzimanje šablona */}
        <div className="mb-6 text-center">
          <button
            className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 rounded shadow border cursor-pointer"
            onClick={handleDownloadTemplate}
            title="Preuzmi CSV šablon za unos"
          >
            📄 Preuzmi šablon
          </button>
        </div>

        {/* Tabela sa unosom sifri i količina - koristi auto height */}
        <div className="flex flex-col items-center mb-6 max-h-[60vh] overflow-auto w-full">
          {rows.map((row, index) => {
            const isDummy =
              index === rows.length - 1 && row.sifra === "" && row.kolicina === "";

            return (
              <div
                key={index}
                className="flex w-full max-w-xl items-end justify-center gap-2 transition-all duration-200"
              >
                <div className="flex flex-col items-center">
                  <p className={isDummy ? "opacity-50" : ""}>Šifra</p>
                  <Input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className={`border-2 border-[#323131cc] w-45 ${
                      isDummy ? "opacity-50 cursor-pointer" : ""
                    }`}
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
                    className={`border-2 border-[#323131cc] w-20 ${
                      isDummy ? "opacity-40 cursor-pointer" : ""
                    }`}
                    value={row.kolicina}
                    onChange={(e) => handleChange(index, "kolicina", e.target.value)}
                    onFocus={() => {
                      if (isDummy) handleAddRow();
                    }}
                  />
                </div>

                <button
                  onClick={() => handleRemoveRow(index)}
                  className={`mb-1 text-red-500 font-bold text-xl px-2 hover:text-red-700 ${
                    isDummy ? "invisible" : ""
                  }`}
                  title="Ukloni red"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        {/* Dugme za upload CSV i prebaci u korpu */}
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1 rounded"
              onClick={() => document.getElementById("csvUpload")?.click()}
            >
              Uvezi CSV
            </button>
            <input
              type="file"
              id="csvUpload"
              accept=".csv,text/csv"
              onChange={handleCSVUpload}
              className="hidden"
            />
          </div>

          {/* Prebaci u korpu */}
          <PrebaciUKorpu rows={validItems} />
        </div>
      </main>
    </div>
  );
};

export default BrzoNarucivanje;
