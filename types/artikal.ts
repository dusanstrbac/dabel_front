
export interface ArtikalType {
    id?: string,
    naziv: string,
    cena: number,
    slika?: string,
    staraCena?: number,
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
  cena?: [number, number];
  jedinicaMere?: string;
  Materijal?: string[];
  Model?: string[];
  Pakovanje?: string[];
  RobnaMarka?: string[];
  Upotreba?: string[];
  Boja?: string[];
}
