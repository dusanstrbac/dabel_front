export type ArtikalType = {
  idArtikla: string;
  naziv: string;
  barkod: string;
  jm: string;
  kolicina: string;
  kategorijaId: string;
  status?: string;
  kolZaIzdavanje?: number;
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
  artikli: any[];
  atributi?: AtributiResponse; // Promenjeno iz ArtikalAtribut[] u AtributiResponse
  kategorija: string;
  podkategorija: string | null;
  totalCount: number;
  currentPage: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

interface AtributiResponse {
  [artikalId: string]: ArtikalAtribut[];
}

export interface SortiranjeButtonProps {
    artikli: ArtikalType[];
    setArtikli: React.Dispatch<React.SetStateAction<ArtikalType[]>>;
}

export interface ArtikalFilterProp {
  cena?: string; // tip je string u formatu "min-max"
  naziv: string;
  jm: string[];
  Materijal: string[];
  Model: string[];
  Pakovanje: string[];
  RobnaMarka: string[];
  Upotreba: string[];
  Boja: string[];
  
  [key: string]: string | string[] | undefined; // Dodaj indeksnu potpisu
}

export const defaultFilters: ArtikalFilterProp = {
  naziv: '',
  jm: [],
  Materijal: [],
  Model: [],
  Pakovanje: [],
  RobnaMarka: [],
  Upotreba: [],
  Boja: [],
  
};




