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
  pristigloNaNaplatu?: string;
  raspolozivoStanje?: string;
  dozvoljenoZaduzenje?: string;
  trenutnoZaduzenje?: string;
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
    pristigloNaNaplatu: number;
    raspolozivoStanje: number;
    dozvoljenoZaduzenje: number;
    trenutnoZaduzenje: number;
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
            pristigloNaNaplatu: parseFloat(decoded.pristigloNaNaplatu || "0"),
            raspolozivoStanje: parseFloat(decoded.raspolozivoStanje || "0"),
            dozvoljenoZaduzenje: parseFloat(decoded.dozvoljenoZaduzenje || "0"),
            trenutnoZaduzenje: parseFloat(decoded.trenutnoZaduzenje || "0"),
          }
        : undefined,
        
    };
  } catch (error) {
    console.error("Greška pri dekodiranju tokena:", error);
    return null;
  }
}
