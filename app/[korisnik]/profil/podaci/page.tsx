import { Metadata } from 'next';
import ProfilPodaci from './profilPodaci';

type Props = {
  params: {
    korisnik: string;
  };
};

// Pravilno asinhrono čitanje params u generateMetadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const korisnik = params.korisnik; // 'params.korisnik' može biti asinhron, pa ga sada pravilno čekaš

  return {
    title: `${korisnik} • Podaci`,
  };
}

export default function Page({ params }: Props) {
  return <ProfilPodaci params={params} />;
}
