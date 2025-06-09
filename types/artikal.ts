export type ArtikalType = {
  idArtikla: string;
  naziv: string;
  barkod: string;
  jm: string;
  kategorijaId: string;
  artikalCene: ArtikalCena[];
  artikalAtributi: ArtikalAtribut[];
};

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

export type ArtikalAtribut = {
  idArtikla: string;
  imeAtributa: string;
  vrednost: string;
};

export interface ListaArtikalaProps {
  artikli?: ArtikalType[] 
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
