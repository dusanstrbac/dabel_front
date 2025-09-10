// middleware.ts
import { NextRequest, NextResponse } from "next/server";

// Lista podržanih jezika i podrazumevani jezik
const locales = ['sr', 'en', 'mk', 'hr', 'al', 'lt'];
const defaultLocale = 'sr';

const PUBLIC_FILE = /\.(.*)$/;
const AUTH_EXEMPT_ROUTES = [
  "/login",
  "/register",
  "/aktivacija",
  "/api/Auth/LoginPodaci"
];

export function middleware(request: NextRequest) {
  const { pathname, origin, search } = request.nextUrl;

  // --- LOGIKA ZA PREVOD ---
  // Prvo, proveri da li ruta ima prefiks jezika.
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Ako fali prefiks, preusmeri na podrazumevani jezik.
  if (pathnameIsMissingLocale) {
    const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  // --- TVOJA LOGIKA ZA AUTENTIFIKACIJU ---
  
  // Dozvoli pristup slikama direktno bez redirekta ili provere tokena.
  if (pathname.startsWith("/images")) {
    return NextResponse.next();
  }

  const pathnameSegments = pathname.split("/");
  const potentialLocale = pathnameSegments[1];

  const token = request.cookies.get("AuthToken")?.value;
  const cookieLocale = request.cookies.get('preferredLocale')?.value;

  // Normalizuj putanju bez jezika i ukloni prazne segmente.
  const normalizedSegments = pathnameSegments.slice(2).filter(Boolean);
  const normalizedPath = "/" + normalizedSegments.join("/");

  // Dozvoli statičke fajlove, favicon i _next foldere.
  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Dozvoli pristup rutama koje ne zahtevaju autentifikaciju.
  if (AUTH_EXEMPT_ROUTES.includes(normalizedPath)) {
    return NextResponse.next();
  }

  // Ako je api ruta i exempt (startuje sa /api i poklapa se sa exempt), dozvoli
  if (pathname.startsWith("/api")) {
    if (AUTH_EXEMPT_ROUTES.some(route => normalizedPath.startsWith(route))) {
      return NextResponse.next();
    }
  }

  // Ako nema token, preusmeri na prijavu (ali ne ako je već na stranici za prijavu).
  if (!token) {
    if (normalizedPath !== "/login") {
      const loginUrl = new URL(`/${potentialLocale}/login`, origin);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    } else {
      return NextResponse.next();
    }
  }

  // Ako token postoji, dozvoli pristup.
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Rukuj svim putanjama osim statičnih fajlova i onih koje ne treba proveravati
    "/((?!_next/static|_next/image|favicon.ico|api/Auth/LoginPodaci|images).*)",
  ],
};