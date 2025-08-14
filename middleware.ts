import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/; // Public fajlovi iz projekta ( fotografije, ikonice ... )
const AUTH_EXEMPT_ROUTES = [
    "/login", 
    "/api/Auth/LoginPodaci",
    "/register",
    "/aktivacija"
];

// Sve api rute su zasticene osim ovih iznad da bi korisnik mogao da ih pozove i da se uloguje.
// Kada korisnik dobije token onda ce moci ostale api rute da poziva.
// Ubaciti u token permisiju korisnika, da bi moglo i to da se filtrira koja uloga moze sta da poziva

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
    const token = request.cookies.get("AuthToken")?.value;

// Rute koje su trenutno dozvoljene od strane middleware-a. Menjati po potrebi.
  if (
    AUTH_EXEMPT_ROUTES.includes(pathname) || /// Login rute koje su dostupne iz apija da bi se korisnik logovao
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith("/_next") || // Sistemski fajlovi ( JS, css ) -- Ne sme biti blokirano nikada
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname); // redirectTo znaci da ga vraca na rutu u koju je prvobitno hteo da udje
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}
