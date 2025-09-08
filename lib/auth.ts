import { jwtDecode } from "jwt-decode";
import { getCookie } from "cookies-next";

type DekodiranToken = {
  email: string;
  sub: string; // korisnickoIme se nalazi u sub
  id: string;  // id korisnika
  webUloga: string; // WEB uloga korisnika
  exp: number;
  iat: number;
  idPartnera?: string;
  nerealizovano?: string;
  raspolozivoStanje?: string;
  kredit?: string;
  nijeDospelo?: string;
  drzava?: string;
  partner?: string;
};

export function dajKorisnikaIzTokena(): {
  email: string;
  korisnickoIme: string;
  idKorisnika: string;
  webUloga: string;
  drzava: string;
  partner: string;
  finKarta?: {
    idPartnera: string;
    nerealizovano: number;
    raspolozivoStanje: number;
    kredit: number;
    nijeDospelo: number;
  };
} | null {
  const token = getCookie("AuthToken");

  if (!token || typeof token !== "string") return null;

  try {
    const decoded = jwtDecode<DekodiranToken>(token);

    return {
      email: decoded.email,
      korisnickoIme: decoded.sub,
      idKorisnika: decoded.id,
      webUloga: decoded.webUloga,
      drzava: decoded.drzava || "",
      partner: decoded.partner || "",
      finKarta: decoded.idPartnera
        ? {
            idPartnera: decoded.idPartnera,
            nerealizovano: parseFloat(decoded.nerealizovano || "0"),
            raspolozivoStanje: parseFloat(decoded.raspolozivoStanje || "0"),
            kredit: parseFloat(decoded.kredit || "0"),
            nijeDospelo: parseFloat(decoded.nijeDospelo || "0"),
          }
        : undefined,
        
    };
  } catch (error) {
    console.error("Greška pri dekodiranju tokena:", error);
    return null;
  }
}
