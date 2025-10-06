import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

const locales = ["sr", "en", "mk", "al", "me"];
const defaultLocale = "sr";

// BAZNE rute koje su javne
const baseExemptRoutes = ["/login", "/register", "/aktivacija", "/api/Auth/LoginPodaci"];

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

  // Da li je ruta izuzeta
  const isExempt = AUTH_EXEMPT_ROUTES.some(route =>
    pathname.startsWith(route) || normalizedPath.startsWith(route)
  );

  // Ako je javna ruta ali bez jezika – dodaj prefiks jezika
  if (isExempt && !hasLocalePrefix) {
    const redirectUrl = new URL(request.url);
    redirectUrl.pathname = `/${languageCookie}${pathname}`;
    // Query parametri su već uključeni u `request.url`
    return NextResponse.redirect(redirectUrl);
  }

  // Ako je javna ruta – pusti je
  if (isExempt || pathname.startsWith("/api")) {
    return response;
  }

  // Ako nema tokena – redirect na login
  if (!token) {
    const redirectTo = pathname;
    const loginUrl = new URL(`/${languageCookie}/login`, origin);
    loginUrl.searchParams.set("redirectTo", redirectTo);
    const redirectResponse = NextResponse.redirect(loginUrl);
    redirectResponse.cookies.set("poslednjaRuta", updatedRuta || redirectTo, { path: "/" });
    return redirectResponse;
  }

  // Prosledi intlMiddleware-u ako je sve u redu
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
