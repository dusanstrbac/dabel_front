import { ArtikalType } from "./artikal"

export type PartnerInfo = {
  partner: KorisnikPodaciType,
  idDokumenta: string,
  DatumKreiranja: Date, 
  mestoIsporuke: string, //lokacija
  napomena: string,
}