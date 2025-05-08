import { NextApiRequest, NextApiResponse } from 'next';

const mockBaza = [
  {
    ime: "Dusan Strbac",
    email: "dusan@gmail.com",
    password: "1234",
    token: "0987654321abcdef",
    username: "komercijalista",
    mobilni: "+381607292777",
    firma: {
      naziv_firme: "Dusan Express",
      lokacija: "Bircaninova 52",
      telefon_firma: "+123156346435",
      drzava: "Srbija",
      delatnost: "Brza posta",
      MB: "07527942",
      PIB: "100119190",
    }
  }
];

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { korisnik } = req.query;

  // Provjera loga
  console.log('Pretrazujem korisnika:', korisnik);

  const korisnikData = mockBaza.find(k => k.email === korisnik);

  if (korisnikData) {
    return res.status(200).json(korisnikData);
  } else {
    return res.status(404).json({ error: 'Korisnik nije pronadjen' });
  }
}
