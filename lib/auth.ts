import { jwtDecode } from "jwt-decode";
import { getCookie } from "cookies-next";

type DekodiranToken = {
  email: string;
  sub: string; // korisnickoIme se nalazi u sub
  id: string;  // id korisnika
  webUloga: string; // WEB uloga korisnika
  exp: number;
  iat: number;
};

export function dajKorisnikaIzTokena(): { email: string; korisnickoIme: string; idKorisnika: string; webUloga: string; } | null {
  const token = getCookie("AuthToken");

  if (!token || typeof token !== "string") return null;

  try {
    const decoded = jwtDecode<DekodiranToken>(token);
    return {
      email: decoded.email,
      korisnickoIme: decoded.sub,
      idKorisnika: decoded.id,
      webUloga: decoded.webUloga,
    };
  } catch (error) {
    console.error("Greška pri dekodiranju tokena:", error);
    return null;
  }
}
