import { CircleUser, MapIcon, MapPinnedIcon, Phone, UserCircle } from 'lucide-react';
import { Metadata } from 'next';

type Props = {
    params: {
        korisnik: string;
    };
};

export function generateMetadata({ params }: Props): Metadata {
    return {
      title: `${params.korisnik} • Podaci`,
    };
  }

const ProfilPodaci = () => {
    return (
        <div className='lg:px-[120px] lg:mt-[40px]'>
            <div className='flex flex-wrap justify-between gap-10 lg:gap-4 '>
                <div>
                    <h1 className='text-3xl font-bold'>Bane okov</h1>
                    <div className='mt-4 flex flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                            <MapIcon color='grey' />
                            <p>Kneza Lazara 118 Jagodina Jagodina</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Phone color='grey' />
                            <p>+38135232316</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <MapPinnedIcon color='grey' />
                            <p>Serbia</p>
                        </div>
                    </div>
                </div>                

                <div className='flex flex-col lg:gap-6 text-left lg:text-right'>
                    <p className='text-gray-600'>14.04.2025</p>
                    <p className='font-semibold'>Dozvoljeno zaduženje: <span className='font-extrabold'>18000000.00</span></p>
                    <p className='font-semibold'>Trenutno zaduženje: <span className='font-extrabold'>820976.50</span></p>
                </div>
            </div>

            <div className='mt-[50px] flex gap-10 lg:gap-[150px]'>
                <div className='flex flex-col gap-2'>
                    <h1>Delatnost: <span>Gvožđara</span></h1>
                    <p>MB: <span>07527942</span></p>
                    <p>PIB: <span>100119190</span></p>
                </div>

                <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-2'>
                        <CircleUser color='grey' />
                        <h1>Slavica Savić</h1>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Phone color='grey' />
                        <p>+38135232316</p>
                    </div>
                </div>
            </div>

            {/* NEKI BROJ TELEFONA */}
            <div className='mt-[40px] lg:mt-[40px] flex gap-[20px]'>
                <UserCircle color='grey' size={80} className='p-[20px] border border-gray-400 rounded-[25px]'/>
                <div className='flex flex-col'>
                    <h1 className='font-bold text-xl'>Petar Petrović</h1>
                    <div className='flex items-center gap-2'>
                        <Phone color='grey' />
                        <p className='text-lg'>+38135232316</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ProfilPodaci;