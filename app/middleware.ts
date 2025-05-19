import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const match = pathname.match(/^\/([^\/]+)\/profil(\/.*)?$/);

  if (match) {

    const emailFromPath = match[1];
    const cookieStore = await cookies();
    const emailFromCookie = cookieStore.get('user_email')?.value;

    // Ako nema email-a u kolačiću, preusmeri ga na login
    if (!emailFromCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Ako email u kolačiću i URL-u nisu isti, preusmeri korisnika na svoju stranicu
    if (emailFromCookie !== emailFromPath) {
      return NextResponse.redirect(new URL(`/${emailFromCookie}/profil/podaci`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/([^/]+)/profil/podaci'],
};
