import React from 'react';
import { ArtikalType } from '@/types/artikal';

interface ListaArtikalaProps {
  artikli: any[]; // Možemo koristiti 'any' dok ne definišemo tačan tip odgovora
}

const Proizvodi: React.FC<ListaArtikalaProps> = ({ artikli }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {artikli.map((artikal) => (
        <div key={artikal.idArtikla} className="border p-4">
          <h3 className="text-xl font-semibold">{artikal.naziv}</h3>
          <p>Kategorija ID: {artikal.kategorijaId}</p>
          <p>Jedinica mere: {artikal.jm}</p>
          {/* Ako je potrebno, možeš dodati i druge informacije */}
        </div>
      ))}
    </div>
  );
};

export default Proizvodi;
