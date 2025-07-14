export type ArtikalType = {
  idArtikla: string;
  naziv: string;
  barkod: string;
  jm: string;
  kolicina: string;
  kategorijaId: string;
  status?: string;
  originalnaCena?: number;
  artikalCene: ArtikalCena[];
  artikalAtributi: ArtikalAtribut[];
};

export type AritkalKorpaType = {
  idArtikla: string;
  jm: string;
  naziv: string;
  kolicina: number;
  originalnaCena: number;
  IznosSaPDV: number;
  koriscenaCena: number;
  pdv: number;
  rabat: number;
}

export type ArtikalCena = {
  id: string;
  idCenovnika: string;
  valutaISO: string;
  idArtikla: string;
  cena: number;
  akcija: {
    idArtikla: string;
    cena: number;
    datumOd: string;
    datumDo: string;
    tipAkcije: string;
    kolicina: number;
    naziv: string;
    staraCena: string;
  };
};

export type artikalProp = {
  idArtikla: string;
  naziv: string;
  barkod: string;
  jm: string;
};
export type StavkaType = {
  naziv: string;
  opis: string;
  vrednost: string;
};


export type ArtikalAtribut = {
  idArtikla: string;
  imeAtributa: string;
  vrednost: string;
};

export interface ListaArtikalaProps {
  artikli: ArtikalType[];
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export interface SortiranjeButtonProps {
    artikli: ArtikalType[];
    setArtikli: React.Dispatch<React.SetStateAction<ArtikalType[]>>;
}

export interface ArtikalFilterProp {
  naziv: string;
  jedinicaMere: string;
  Materijal: string[];
  Model: string[];
  Pakovanje: string[];
  RobnaMarka: string[];
  Upotreba: string[];
  Boja: string[];
  
  [key: string]: string | string[]; // Dodaj indeksnu potpisu
}

export const defaultFilters: ArtikalFilterProp = {
  naziv: '',
  jedinicaMere: '',
  Materijal: [],
  Model: [],
  Pakovanje: [],
  RobnaMarka: [],
  Upotreba: [],
  Boja: [],
  
};




