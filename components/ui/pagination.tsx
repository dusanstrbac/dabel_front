'use client';

import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

// Hook za praćenje da li je ekran mobilni (širina < 640px)
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < breakpoint);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}

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

function PaginacijaSadrzaj({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="paginacija-sadrzaj"
      className={cn("flex flex-row items-center gap-1 flex-wrap justify-center", className)}
      {...props}
    />
  );
}

function PaginacijaStavka({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="paginacija-stavka" {...props} />;
}

type PaginacijaLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <Button
      aria-current={isActive ? "page" : undefined}
      disabled={disabled}
      onClick={handleClick}
      type="button"
      data-slot="paginacija-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size: size === "default" ? "sm" : size,
        }),
        disabled && "pointer-events-none opacity-50",
        isActive && "bg-blue-600 text-white border-blue-600",
        !isActive && "hover:bg-blue-200 hover:border-blue-400",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

function PaginacijaPrethodna({
  className,
  ...props
}: React.ComponentProps<typeof PaginacijaLink>) {
  const t = useTranslations();
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
        <span className="hidden sm:block">{t('Paginacija.Prethodna')}</span>
      </div>
    </PaginacijaLink>
  );
}

function PaginacijaSledeca({
  className,
  ...props
}: React.ComponentProps<typeof PaginacijaLink>) {
  const t = useTranslations();
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
        <span className="hidden sm:block">{t('Paginacija.Sledeca')}</span>
        <ChevronRightIcon className="h-5 w-5" />
      </div>
    </PaginacijaLink>
  );
}

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
  const isMobile = useIsMobile();

  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const handlePageChange = (page: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (page < 1 || page > totalPages || page === currentPage) return;

    onPageChange(page);
    router.push(`?page=${page}`, { scroll: false });
  };

  if (totalPages <= 1) return null;

  // Paginacija za mobilni prikaz
  const mobilePages = [
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ].filter(p => p >= 1 && p <= totalPages);

  return (
    <Paginacija className={className}>
      <PaginacijaSadrzaj>
        <PaginacijaStavka>
          <PaginacijaPrethodna
            onClick={(e) => handlePageChange(currentPage - 1, e)}
            disabled={currentPage === 1}
          />
        </PaginacijaStavka>

        {isMobile
          ? mobilePages.map((page) => (
              <PaginacijaStavka key={page}>
                <PaginacijaLink
                  isActive={currentPage === page}
                  onClick={(e) => handlePageChange(page, e)}
                  size="sm"
                >
                  {page}
                </PaginacijaLink>
              </PaginacijaStavka>
            ))
          : Array.from({ length: totalPages }, (_, i) => {
              const page = i + 1;
              // Desktop: prikaži prvu, poslednju i okolinu trenutne stranice
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <PaginacijaStavka key={page}>
                    <PaginacijaLink
                      isActive={currentPage === page}
                      onClick={(e) => handlePageChange(page, e)}
                    >
                      {page}
                    </PaginacijaLink>
                  </PaginacijaStavka>
                );
              }

              if (
                (page === 2 && currentPage > 3) ||
                (page === totalPages - 1 && currentPage < totalPages - 2)
              ) {
                // Tackice na desktopu
                return (
                  <PaginacijaStavka key={`ellipsis-${page}`}>
                    <span className="flex h-9 w-9 items-center justify-center text-gray-500 select-none">
                      ...
                    </span>
                  </PaginacijaStavka>
                );
              }

              return null;
            })}
        
        <PaginacijaStavka>
          <PaginacijaSledeca
            onClick={(e) => handlePageChange(currentPage + 1, e)}
            disabled={currentPage === totalPages}
          />
        </PaginacijaStavka>
      </PaginacijaSadrzaj>
    </Paginacija>
  );
}

export {
  Pagination,
  Paginacija,
  PaginacijaSadrzaj,
  PaginacijaLink,
  PaginacijaStavka,
  PaginacijaPrethodna,
  PaginacijaSledeca,
  Pagination as default
};
