import * as React from "react";
import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react"; // dodaj ovo za tip

type IconComponentProps = {
  name: string;
  className?: string;
  size?: number;
};

export default function IconComponent({
  name,
  className = "w-4 h-4",
  size = 16,
}: IconComponentProps) {
  // Funkcija za normalizaciju imena (male slike, bez viška razmaka, itd.)
  function normalizeName(name: string): string {
    return name.trim().toLowerCase().replace(/[\s,]+/g, " ");
  }

  // Mapa: normalizovani naziv -> ime ikone
  const iconMap: Record<string, keyof typeof LucideIcons> = {
    "okov građevinski": "Bolt",
    "okov nameštaj": "Sofa",
    "kontrola pristupa": "Vault",
    "ručni alat": "Hammer",
    "led rasveta": "Lightbulb",
    "klizni okov građevina nameštaj": "Rows2",
    "elementi za pričvršćivanje": "LinkIcon",

    "spojnice": "Link2",
    "ručke": "HandMetal",
    "delovi za sajle": "Cable",
    "tiplovi": "CircleDot",
    "drvo": "TreeDeciduous",
    "podloške navrtke": "CircleEllipsis",
    "kapice": "CircleSlash",

    "akcije": "BadgePercent",
    "novopristigli artikli": "Package",
    "omiljeni artikli": "Heart",
    "korpa": "ShoppingCart",
    "moj profil": "User",
  };

  const normalized = normalizeName(name);
  const iconKey = iconMap[normalized] || "LinkIcon";

  // Sad bezbedno kastujemo u LucideIcon (što je zapravo React.FC sa propovima `className` i `size`)
  const Icon = LucideIcons[iconKey] as LucideIcon;

  // Bezbedna provera da li komponenta postoji
  if (!Icon) {
    const FallbackIcon = LucideIcons.LinkIcon as LucideIcon;
    return <FallbackIcon className={className} size={size} />;
  }

  return <Icon className={className} size={size} />;
}
