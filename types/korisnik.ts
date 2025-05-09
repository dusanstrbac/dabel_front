interface KorisnikType {
    ime: string,
    email: string,
    password: string,
    token: string,
    username: string,
    mobilni: string,
    firma: Firma,
    komercijalista: Komercijalista,
}

interface Firma {
    naziv_firme: string,
    lokacija: string,
    telefon_firma: string,
    drzava: string,
    delatnost: string,
    MB: string,
    PIB: string,
}

interface Komercijalista {
    ime: string,
    telefon: string,
}