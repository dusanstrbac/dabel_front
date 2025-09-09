import { useState } from "react";
import { BadgePercent, Bolt, Hammer, Heart, Lightbulb, LinkIcon, MenuIcon, Rows2, ShoppingCart, Sofa, User, Vault } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import Link from "next/link";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const headerMainNav = [ 
    { icon: <Bolt className="w-4 h-4"/>, text: 'Okov građevinski', href: '/okov-gradjevinski'},
    { icon: <Sofa className="w-4 h-4"/>, text: 'Okov nameštaj', href: '/okov-namestaj'},
    { icon: <Rows2 className="w-4 h-4"/>, text: 'Klizni okov za građevinu, nameštaj', href: '/klizni-okov'},
    { 
      icon: <LinkIcon className="w-4 h-4"/>, 
      text: 'Elementi za pričvršćivanje', 
      href: '/elementi-pricvrscivanje', 
      subMenuItems:[
        { text: 'Spojnice', href: '/elementi-spojnice'},
        { text: 'Ručke', href: '/elementi-rucke'},
        { text: 'Delovi za sajle', href: '/elementi-sajle'},
        { text: 'Tiplovi', href: '/elementi-tiplovi'},
        { text: 'Drvo', href: '/elementi-drvo'},
        { text: 'Podloške, navrtke', href: '/elementi-podloske'},
        { text: 'Kapice', href: '/elementi-kapice'},
      ]
    },
    { icon: <Lightbulb className="w-4 h-4"/>, text: 'LED rasveta', href: '/led-rasveta'},
    { icon: <Vault className="w-4 h-4"/>, text: 'Kontrola pristupa', href: '/kontrola-pristupa'},
    { icon: <Hammer className="w-4 h-4"/>, text: 'Ručni alat', href: '/rucni-alat'},
  ];

  const dodatniLinkovi = [
    { icon: <BadgePercent className="w-4 h-4" />, text: "Akcije", href: "/akcije" },
    { icon: <LinkIcon className="w-4 h-4" />, text: "Novopristigli artikli", href: "/novo" },
    { icon: <Heart className="w-4 h-4" />, text: "Omiljeni artikli", href: "/heart" },
    { icon: <ShoppingCart className="w-4 h-4" />, text: "Korpa", href: "/korpa" },
    { icon: <User className="w-4 h-4" />, text: "Moj profil", href: "/profil" },
  ];

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
          <SheetTitle>Menu</SheetTitle>
          <Separator />
        </SheetHeader>

        <div className="pl-2 flex flex-col gap-2 mb-[20px]">
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

          <div className="flex flex-col gap-8 mt-2">
            {dodatniLinkovi.map((item, index) => (
              <Link
                key={`add-${index}`}
                href={item.href}
                className="text-[18px] flex items-center justify-between px-2 font-semibold"
                onClick={handleLinkClick}
              >
                {item.icon}
                <span>{item.text}</span>
                <div></div>
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default HamburgerMenu;