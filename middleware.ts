import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

const locales = ["sr", "en", "mk", "al", "me"];
const defaultLocale = "sr";

const AUTH_EXEMPT_ROUTES = [
  "/login",
  "/register",
  "/aktivacija",
  "/api/Auth/LoginPodaci"
];

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
});

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const token = request.cookies.get("AuthToken")?.value;
  const languageCookie = request.cookies.get("NEXT_LOCALE")?.value || defaultLocale;

  const pathnameSegments = pathname.split("/");

  const normalizedPath = "/" + pathnameSegments.slice(2).join("/");

  // Overwrite poslednjaRuta cookie sa trenutno izabranim jezikom
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

  // Kreiramo jedan response objekat
  let response = NextResponse.next();

  // Ako postoji poslednjaRuta, setujemo cookie
  if (updatedRuta) {
    response.cookies.set("poslednjaRuta", updatedRuta, { path: "/" });
  }

  // Dozvoli rute koje ne zahtevaju autentifikaciju
  if (
    AUTH_EXEMPT_ROUTES.includes(normalizedPath) ||
    pathname.startsWith("/api") ||
    normalizedPath.startsWith("/register")
  ) {
    return response;
  }

  // Redirect ako URL nema prefiks jezika ili je root "/"
  if (!locales.includes(pathnameSegments[1]) || pathname === "/") {
    const redirectUrl = new URL(
      `/${languageCookie}${pathname === "/" ? "" : pathname}`,
      origin
    );
    return NextResponse.redirect(redirectUrl, { headers: response.headers });
  }

  // Provera tokena i redirect na login ako nije autentifikovan
  if (!token) {
    const redirectTo = pathname;
    const loginUrl = new URL(`/${languageCookie}/login`, origin);
    loginUrl.searchParams.set("redirectTo", redirectTo);
    const redirectResponse = NextResponse.redirect(loginUrl);
    // Postavi poslednjaRuta cookie
    redirectResponse.cookies.set("poslednjaRuta", updatedRuta || redirectTo, { path: "/" });
    return redirectResponse;
  }

  // Ako je sve u redu, prosledi zahtev next-intl middleware-u
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
