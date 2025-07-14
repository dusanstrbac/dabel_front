
export type DokumentInfo = {
  partner: KorisnikPodaciType,
  tip: "narudzbenica",
  idPartnera: string,
  brojDokumenta: number,
  idKomercijaliste: string,
  datumDokumenta: Date,
  datumVazenja: Date,
  lokacija: string,
  napomena: string,
  stavkeDokumenata: StavkaDokumenta[];
}

export type StavkaDokumenta = {
  id: number;
  brojDokumenta: number;
  idArtikla: string;
  nazivArtikla: string;
  cena: number;
  originalnaCena: number;
  kolicina: string;
  pdv: string;
  ukupnaCena: number;
};

