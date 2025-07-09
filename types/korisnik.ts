
interface KorisnikPodaciType {
    idPartnera: string,
    ime: string,
    email: string,
    adresa: string,
    grad: string,
    delatnost: string,
    zip: string,
    maticniBroj: string,
    pib: string,
    telefon: string,
    uloga?: string,
    finKarta: FinKartaType,
    komercijalista: KorisnikPodaciKomercijalistaType,
    partnerRabat: KorisnikRabatType,
    partnerDostava: KorisnikDostavaType[],
}

interface LokacijePartnera{
    id:string,
}

interface KorisnikDostavaType {
    idPartnera: string,
    adresa: string,
    grad: string,
    drzava: string,
    postBroj: string,
}

interface KorisnikRabatType {
    idPartnera: string,
    rabat: number,
}

interface KorisnikPodaciKomercijalistaType {
    naziv: string,
    telefon: string,
}

interface FinKartaType {
    idPartnera: string;
    nerealizovano: string;
    raspolozivoStanje: string;
    kredit: string;
    nijeDospelo: string;
}