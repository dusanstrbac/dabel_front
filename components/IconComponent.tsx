import * as React from "react";
import * as LucideIcons from "lucide-react";

type IconComponentProps = {
  name: string;
  className?: string;
  size?: number;
};

export default function IconComponent({ name, className = "w-4 h-4", size = 16 }: IconComponentProps) {
  const fallback = LucideIcons.LinkIcon;

  const iconMap: Record<string, keyof typeof LucideIcons> = {
    "Okov građevinski": "Bolt",
    "Okov nameštaj": "Sofa",
    "LED rasveta": "Lightbulb",
    "Kontrola pristupa": "Vault",
    "Ručni alat": "Hammer",
    "Klizni okov za građevinu, nameštaj": "Rows2",
    "Elementi za pričvršćivanje": "LinkIcon",
  };

  const iconKey = iconMap[name] || "LinkIcon";
  const LucideIcon = LucideIcons[iconKey] as React.FC<{ className?: string; size?: number }>;

  return <LucideIcon className={className} size={size} />;
}
