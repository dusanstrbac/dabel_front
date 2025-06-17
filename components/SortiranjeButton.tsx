'use client';

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { SortiranjeButtonProps } from "@/types/artikal";

type SortKey = 'cena' | 'naziv';
type SortOrder = 'asc' | 'desc';

interface Props extends SortiranjeButtonProps {
  sortKey: SortKey;
  sortOrder: SortOrder;
  onSortChange: (key: SortKey, order: SortOrder) => void;
}

const SortiranjeButton = ({ sortKey, sortOrder, onSortChange }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="text-sm font-semibold border px-3 py-1 rounded-md hover:bg-gray-100">
          Sortiraj
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onSortChange('cena', 'asc')}
            className="text-left hover:underline"
          >
            Cena: Rastuće {sortKey === 'cena' && sortOrder === 'asc' && '✓'}
          </button>
          <button
            onClick={() => onSortChange('cena', 'desc')}
            className="text-left hover:underline"
          >
            Cena: Opadajuće {sortKey === 'cena' && sortOrder === 'desc' && '✓'}
          </button>

          <button
            onClick={() => onSortChange('naziv', 'asc')}
            className="text-left hover:underline"
          >
            Naziv: A-Z {sortKey === 'naziv' && sortOrder === 'asc' && '✓'}
          </button>
          <button
            onClick={() => onSortChange('naziv', 'desc')}
            className="text-left hover:underline"
          >
            Naziv: Z-A {sortKey === 'naziv' && sortOrder === 'desc' && '✓'}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SortiranjeButton;
