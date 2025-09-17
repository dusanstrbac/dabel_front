import { setCookie } from 'cookies-next';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from "next/server";

// Lista podržanih jezika i podrazumevani jezik
const locales = ['sr', 'en', 'mk', 'al', 'me'];
const defaultLocale = 'sr';

const AUTH_EXEMPT_ROUTES = [
  '/login',
  '/register',
  '/aktivacija',
  '/api/Auth/LoginPodaci'
];

// 1. Kreirajte next-intl middleware.
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
});

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const token = request.cookies.get("AuthToken")?.value;
  const languageCookie = request.cookies.get("NEXT_LOCALE");
  const preferredLocaleCookie = request.cookies.get("preferredLocale");

  // Normalizuj putanju bez jezika
  const pathnameSegments = pathname.split("/");
  const normalizedPath = "/" + pathnameSegments.slice(2).join("/");

  // Dozvoli pristup rutama koje ne zahtevaju autentifikaciju, bez obzira na jezik
  if (AUTH_EXEMPT_ROUTES.includes(normalizedPath) || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (!languageCookie || !preferredLocaleCookie) {
    const response = NextResponse.next();
    
    // Postavi oba cookija na default jezik
    response.cookies.set("NEXT_LOCALE", defaultLocale);
    response.cookies.set("preferredLocale", defaultLocale);
    
    return response;
  }

  // 2. Proverite da li korisnik ima token.
  if (!token) {
    // Ako nema token, preusmerite na stranicu za prijavu.
    const loginUrl = new URL(`/${pathnameSegments[1] || defaultLocale}/login`, origin);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Ako korisnik ima token, prosledite zahtev na next-intl middleware.
  // Next-intl će se pobrinuti za sve ostalo (preusmeravanje, dodavanje prefiksa, itd.).
  return intlMiddleware(request);
}

export const config = {
  // Ovo je važno - matcher sada treba da obuhvati sve rute.
  // Vaša logika za izuzeća se nalazi unutar same funkcije.
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
