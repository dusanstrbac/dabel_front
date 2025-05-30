
export interface ArtikalType {
    id?: string,
    naziv: string,
    cena: number,
    slika?: string,
}

export interface ListaArtikalaProps {
  artikli?: ArtikalType[]  // opcioni prop, default prazan niz
}