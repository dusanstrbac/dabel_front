
export interface ArtikalType {
    id?: string,
    idArtikla?: string;
    naziv: string,
    cena: number,
    slika?: string,
    staraCena?: number,
    artikalCene: {
      cena: number;
    }[];
}

export interface ListaArtikalaProps {
  artikli?: ArtikalType[]  // opcioni prop, default prazan niz
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
