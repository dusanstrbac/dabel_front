'use client';
import ArticleCard from "@/components/ArticleCard";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
  
import SortirajDugme from "@/components/ui/sortirajDugme";
  


const novo = () => {

    return (
        <div className="p-4">
          
          
          {/* Dugme Sortiraj poravnato desno
            Ali ne znam šta se tačno dešava MORA PONOVO
          */}
            <div className="max-w-7xl mx-auto flex justify-between items-center p-2">
                
                {/*Naslov*/}
                <h1 className="font-bold text-3xl">Novopristigli artikli</h1>
            
            <SortirajDugme/>
            </div>

      
            {/* Kartice */}
            <div className="max-w-7xl mx-auto grid gap-4 p-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <ArticleCard/>
                <ArticleCard/>
                <ArticleCard/>
                <ArticleCard/>
                <ArticleCard/>
                <ArticleCard/>
                <ArticleCard/>
                <ArticleCard/>
            </div>
            



            {/* Paginacija */}
            <Pagination className="mt-5 mb-5 flex items-center">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#">Prethodna</PaginationPrevious>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#">Sledeca</PaginationNext>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
      )
}

export default novo;