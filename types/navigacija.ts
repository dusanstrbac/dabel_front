  type NavigacijaItem = {
  text: string;
  href: string;
  icon?: React.ReactNode;
  subMenuItems?: {
    text: string;
    href: string;
    icon?: React.ReactNode;
  }[];
};

type SubNavigacijaItem = {
  icon: React.ReactNode;
  text: string;
  href: string;
};

