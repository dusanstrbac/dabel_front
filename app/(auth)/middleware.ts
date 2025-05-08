import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parse } from 'cookie';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Matchuje rute kao /neki@email.com/profil/...
  const match = pathname.match(/^\/([^\/]+)\/profil(\/.*)?$/);

  if (match) {
    const emailFromPath = decodeURIComponent(match[1]); // dekodiramo u slučaju da ima specijalnih karaktera
    const cookies = parse(request.headers.get('cookie') || '');
    const emailFromCookie = cookies.user_email;

    if (!emailFromCookie) {
      // Ako korisnik nije ulogovan
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (emailFromCookie !== emailFromPath) {
      // Ako pokusava da pristupi tudjoj stranici
      const redirectUrl = new URL(`/${emailFromCookie}/profil/podaci`, request.url);
      return NextResponse.redirect(redirectUrl);
      
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*/profil/:subpath*'],
};
