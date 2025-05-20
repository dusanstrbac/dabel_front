'use client';

import { useState } from 'react';

type FilterCenaProps = {
    onFilterChange: (filter: { min: string; max: string }) => void;
};

const FilterCena = () => {

    const [min, setMin] = useState('');
    const [max, setMax] = useState('');

    const handleChange = () => {
        onFilterChange({ min, max });
    }

    return(
        <div className='flex flex-col'>
            <p className='text-left'>Cena</p>

            <div className='w-full items-center'>
                {/* slider */}
                <div>
                    <label>Min cena:</label>
                    <input type="number" value={min} onChange={(e) => setMin(e.target.value)} />
                    <br />
                    <label>Max cena:</label>
                    <input type="number" value={max} onChange={(e) => setMax(e.target.value)} />
                    <br />
                    <button onClick={handleChange}>Primeni filter</button>
                </div>

                <div className='flex gap-2'>
                    <p>10rsd</p> <p>3000 rsd</p>
                </div>
            </div>
        </div>
    );
}

export default FilterCena;