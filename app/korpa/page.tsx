'use client';
import ArticleCard from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect } from "react";
import NaruciButton from "@/components/ui/NaruciButton";
  



const Korpa = () => {

    //primer podataka o artiklima
    const [articleList, setArticleList] = useState([
        {
          imageUrl: "korpa1.jpg",
          name: "Kvaka šild za vrata JELENA B-Ni 90/42/254/10/108/8/9 .Klj DBP0 1",
          sifra: "Šifra proizvoda: 0101095",
          barkod: "Barkod: 8605004250936",
          stanje: "Artikal nije na stanju do: 15.12.2025!",
          jm: "KD",
          cena: 929.5,
          pakovanje: 4.0,
          kolicina: 8.0,
        },
        {
          imageUrl: "korpa2.jpg",
          name: "Nosač police konzolni N1103 Bela 250x300/49/0,9mm Q",
          sifra: "Šifra proizvoda: 3304094",
          barkod: "Barkod: 8605004204519",
          stanje: "",
          jm: "KD",
          cena: 68.75,
          pakovanje: 20.0,
          kolicina: 20.0,
        },
    ]);
    

    //prazni celu korpu
    const isprazniKorpu = () => {
        setArticleList([]);
        setQuantities([]);
    };
      


    //brise jedan artikal iz korpe
    const removeArticle = (index: number) => {
        const updatedArticles = [...articleList];
        updatedArticles.splice(index, 1);
      
        const updatedQuantities = [...quantities];
        updatedQuantities.splice(index, 1);
      
        setArticleList(updatedArticles);
        setQuantities(updatedQuantities);
    };
      
    
    

    //mapira artikle??? ne znam sta ovo bese radi
    const [quantities, setQuantities] = useState(
        articleList.map((article) => article.kolicina)
    );


    //izracunavanje ukupne cene koja treba da se plati
    const totalAmount = quantities.reduce((sum, quantity, index) => {
        const rounded = getRoundedQuantity(quantity, articleList[index].pakovanje)
        return sum + rounded * articleList[index].cena;
    }, 0);

    const totalAmountWithPDV = totalAmount * 1.2;

    
    //fja za zaokruzivanje na sledeci moguci br pakovanja
    function getRoundedQuantity(requested: number, packSize: number) {
        if (requested <= 0 || isNaN(requested)) return 0;
        return requested <= packSize
          ? packSize
          : Math.ceil(requested / packSize) * packSize;
    }
    

    
      

    
    

    return (

        
        <div className="flex flex-col p-2 md:p-5">
            {/*NASLOV*/}
            <div className="flex flex-wrap justify-between items-center gap-2">
                <h1 className="font-bold text-2xl">Pregled korpe</h1>
                <Button onClick={isprazniKorpu} variant={"outline"} className="cursor-pointer">Isprazni korpu</Button>
            </div>

            {/*DESKTOP TABELA*/}
            <div className="flex-col flex-wrap py-3 hidden lg:block">
                <Table className="">
                    <TableHeader>
                        <TableRow className="">
                        <TableHead className="text-xl">{/*slika*/}</TableHead>
                        <TableHead className="text-xl font-light">Naziv artikla</TableHead>
                        <TableHead className="text-xl text-center font-light">JM</TableHead>
                        <TableHead className="text-xl text-center font-light">Cena</TableHead>
                        <TableHead className="text-xl text-center font-light">Pakovanje</TableHead>
                        <TableHead className="text-xl justify-center font-light">
                                <div className="flex flex-col text-center font-light">
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

                        {articleList.length === 0 && (
                            <p className="italic w-full text-center py-4">Ni jedan artikal nije dodat u korpu.</p>
                        )}


                        {articleList.map((article, index) => (
                        <TableRow key={index} className="items-center flex-col flex-wrap">
                            <TableCell  className="text-center">
                                <img src={article.imageUrl} alt={article.name} className="w-16 h-16 object-cover" />
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
                                <Button onClick={() => removeArticle(index)}>Ukloni</Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>

                    <TableFooter>
                        <TableRow>
                            {/* Prvih 6 ćelija ostaje prazno jer tamo nema ukupnog sabiranja */}
                            
                            <TableCell className="px-5 text-start font-bold">Ukupno:</TableCell>
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

                {/*DUGME NARUCI*/}
                <div className="flex flex-wrap justify-end py-2"><NaruciButton/></div>
            </div>
            
            
            


            {/*TABELA PHONE*/}
            <div className="py-2 block lg:hidden">
                {articleList.map((articles, index) => (

                    <Card key={index} className="p-3 shadow-md flex sm:flex-row gap-1 items-center">
                            <img src={articles.imageUrl} alt={articles.name} className="w-50 h-auto object-contain" />
                        <CardContent className="py-5 flex-1 items-center">
                            <h2 className="flex-wrap font-semibold text-base">{articles.name}</h2>
                            <div className="flex-col flex-wrap py-1">
                                <p className="text-xs text-muted-foreground">{articles.sifra}</p>
                                <p className="text-xs text-muted-foreground">{articles.barkod}</p>
                                <p className="text-xs text-muted-foreground">Jedinica mere: {articles.jm}</p>
                                <p className="text-lg font-bold text-red-600">{articles.cena} RSD</p>
                            </div>
                            <div className="ml-auto flex-col flex-wrap">
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

                                <div className="flex flex-col flex-wrap">
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

                    <div className="flex items-center justify-between font-semibold py-5 gap-2">
                        <div className="whitespace-nowrap flex flex-wrap">Ukupno (bez PDV):</div>
                        <div className="whitespace-nowrap text-right">{totalAmount.toFixed(2)} RSD</div>
                    </div>
                    <div className="flex flex-wrap justify-between items-center font-semibold">
                        <div className="flex flex-wrap">Ukupno (sa PDV):</div>
                        <div className="whitespace-nowrap text-right text-red-600">{totalAmountWithPDV.toFixed(2)} RSD</div>
                    </div>
                
                <div className="flex justify-end pt-2">
                    <div className=""><NaruciButton/></div>
                </div>
            </div>
            


        </div>
    )
}

export default Korpa;


