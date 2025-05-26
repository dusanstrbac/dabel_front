'use client';

import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

// Navigacija za paginaciju
function Paginacija({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="paginacija"
      data-slot="paginacija"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

// Kontejner za sadržaj stranica
function PaginacijaSadrzaj({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="paginacija-sadrzaj"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

// Stavka u paginaciji
function PaginacijaStavka({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="paginacija-stavka" {...props} />;
}

// Tipovi za link
type PaginacijaLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
} & Pick<React.ComponentProps<"a">, "href" | "children" | "className"> & {
  size?: "default" | "icon" | "sm" | "lg";
};

function PaginacijaLink({
  className,
  isActive,
  size = "icon",
  href = "#",
  onClick,
  children,
  disabled,
  ...props
}: PaginacijaLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      aria-disabled={disabled}
      data-slot="paginacija-link"
      data-active={isActive}
      onClick={handleClick}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

// Prethodna stranica
function PaginacijaPrethodna({
  className,
  ...props
}: React.ComponentProps<typeof PaginacijaLink>) {
  return (
    <PaginacijaLink
      aria-label="Idi na prethodnu stranicu"
      size="default"
      className={cn(
        "flex items-center gap-2 justify-center",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1 justify-center">
        <ChevronLeftIcon className="h-5 w-5" />
        <span className="hidden sm:block">Prethodna</span>
      </div>
    </PaginacijaLink>
  );
}

// Sledeća stranica
function PaginacijaSledeca({
  className,
  ...props
}: React.ComponentProps<typeof PaginacijaLink>) {
  return (
    <PaginacijaLink
      aria-label="Idi na sledeću stranicu"
      size="default"
      className={cn(
        "flex items-center gap-2 justify-center",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1 justify-center">
        <span className="hidden sm:block">Sledeća</span>
        <ChevronRightIcon className="h-5 w-5" />
      </div>
    </PaginacijaLink>
  );
}

// Višestruke stranice (npr. ... )
function PaginacijaTackice({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="paginacija-tackice"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">Još stranica</span>
    </span>
  );
}

// Glavna komponenta za paginaciju
interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  className,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Provera da li je komponenta mountovana
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync sa URL parametrima
  React.useEffect(() => {
    if (!isMounted) return;
    
    const page = searchParams.get('page');
    if (page) {
      const pageNumber = parseInt(page, 10);
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
        onPageChange(pageNumber);
      }
    }
  }, [searchParams, isMounted, totalPages, onPageChange]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    onPageChange(page);
    router.push(`?page=${page}`, { scroll: false });
  };

  if (totalPages <= 1) return null;

  return (
    <Paginacija className={className}>
      <PaginacijaSadrzaj>
        <PaginacijaStavka>
          <PaginacijaPrethodna
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
        </PaginacijaStavka>

        {Array.from({ length: totalPages }, (_, i) => {
          const page = i + 1;
          
          // Prikazujemo prvu stranicu, poslednju i okolinu trenutne
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <PaginacijaStavka key={page}>
                <PaginacijaLink
                  isActive={currentPage === page}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </PaginacijaLink>
              </PaginacijaStavka>
            );
          }

          // Dodajemo "..." između blokova
          if (
            (page === 2 && currentPage > 3) ||
            (page === totalPages - 1 && currentPage < totalPages - 2)
          ) {
            return (
              <PaginacijaStavka key={`ellipsis-${page}`}>
                <PaginacijaTackice />
              </PaginacijaStavka>
            );
          }

          return null;
        })}

        <PaginacijaStavka>
          <PaginacijaSledeca
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </PaginacijaStavka>
      </PaginacijaSadrzaj>
    </Paginacija>
  );
}

export {
  Paginacija,
  PaginacijaSadrzaj,
  PaginacijaLink,
  PaginacijaStavka,
  PaginacijaPrethodna,
  PaginacijaSledeca,
  PaginacijaTackice,
  Pagination as default
};