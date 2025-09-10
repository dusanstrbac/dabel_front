// middleware.ts
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, type Locale } from './locales';

const PUBLIC_FILE = /\.(.*)$/;
const AUTH_EXEMPT_ROUTES = [
  '/login',
  '/register',
  '/aktivacija',
  '/api/Auth/LoginPodaci'
];

function isLocale(locale: string | undefined): locale is Locale {
  return locale ? locales.includes(locale as Locale) : false;
}

// Kreiraj next-intl middleware
const nextIntlMiddleware = createMiddleware({
  locales,
  defaultLocale
});

export function middleware(request: NextRequest) {
  const { pathname, origin, search } = request.nextUrl;

  // Dozvoli pristup svim slikama direktno bez redirekta ili token provere
  if (pathname.startsWith('/images')) {
    return NextResponse.next();
  }

  const pathnameSegments = pathname.split('/');
  const potentialLocale = pathnameSegments[1];

  const token = request.cookies.get('AuthToken')?.value;
  const cookieLocale = request.cookies.get('preferredLocale')?.value;

  // Ako nema validan locale, redirect na defaultLocale
  if (!isLocale(potentialLocale)) {
    if (cookieLocale && isLocale(cookieLocale)) {
      return NextResponse.redirect(
        new URL(`/${cookieLocale}${pathname}${search}`, origin)
      );
    }
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}${search}`, origin)
    );
  }

  // Normalizuj path bez locale i ukloni prazne segmente
  const normalizedSegments = pathnameSegments.slice(2).filter(Boolean);
  const normalizedPath = '/' + normalizedSegments.join('/');

  // Dozvoli statičke fajlove, favicon i _next foldere
  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Dozvoli pristup exempt rutama
  if (AUTH_EXEMPT_ROUTES.includes(normalizedPath)) {
    return NextResponse.next();
  }

  // Ako je api ruta i exempt (startuje sa /api i poklapa se sa exempt), dozvoli
  if (pathname.startsWith('/api')) {
    if (AUTH_EXEMPT_ROUTES.some(route => normalizedPath.startsWith(route))) {
      return NextResponse.next();
    }
  }

  // Ako nema token, redirect na login (ali ne ako je već na login strani)
  if (!token) {
    if (normalizedPath !== '/login') {
      const loginUrl = new URL(`/${potentialLocale}/login`, origin);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    } else {
      return NextResponse.next();
    }
  }

  // Token postoji, primeni next-intl middleware
  return nextIntlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/Auth/LoginPodaci|images).*)'
  ]
};