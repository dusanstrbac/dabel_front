
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
    komercijalisti: KorisnikPodaciKomercijalistaType,
    partnerRabat: KorisnikRabatType,
    partnerDostava: KorisnikDostavaType[],
    valutaNovca: string
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
    opstina: string,
    kontaktOsoba: string,
    telefon: string,
    email: string,
    sifra: string
}

interface KorisnikRabatType {
    idPartnera: string,
    rabat: number,
}

interface KorisnikPodaciKomercijalistaType {
    id: string,
    naziv: string,
    email: string,
    telefon: string,
}

interface FinKartaType {
    idPartnera: string;
    pristigloNaNaplatu: string;
    raspolozivoStanje: string;
    dozvoljenoZaduzenje: string;
    trenutnoZaduzenje: string;
}