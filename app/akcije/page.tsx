'use client';
import ActionCard from "@/components/ActionCard";

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
  


const akcije = () => {

    return (
        <div className="p-4">
          
          
          {/* Dugme Sortiraj poravnato desno
            Ali ne znam šta se tačno dešava MORA PONOVO
          */}
            <div className="max-w-7xl mx-auto flex justify-between items-center p-2">
                
                {/*Naslov*/}
                <h1 className="font-bold text-3xl">Akcija</h1>
            
            <SortirajDugme/>
            </div>

      
            {/* Kartice */}
            <div className="max-w-7xl mx-auto grid gap-4 p-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <ActionCard />
                <ActionCard />
                <ActionCard />
                <ActionCard />
                <ActionCard />
                
                <ActionCard />
                <ActionCard />
                <ActionCard />
                <ActionCard />
                <ActionCard />
                <ActionCard />
                <ActionCard />
                <ActionCard />
                <ActionCard />
                <ActionCard />
                <ActionCard />
                <ActionCard />
                <ActionCard />
                <ActionCard />
                <ActionCard />
            </div>
        



            {/* Paginacija */}
            <Pagination className="my-5 flex items-center">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
      )
}

export default akcije;