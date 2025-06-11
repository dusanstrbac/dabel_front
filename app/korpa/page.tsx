'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import NaruciButton from "@/components/ui/NaruciButton";

const Korpa = () => {
    const [articleList, setArticleList] = useState<any[]>([]);
    const [quantities, setQuantities] = useState<number[]>([]);
    const [isClient, setIsClient] = useState(false); 

    useEffect(() => {
        setIsClient(true);

        const cart = JSON.parse(localStorage.getItem("cart") || "{}");
        const storedIds = Object.keys(cart);
        if(storedIds.length == 0){
            return;
        }
        const queryString = storedIds.map(id => `ids=${id}`).join("&");
        const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
        const url = `${apiAddress}/api/Artikal/DajArtikalId?${queryString}`;

        const fetchArticles = async () => {
            try {
            const response = await fetch(
                url
            );
            const data = await response.json();

            const transformed = data.map((artikal: any) => ({
            ...artikal,
            id: artikal.idArtikla,
            cena: artikal.artikalCene?.[0]?.cena ?? 0,   // uzmi cenu iz artikalCene
            pakovanje: Number(artikal.pakovanje) || 1,    // konvertuj pakovanje u broj, podrazumevano 1
            }));

            console.log("Transformed data:", transformed);

            setArticleList(transformed);
            setQuantities(transformed.map((a: any) => cart[a.id]?.kolicina || a.pakovanje));
            } catch (error) {
            console.error("Greška pri učitavanju artikala iz API-ja:", error);
            }
        };
        fetchArticles();
    }, []);

    const isprazniKorpu = () => {
        setArticleList([]);
        setQuantities([]);
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("storage")); //za izbacivanje broja na ikonici korpe posle brisanja artikala iz korpe
    };

    const removeArticle = (index: number) => {
        const updatedArticles = [...articleList];
        const updatedQuantities = [...quantities];

        const removed = updatedArticles.splice(index, 1)[0];
        updatedQuantities.splice(index, 1);

        setArticleList(updatedArticles);
        setQuantities(updatedQuantities);

        const cart = JSON.parse(localStorage.getItem("cart") || "{}");
        delete cart[removed.id];
        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("storage")); //za smanjivanje broja na ikonici korpe posle brisanja jednog artikla iz korpe
    };

    const updateQuantity = (index: number, newQuantity: number) => {
        const updatedQuantities = [...quantities];
        updatedQuantities[index] = newQuantity;
        setQuantities(updatedQuantities);

        const cart = JSON.parse(localStorage.getItem("cart") || "{}");
        const articleId = articleList[index].id;
        cart[articleId] = { kolicina: newQuantity };
        localStorage.setItem("cart", JSON.stringify(cart));
    };

    const getRoundedQuantity = (requested: number, packSize: number) => {
        if (requested <= 0 || isNaN(requested)) return 0;
        return requested <= packSize
            ? packSize
            : Math.ceil(requested / packSize) * packSize;
    };

    const totalAmount = quantities.reduce((sum, quantity, index) => {
        const packSize = articleList[index]?.pakovanje || 1;
        const cena = articleList[index]?.artikalCene?.[0]?.cena ?? 0;
        const rounded = getRoundedQuantity(quantity, packSize);
        return sum + rounded * cena;
    }, 0);

    const totalAmountWithPDV = totalAmount * 1.2;


    if (!isClient) return null; // Ne renderuj ništa dok ne budeš siguran da si na klijentu

    return (
        <div className="flex flex-col p-2 md:p-5">
            <div className="flex flex-wrap justify-between items-center gap-2">
                <h1 className="font-bold text-lg">Pregled korpe</h1>
                <Button onClick={isprazniKorpu} variant={"outline"} className="cursor-pointer">Isprazni korpu</Button>
            </div>

            {/* DESKTOP */}
            <div className="flex-col flex-wrap py-3 hidden lg:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead />
                            <TableHead className="text-xl font-light">Naziv artikla</TableHead>
                            <TableHead className="text-xl text-center font-light">JM</TableHead>
                            <TableHead className="text-xl text-center font-light">Cena</TableHead>
                            <TableHead className="text-xl text-center font-light">Pakovanje</TableHead>
                            <TableHead className="text-xl text-center font-light">Trebovana količina</TableHead>
                            <TableHead className="text-xl text-center font-light">Količina</TableHead>
                            <TableHead className="text-xl text-center font-light">Iznos</TableHead>
                            <TableHead className="text-xl text-center font-light">Iznos sa PDV</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {articleList.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={10} className="italic text-center py-4">
                                    Ni jedan artikal nije dodat u korpu.
                                </TableCell>
                            </TableRow>
                        )}
                        {articleList.map((article, index) => {
                            const cena = article.artikalCene?.[0]?.cena ?? 0;
                            const pakovanje = article.pakovanje || 1;

                            return (
                            <TableRow key={index}>
                                <TableCell className="text-center">
                                    <img src='/artikal.jpg' alt={article.naziv} className="w-16 h-16 object-cover" />
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-base">{article.naziv}</span>
                                        <span>Šifra: {article.id}</span>
                                        <span>BarKod: {article.barkod}</span>
                                        <span className="text-sm text-red-500">{article.stanje}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">{article.jm}</TableCell>
                                <TableCell className="text-center">{cena} RSD</TableCell>
                                <TableCell className="text-center">{pakovanje}</TableCell>
                                <TableCell className="text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-20 border rounded px-2 py-1 text-center"
                                        value={quantities[index]}
                                        onChange={(e) => updateQuantity(index, Number(e.target.value))}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                const input = e.target as HTMLInputElement;
                                                updateQuantity(index, Number(input.value));
                                                input.blur();
                                            }
                                        }}
                                    />
                                </TableCell>
                                <TableCell className="text-center">
                                    {getRoundedQuantity(quantities[index], pakovanje)}
                                </TableCell>
                                <TableCell className="text-center">
                                    {(getRoundedQuantity(quantities[index], pakovanje) * cena).toFixed(2)} RSD
                                </TableCell>
                                <TableCell className="text-center">
                                    {(getRoundedQuantity(quantities[index], pakovanje) * cena * 1.2).toFixed(2)} RSD
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => removeArticle(index)}>Ukloni</Button>
                                </TableCell>
                            </TableRow>
                            );
                        })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell className="font-bold text-center">Ukupno:</TableCell>
                            <TableCell colSpan={6}></TableCell>
                            <TableCell className="text-center font-bold">{totalAmount.toFixed(2)} RSD</TableCell>
                            <TableCell className="text-center font-bold">{totalAmountWithPDV.toFixed(2)} RSD</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableFooter>
                </Table>

                <div className="flex justify-end pt-2">
                    <NaruciButton />
                </div>
            </div>

            {/* MOBILNA VERZIJA */}
            <div className="py-2 block lg:hidden">
                {articleList.map((article, index) => {
                    const cena = article.artikalCene?.[0]?.cena ?? 0;
                    const pakovanje = article.pakovanje || 1;

                    return (
                    <Card key={index} className="p-3 shadow-md flex flex-col sm:flex-row gap-2 items-center">
                        <img src={article.imageUrl || "/artikal.jpg"} alt={article.naziv} className="w-32 h-auto object-contain" />
                        <CardContent className="flex-1">
                            <h2 className="font-semibold">{article.naziv}</h2>
                            <div className="text-sm text-muted-foreground">
                                <p>Šifra: {article.id}</p>
                                <p>Barkod: {article.barkod}</p>
                                <p>JM: {article.jm}</p>
                                <p className="font-bold text-red-600">{cena} RSD</p>
                            </div>
                            <div className="pt-2">
                                <span>
                                    Trebovana količina:{" "}
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-20 border rounded px-2 py-1 text-center"
                                        value={quantities[index]}
                                        onChange={(e) => updateQuantity(index, Number(e.target.value))}
                                    />
                                </span>
                                <div>
                                    <p>Pakovanje: {pakovanje}</p>
                                    <p>Količina: {getRoundedQuantity(quantities[index], pakovanje)}</p>
                                </div>
                                <p>Iznos: {(getRoundedQuantity(quantities[index], pakovanje) * cena).toFixed(2)} RSD</p>
                                <p className="font-bold">Sa PDV: {(getRoundedQuantity(quantities[index], pakovanje) * cena * 1.2).toFixed(2)} RSD</p>
                                <div>
                                    <Button onClick={() => removeArticle(index)}>Ukloni</Button>
                                </div>
                            </div>
                            {article.stanje && <p className="text-red-500">{article.stanje}</p>}
                        </CardContent>
                    </Card>
                    );
                })}
                <div className="flex justify-between font-semibold py-5">
                    <span>Ukupno (bez PDV):</span>
                    <span>{totalAmount.toFixed(2)} RSD</span>
                </div>
                <div className="flex justify-between font-semibold text-red-600">
                    <span>Ukupno (sa PDV):</span>
                    <span>{totalAmountWithPDV.toFixed(2)} RSD</span>
                </div>
                <div className="flex justify-end pt-2">
                    <NaruciButton />
                </div>
            </div>
        </div>
    );
};

export default Korpa;
