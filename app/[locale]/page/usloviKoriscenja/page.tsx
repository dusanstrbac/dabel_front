'use client';

import Image from "next/image";

const UsloviKoriscenja = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-6 text-gray-800">
            <h1 className="text-3xl font-bold mb-6 text-center">Uslovi korišćenja</h1>

            <p className="mb-4">
                Kompanija <strong>Dabel d.o.o.</strong> Vam omogućava korišćenje usluga i sadržaja svog sajta u skladu sa dole navedenim uslovima korišćenja. Uslovi se primenjuju na sve sadržaje i usluge sajta <a href="https://www.dabel.rs" className="text-blue-600 underline hover:text-blue-800" target="_blank">www.dabel.rs</a>.
            </p>
            <p className="mb-4">
                Smatra se da su korisnici upoznati sa ovim uslovima ukoliko koriste bilo koji deo sajta, kao i da prihvataju korišćenje sadržaja ovog sajta isključivo za ličnu upotrebu i na sopstvenu odgovornost.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-3">Podaci o kompaniji</h2>

            <Image src="/Dabel-logo-2.png" alt="Dabel logo" width={150} height={150} className="mb-[15px]"/>
            <span className="font-semibold">DABEL d.o.o. – Trgovina, proizvodnja i usluge</span>

            <ul className="list-none space-y-1 mb-6">
                <li><strong>Adresa:</strong> Šesta Industrijska 12, 22330 Nova Pazova, Srbija</li>
                <li><strong>Email:</strong> mail@dabel.rs</li>
                <li><strong>Web:</strong> www.dabel.rs</li>
                <li><strong>Matični broj:</strong> 17141724</li>
                <li><strong>PIB:</strong> 100267585</li>
                <li><strong>Šifra delatnosti:</strong> 4690 – Nespecijalizovana trgovina na veliko</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-3">Opšte odredbe</h2>
            <p className="mb-4">
                Sajt <strong>www.dabel.rs</strong> ima autorska prava na sve sadržaje (tekstualne, vizuelne i audio materijale, baze podataka i programski kod). Neovlašćeno korišćenje bilo kog dela sajta bez dozvole vlasnika smatra se kršenjem autorskih prava i može dovesti do pravnih posledica.
            </p>
            <p className="mb-4">
                O važnim promenama i dopunama uslova, Dabel d.o.o. može obavestiti korisnike putem emaila ili objavljivanjem na sajtu.
            </p>
            <p className="mb-4">
                Korišćenjem sajta smatrate se upoznatim sa najnovijim pravilima o uslovima korišćenja i politikom privatnosti.
            </p>
            <p className="mb-4">
                Dabel d.o.o. nastoji da pruži tačne informacije o proizvodima, uključujući slike, opise i tehničke detalje, ali ne garantuje potpunu tačnost zbog mogućih tehničkih grešaka. Boje proizvoda na ekranu mogu se razlikovati od stvarnih.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-3">Lični podaci korisnika</h2>
            <p className="mb-4">
                Podaci koje ostavljate na sajtu služe za internu upotrebu i biće zaštićeni u skladu sa Zakonom o zaštiti podataka o ličnosti. Vaše podatke koristimo isključivo za obradu zahteva, informisanje o ponudama i komunikaciju sa našim timom.
            </p>
            <p className="mb-4">
                Podaci se neće objavljivati, niti deliti sa trećim licima bez vašeg pristanka.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-3">Veze sa drugim web lokacijama</h2>
            <p className="mb-4">
                Na sajtu se mogu nalaziti linkovi ka drugim lokacijama radi vašeg boljeg korisničkog iskustva. Dabel d.o.o. nije odgovoran za sadržaj eksternih lokacija.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-3">Zapošljavanje i obrada podataka kandidata</h2>
            <p className="mb-4">
                Prilikom selekcije i zapošljavanja, kandidat pristaje da Dabel d.o.o. koristi njegove podatke isključivo u svrhu selekcije. Podaci se čuvaju na internim serverima i ne prosleđuju trećim licima.
            </p>
            <p className="mb-4">
                Kandidati mogu u bilo kom trenutku povući saglasnost kontaktiranjem putem email adrese <a href="mailto:zeljka.jankovic@dabel.rs" className="text-blue-600 underline">zeljka.jankovic@dabel.rs</a>, nakon čega se njihovi podaci brišu iz baze.
            </p>
        </div>
    );
};

export default UsloviKoriscenja;
