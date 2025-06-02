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
    komercijalista: KorisnikPodaciKomercijalistaType,
}

interface KorisnikPodaciKomercijalistaType {
    ime: string,
    telefon: string,
}
