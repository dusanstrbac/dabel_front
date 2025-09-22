import { useLocale } from 'next-intl';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from "next/server";
import { Locale } from './types/locale';

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
  const languageCookie = request.cookies.get("NEXT_JEZIK");
  const nextJezik = request.cookies.get("NEXT_LOCALE")

  // Normalizuj putanju bez jezika
  const pathnameSegments = pathname.split("/");
  const normalizedPath = "/" + pathnameSegments.slice(2).join("/");

  // Dozvoli pristup rutama koje ne zahtevaju autentifikaciju, bez obzira na jezik
  if (AUTH_EXEMPT_ROUTES.includes(normalizedPath) || pathname.startsWith("/api") || normalizedPath.startsWith("/register")) {
    return NextResponse.next();
  }

  if (!languageCookie) {
    const response = NextResponse.next();
    const defaultJezik = 'sr'

    // Postavi cookie na default jezik
    response.cookies.set("NEXT_JEZIK", defaultJezik);
    return response;
  }

  if(nextJezik !== languageCookie) {
    nextJezik === languageCookie; // Ukoliko su razliciti kolacici, postavljamo ih na istu vrednost
  }

  // 2. Proverite da li korisnik ima token.

if (!token) {
  const redirectTo = pathname;
  const loginUrl = new URL(`/${pathnameSegments[1] || defaultLocale}/login`, origin);
  const response = NextResponse.redirect(loginUrl);
  
  loginUrl.searchParams.set("redirectTo", redirectTo);
  response.cookies.set("poslednjaRuta", redirectTo, { path: "/" });

  return response;
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
