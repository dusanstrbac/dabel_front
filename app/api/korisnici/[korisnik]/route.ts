import { mockUsers } from '@/app/data/mockUsers';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { korisnik: string } }) {
  try {
    const korisnik = params.korisnik;  // Dobijamo email iz dinamičkog parametra URL-a
    console.log('Pretrazujem korisnika:', korisnik);  // Logujemo korisnika

    if (!korisnik) {
      console.error('Email korisnika nije prosleđen');
      return NextResponse.json({ error: 'Email korisnika nije prosleđen' }, { status: 400 });
    }

    const korisnikData = mockUsers.find(k => k.email === korisnik);

    if (korisnikData) {
      return NextResponse.json(korisnikData, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Korisnik nije pronađen' }, { status: 404 });
    }
  } catch (error) {
    console.error('Greška u API ruti:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
