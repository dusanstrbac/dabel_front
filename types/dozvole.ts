
export type DozvoleInfo = {
  id: number;
  idDozvole: number;
  idKorisnika: string;
  status: number,
}

export interface KombinovanoDozvolePartnerType extends DozvoleInfo{
    idPartnera: string;
    ime: string;
    email: string;
    adresa: string;
    grad: string;
    delatnost: string;
    zip: string;
    maticniBroj: string;
    pib: string;
    telefon: string;
    uloga?: string;
    finKarta: FinKartaType;
    komercijalisti: KorisnikPodaciKomercijalistaType;
    partnerRabat: KorisnikRabatType;
    partnerDostava: KorisnikDostavaType[];
}