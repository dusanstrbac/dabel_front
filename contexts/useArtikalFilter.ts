import { useMemo } from 'react';
import { ArtikalType } from '@/types/artikal';

export const useArtikalFilter = (artikli: ArtikalType[], searchParams: URLSearchParams) => {
  return useMemo(() => {
    let result = [...artikli];
    
    // Filter po ceni
    const cenaParam = searchParams.get('cena');
    if (cenaParam) {
      const [minCena, maxCena] = cenaParam.split('-').map(Number);
      result = result.filter(artikal => {
        const cena = artikal.artikalCene?.[0]?.cena || 0;
        return cena >= minCena && cena <= maxCena;
      });
    }

    // Filteri po atributima
    const filterKeys = ['jm', 'Materijal', 'Model', 'Pakovanje', 'RobnaMarka', 'Upotreba', 'Boja'];
    
    filterKeys.forEach(key => {
      const values = searchParams.getAll(key).flatMap(v => v.split(','));
      if (values.length > 0) {
        result = result.filter(artikal => {
          if (key === 'jm') {
            return values.includes(artikal.jm);
          }
          
          if (artikal.artikalAtributi) {
            const atributKey = key === 'RobnaMarka' ? 'Robna marka' : 
                             key === 'Boja' ? 'Zavr.obr-boja' : key;
            
            return artikal.artikalAtributi.some(atribut => 
              atribut.imeAtributa === atributKey && 
              values.includes(atribut.vrednost)
            );
          }
          return false;
        });
      }
    });

    return result;
  }, [artikli, searchParams]);
};