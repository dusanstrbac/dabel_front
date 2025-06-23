// Proveriti da li je potrebno ovaj JSON fajl da se menja

interface KorisnikPodaciType {
    ime: string,
    email: string,
    adresa: string,
    grad: string,
    delatnost: string,
    zip: string,
    maticniBroj: string,
    pib: string,
    telefon: string,
    nerealizovano: string,
    raspolozivoStanje: string,
    kredit: string,
    nijeDospelo: string,
    komercijalisti: KorisnikPodaciKomercijalistaType,
    finKarta: FinKartaType,
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