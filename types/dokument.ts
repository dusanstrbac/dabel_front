
export type DokumentInfo = {
  tip: "narudzbenica",
  idPartnera: string,
  brojDokumenta: number,
  idKomercijaliste: string,
  datumDokumenta: Date,
  datumVazenja: Date,
  lokacija: string,
  napomena: string,
  dostava: string,
  status: number,
  valuta: string,
  stavkeDokumenata: StavkaDokumenta[];
}

export type StavkaDokumenta = {
  id: number;
  brojDokumenta: number;
  idArtikla: string;
  nazivArtikla: string;
  cena: number;
  jm: string;
  originalnaCena: number;
  kolicina: string;
  pdv: string;
  ukupnaCena: number;
};

