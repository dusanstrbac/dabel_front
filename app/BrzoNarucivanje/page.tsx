"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import PrebaciUKorpu from "@/components/PrebaciUKorpu";
import * as XLSX from "xlsx";
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

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const json = XLSX.utils.sheet_to_json(sheet, { defval: "", header: 0 });

      const parsedRows = (json as any[]).map((row) => ({
        sifra: String(row["Šifra"]).replace(/\D/g, ""),
        kolicina: String(row["Količina"]).replace(/\D/g, ""),
      }));

      const validRows = parsedRows.filter((row) => row.sifra && row.kolicina);

      if (validRows.length > 0) {
        setRows([...validRows, { sifra: "", kolicina: "" }]);
      } else {
        alert("Excel fajl ne sadrži validne podatke.");
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleDownloadTemplate = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([["Šifra", "Količina"]]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BrzaPorudzbina");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "brza-porudzbina-sablon.xlsx";
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
            <strong>Uvoz iz Excel fajla:</strong> Klikni na „Uvezi Excel“ i izaberi
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
                <strong>Uvoz iz Excel fajla:</strong> Klikni na „Uvezi Excel“ i izaberi
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
            title="Preuzmi Excel šablon za unos"
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

        {/* Dugme za upload Excel i prebaci u korpu */}
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1 rounded-lg shadow cursor-pointer flex items-center gap-2"
              onClick={() => document.getElementById("excelUpload")?.click()}
            >
              <span>📂</span>Uvezi Excel
            </button>

            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              id="excelUpload"
              className="hidden"
              onChange={handleExcelUpload}
            />

            <PrebaciUKorpu rows={validItems} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrzoNarucivanje;
