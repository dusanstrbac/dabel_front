'use client';
import ArticleCard from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

// Primer podataka o artiklima
const articles = [
    {
      imageUrl: "korpa1.jpg",
      name: "Kvaka šild za vrata JELENA B-Ni 90/42/254/10/108/8/9 .Klj DBP0 1",
      sifra: "Šifra proizvoda: 0101095",
      barkod: "Barkod: 8605004250936",
      stanje: "Artikal nije na stanju do: 15.12.2025!",
      jm: "KD",
      cena: 929.50,
      pakovanje: 4.00,
      kolicina: 8.00
    },
    {
      imageUrl: "korpa2.jpg",
      name: "Nosač police konzolni N1103 Bela 250x300/49/0,9mm Q",
      sifra: "Šifra proizvoda: 3304094",
      barkod: "Barkod: 8605004204519",
      stanje: "",
      jm: "KD",
      cena: 68.75,
      pakovanje: 20.00,
      kolicina: 20.00
    },
    // Dodajte još artikala po potrebi
];



const Korpa = () => {

    const [quantities, setQuantities] = useState(
        articles.map((article) => article.kolicina)
    );

    const totalAmount = quantities.reduce((sum, quantity, index) => {
        const rounded = getRoundedQuantity(quantity, articles[index].pakovanje)
        return sum + rounded * articles[index].cena;
    }, 0);

    const totalAmountWithPDV = totalAmount * 1.2;

    

    function getRoundedQuantity(requested: number, packSize: number) {
        if (requested <= 0 || isNaN(requested)) return 0;
        return requested <= packSize
          ? packSize
          : Math.ceil(requested / packSize) * packSize;
    }
    

    return (
        <div className="p-4">
          
            <div className="w-full mx-auto flex justify-between items-center p-2">
                
                {/*Naslov*/}
                <h1 className="font-bold text-3xl">Pregled korpe</h1>
                <Button variant={"outline"} className="lg:px-6 cursor-pointer">Isprazni korpu</Button>
            </div>

            {/*DESKTOP TABELA*/}
            <div className="overflow-x-auto p-2 w-full hidden lg:block">
                <Table className="">
                    <TableHeader>
                        <TableRow className="">
                        <TableHead className="text-xl">{/*slika*/}</TableHead>
                        <TableHead className="text-xl font-light">Naziv artikla</TableHead>
                        <TableHead className="text-xl text-center font-light">JM</TableHead>
                        <TableHead className="text-xl text-center font-light">Cena</TableHead>
                        <TableHead className="text-xl text-center font-light">Pakovanje</TableHead>
                        <TableHead className="text-xl justify-center font-light">
                                <div className="flex flex-col items-center justify-center h-full text-center text-xl font-light">
                                    <span>Trebovana</span>
                                    <span>količina</span>
                                </div>
                        </TableHead>
                        <TableHead className="text-xl text-center font-light">Količina</TableHead>
                        <TableHead className="text-xl text-center font-light">Iznos</TableHead>
                        <TableHead className="text-xl text-center font-light">                            
                                <div className="text-xl text-center font-light">
                                    Iznos<br/>sa PDV
                                </div>                    
                        </TableHead>
                        <TableHead>{/*Delte dugme*/}</TableHead>
                        </TableRow>
                    </TableHeader>
                    
                    <TableBody>
                        {articles.map((article, index) => (
                        <TableRow key={index}>
                            <TableCell  className="text-center">
                                <img src={article.imageUrl} alt={article.name} className="w-16 h-16 object-cover mx-auto" />
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-base">{article.name}</span>
                                        <span>{article.sifra}</span>
                                        <span>{article.barkod}</span>
                                    <span className="flex flex-col text-sm text-red-500">
                                        {article.stanje}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell  className="text-center">{article.jm}</TableCell>
                            <TableCell  className="text-center">{article.cena} RSD</TableCell>
                            <TableCell  className="text-center">{article.pakovanje}</TableCell>
                            <TableCell  className="text-center">
                                {/*Trebovana kolicina*/}
                                <input
                                    type="number"
                                    min="0"
                                    className="w-20 border rounded px-2 py-1 text-center"
                                    value={quantities[index]}
                                    onChange={(e) => {
                                        const newQuantities = [...quantities];
                                        newQuantities[index] = Number(e.target.value);
                                        setQuantities(newQuantities);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                        const input = e.target as HTMLInputElement;
                                        const newQuantities = [...quantities];
                                        newQuantities[index] = Number(input.value);
                                        setQuantities(newQuantities);
                                        input.blur(); // opcionalno: skida fokus sa inputa
                                        }
                                    }}
                                />
                            </TableCell>
                            <TableCell className="text-center">
                                {getRoundedQuantity(quantities[index], article.pakovanje)}
                            </TableCell>
                            <TableCell  className="text-center">{(getRoundedQuantity(quantities[index], article.pakovanje) * article.cena).toFixed(2)} RSD</TableCell>
                            <TableCell className="text-center">
                                {(getRoundedQuantity(quantities[index], article.pakovanje) * article.cena * 1.2).toFixed(2)} RSD {/* Pretpostavljam da je PDV 20% */}
                            </TableCell>
                                
                            <TableCell>
                                <Button className="">Ukloni</Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>

                    <TableFooter>
                        <TableRow>
                            {/* Prvih 5 ćelija ostaje prazno jer tamo nema ukupnog sabiranja */}
                            
                            <TableCell className="text-center font-bold">Ukupno:</TableCell>
                            <TableCell colSpan={6}></TableCell>

                            
                            <TableCell className="text-center font-bold">
                                {/* Saberi sve iznose */}
                                    {totalAmount.toFixed(2)} RSD
                            </TableCell>
                            <TableCell className="text-center font-bold">
                                {/* Saberi sve iznose sa PDV */}
                                    {totalAmountWithPDV.toFixed(2)} RSD
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
            
            {/*DUGME NARUCI*/}
            <div className="hidden lg:block w-full mx-auto justify-end text-right p-2">
                <Button variant={"outline"} className="lg:px-6 cursor-pointer">Naruci</Button>
            </div>


            {/*TABELA PHONE*/}
            <div className="space-y-4 block lg:hidden">
                {articles.map((articles, index) => (
                    <Card key={index} className="p-3 shadow-md flex flex-col sm:flex-row gap-1">
                            <img src={articles.imageUrl} alt={articles.name} className="w-50 h-auto object-contain" />
                        <CardContent className="p-0 flex-1 space-y-1 text-sm">
                            <h2 className="font-semibold text-base">{articles.name}</h2>
                            <p className="text-xs text-muted-foreground">{articles.sifra}</p>
                            <p className="text-xs text-muted-foreground">{articles.barkod}</p>
                            <p className="text-xs font-light">Jedinica mere:{articles.jm}</p>
                            <p className="text-lg font-bold text-red-600">{articles.cena} RSD</p>
                            
                            

                            <div className="grid grid-cols-2 gap">
                                <span>Trebovana količina:
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-20 border rounded px-2 py-1 text-center"
                                        value={quantities[index]}
                                        onChange={(e) => {
                                            const newQuantities = [...quantities];
                                            newQuantities[index] = Number(e.target.value);
                                            setQuantities(newQuantities);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                            const input = e.target as HTMLInputElement;
                                            const newQuantities = [...quantities];
                                            newQuantities[index] = Number(input.value);
                                            setQuantities(newQuantities);
                                            input.blur(); // opcionalno: skida fokus sa inputa
                                            }
                                        }}
                                    />
                                </span>
                                
                                <div className="ml-auto flex flex-col">
                                    <span>Pakovanje: {articles.pakovanje}</span>
                                    <span>Kolicina: {getRoundedQuantity(quantities[index], articles.pakovanje)}</span>
                                </div>

                                <div className="mt-3 flex flex-col w-full">
                                    <span className="whitespace-nowrap font-medium">Iznos: {(getRoundedQuantity(quantities[index], articles.pakovanje) * articles.cena).toFixed(2)} RSD</span>
                                    <span className="whitespace-nowrap font-bold">Iznos sa PDV: {(getRoundedQuantity(quantities[index], articles.pakovanje) * articles.cena * 1.2).toFixed(2)} RSD</span>
                                </div>
                            </div>

                            {articles.stanje && (
                            <p className="text-xs text-red-500">{articles.stanje}</p>
                            )}
                        </CardContent>
                    </Card>
                ))}

                    <div className="grid grid-cols-2 text-sm font-semibold pt-4 border-t gap-y-1">
                        <div className="flex justify-between">Ukupno (bez PDV):</div>
                        <div className="whitespace-nowrap text-right">{totalAmount.toFixed(2)} RSD</div>
                        
                        <div className="flex justify-between">Ukupno (sa PDV):</div>
                        <div className="whitespace-nowrap text-right text-lg font-bold text-red-600">{totalAmountWithPDV.toFixed(2)} RSD</div>
                    </div>
                
                <div className="flex justify-end pt-2">
                    <Button className="text-white bg-red-600 hover:bg-red-700">Naruči</Button>
                </div>
            </div>
            


        </div>
    )
}

export default Korpa;


