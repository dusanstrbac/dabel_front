// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

const locales = ["sr", "en", "mk", "al", "me"];
const defaultLocale = "sr";

// BAZNE rute koje su javne
const baseExemptRoutes = ["/login", "/register", "/aktivacija", "/api/Auth/LoginPodaci", "/resetlozinke"];

// Dodaj sve lokalizovane varijante
const AUTH_EXEMPT_ROUTES = [
  ...baseExemptRoutes,
  ...locales.flatMap(locale => baseExemptRoutes.map(route => `/${locale}${route}`))
];

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const token = request.cookies.get("AuthToken")?.value;
  const languageCookie = request.cookies.get("NEXT_LOCALE")?.value || defaultLocale;

  let safePathname = pathname;
  let externalHost = "";

  try {
    if (pathname.startsWith("http://") || pathname.startsWith("https://")) {
      const fullUrl = new URL(pathname);
      safePathname = fullUrl.pathname;
      externalHost = fullUrl.host;
    }
  } catch (err) {
    console.error("Greška pri parsiranju URL-a u pathname:", pathname);
    safePathname = "/";
  }

  const pathnameSegments = safePathname.split("/");

  // Normalizacija path-a (uklanjanje jezika ako postoji)
  let normalizedPath = safePathname;
  const hasLocalePrefix = locales.includes(pathnameSegments[1]);

  if (hasLocalePrefix) {
    normalizedPath = "/" + pathnameSegments.slice(2).join("/");
  }

  const fullNormalizedPath = externalHost
    ? `${externalHost}${normalizedPath}`
    : normalizedPath;

  // Poslednja ruta update
  const poslednjaRuta = request.cookies.get("poslednjaRuta")?.value;
  let updatedRuta = poslednjaRuta;

  if (poslednjaRuta) {
    const segments = poslednjaRuta.split("/");
    if (!locales.includes(segments[1])) {
      segments.splice(1, 0, languageCookie);
    } else {
      segments[1] = languageCookie;
    }
    updatedRuta = segments.join("/");
  }

  // Response objekat
  let response = NextResponse.next();

  if (updatedRuta) {
    response.cookies.set("poslednjaRuta", updatedRuta, { path: "/" });
  }

  // KLJUČNA PROMENA: Za API Auth rutu - dozvoli direktan pristup
  if (pathname.includes("/api/Auth/LoginPodaci")) {
    return response;
  }

  // Da li je ruta izuzeta
  const isExempt = AUTH_EXEMPT_ROUTES.some(route =>
    pathname.startsWith(route) || normalizedPath.startsWith(route)
  );

  // Ako je javna ruta ali bez jezika – dodaj prefiks jezika
  if (isExempt && !hasLocalePrefix) {
    const redirectUrl = new URL(request.url);
    redirectUrl.pathname = `/${languageCookie}${pathname}`;
    return NextResponse.redirect(redirectUrl);
  }

  // Ako je javna ruta – propusti kroz intlMiddleware ali sačuvaj jezik
  if (isExempt || pathname.startsWith("/api")) {
    const intlResponse = intlMiddleware(request);
    
    // Očuvaj NEXT_LOCALE cookie
    if (languageCookie) {
      intlResponse.cookies.set("NEXT_LOCALE", languageCookie, { 
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365 // 1 godina
      });
    }
    
    return intlResponse;
  }

  // Ako nema tokena – redirect na login SA OČUVANJEM JEZIKA
  if (!token) {
    const redirectTo = pathname;
    const loginUrl = new URL(`/${languageCookie}/login`, origin);
    loginUrl.searchParams.set("redirectTo", redirectTo);
    const redirectResponse = NextResponse.redirect(loginUrl);
    redirectResponse.cookies.set("poslednjaRuta", updatedRuta || redirectTo, { path: "/" });
    
    // Očuvaj NEXT_LOCALE cookie
    if (languageCookie) {
      redirectResponse.cookies.set("NEXT_LOCALE", languageCookie, { 
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365
      });
    }
    
    return redirectResponse;
  }

  // Za autentifikovane korisnike – propusti kroz intlMiddleware sa očuvanim jezikom
  const intlResponse = intlMiddleware(request);
  if (languageCookie) {
    intlResponse.cookies.set("NEXT_LOCALE", languageCookie, { 
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365
    });
  }
  
  return intlResponse;
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};