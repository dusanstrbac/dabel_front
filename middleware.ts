import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export function middleware(request: NextRequest) {

    const korisnik = request.nextUrl.pathname.split('/')[1];
    const token = localStorage.getItem('token') || ''; 

    // Ako token nije prisutan ili se ne poklapa sa korisničkim imenom, preusmeravamo na login stranicu
    if (!token || !isValidTokenForUser(token, korisnik)) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next();
}

function isValidTokenForUser(token: string, korisnik: string): boolean {
  try {
    const decodedToken = decodeToken(token) 
    return decodedToken.username === korisnik
  } catch (error) {
    return false
  }
}

function decodeToken(token: string): any {
  try {
    return jwt.decode(token)
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// Konfiguracija ruta, na koju ce se kaciti middleware
export const config = {
  matcher: '/:korisnik/profil',
}
