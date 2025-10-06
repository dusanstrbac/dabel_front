'use client';

import { useTranslations } from "next-intl";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type SortKey = 'cena' | 'naziv';
type SortOrder = 'asc' | 'desc';

interface Props {
  sortKey: SortKey;
  sortOrder: SortOrder;
  onSortChange: (key: SortKey, order: SortOrder) => void;
}

const SortiranjeButton = ({ sortKey, sortOrder, onSortChange }: Props) => {
  const t = useTranslations();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="text-sm font-semibold border px-3 py-1 rounded-md hover:bg-gray-100">
          {t('sortiranjeButton.Sortiraj')}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onSortChange('cena', 'asc')}
            className="text-left hover:underline"
          >
            {t('sortiranjeButton.CenaRastuće')} {sortKey === 'cena' && sortOrder === 'asc' && '✓'}
          </button>
          <button
            onClick={() => onSortChange('cena', 'desc')}
            className="text-left hover:underline"
          >
            {t('sortiranjeButton.CenaOpadajuće')} {sortKey === 'cena' && sortOrder === 'desc' && '✓'}
          </button>

          <button
            onClick={() => onSortChange('naziv', 'asc')}
            className="text-left hover:underline"
          >
            {t('sortiranjeButton.NazivA-Z')}{sortKey === 'naziv' && sortOrder === 'asc' && '✓'}
          </button>
          <button
            onClick={() => onSortChange('naziv', 'desc')}
            className="text-left hover:underline"
          >
            {t('sortiranjeButton.NazivZ-A')} {sortKey === 'naziv' && sortOrder === 'desc' && '✓'}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SortiranjeButton;
