"use client";
import { JSX, useEffect, useState } from "react";
import Link from "next/link";
import { MenuIcon, ShoppingCart, User, Heart, BadgePercent, LinkIcon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Separator } from "./ui/separator";
import IconComponent from "./IconComponent";
import { useTranslations } from "next-intl";

interface SubMenuItem {
  text: string;
  href: string;
}

interface NavItem {
  text: string;
  href: string;
  icon: JSX.Element;
  subMenuItems?: SubMenuItem[];
}

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [headerMainNav, setHeaderMainNav] = useState<NavItem[]>([]);
  const t = useTranslations("header");

  const dodatniLinkovi = [
    { text: t('header-NavAkcije'), href: "/akcije", icon: <BadgePercent className="w-5 h-5" /> },
    { text: t('header-NavNovoPristigli'), href: "/novo", icon: <LinkIcon className="w-5 h-5" /> },
    { text: t('header-NavOmiljeniArtikli'), href: "/heart", icon: <Heart className="w-5 h-5" /> },
    { text: t('header-NavKorpa'), href: "/korpa", icon: <ShoppingCart className="w-5 h-5" /> },
    { text: t('header-NavMojProfil'), href: "/profil", icon: <User className="w-5 h-5" /> },
  ];

  useEffect(() => {
    const fetchNav = async () => {
      try {
        const api = process.env.NEXT_PUBLIC_API_ADDRESS;
        const res = await fetch(`${api}/api/Web/KategorijeNavigacija`);
        const data: any[] = await res.json();

        const mapped = data.map((item) => ({
          icon: <IconComponent name={item.naziv} />,
          text: item.naziv,
          href: `/proizvodi/kategorija/${encodeURIComponent(item.naziv)}`,
          subMenuItems: item.deca?.length
            ? item.deca.map((sub: any) => ({
                text: sub.naziv,
                href: `/proizvodi/kategorija/${encodeURIComponent(item.naziv)}/${encodeURIComponent(sub.naziv)}`
              }))
            : null
        }));

        setHeaderMainNav(mapped);
      } catch (error) {
        console.error("Greška pri fetch-ovanju navigacije:", error);
      }
    };

    fetchNav();
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button onClick={() => setIsOpen(true)}>
          <MenuIcon className="w-8 h-8" />
        </button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-scroll">
        <SheetHeader>
          <SheetTitle>Meni</SheetTitle>
          <Separator />
        </SheetHeader>

        <div className="pl-2 flex flex-col gap-2 mb-5">
          <Accordion type="single" collapsible className="flex flex-col gap-4">
            {headerMainNav.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="flex items-center gap-3 pl-2">
                  {item.icon}
                  <span className="text-[18px]">{item.text}</span>
                </AccordionTrigger>

                <AccordionContent className="pl-10">
                  {item.subMenuItems ? (
                    <ul className="flex flex-col gap-1">
                      {item.subMenuItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={subItem.href}
                            className="block px-2 py-1 text-[16px] text-gray-700 hover:bg-gray-100 rounded transition-colors"
                            onClick={handleLinkClick}
                          >
                            {subItem.text}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex flex-row items-center gap-3 p-1 hover:bg-gray-100 rounded transition-colors"
                      onClick={handleLinkClick}
                    >
                      <span className="text-[18px]">{item.text}</span>
                    </Link>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="flex flex-col gap-4 mt-2">
            {dodatniLinkovi.map((item, index) => (
              <Link
                key={`add-${index}`}
                href={item.href}
                className="text-[18px] flex items-center justify-between px-2 font-semibold"
                onClick={handleLinkClick}
              >
                {item.icon}
                <span>{item.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HamburgerMenu;
