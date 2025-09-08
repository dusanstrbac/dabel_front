'use client';

import axios from 'axios';
import { useState } from 'react';

const Kontakt = () => {
  const [formData, setFormData] = useState({
    ime: '',
    kompanija: '',
    email: '',
    naslov: '',
    poruka: '',
  });

  const [errors, setErrors] = useState({
    ime: '',
    email: '',
    naslov: '',
    poruka: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validacija
    const newErrors = {
      ime: formData.ime ? '' : 'Ovo polje je obavezno.',
      email: formData.email ? '' : 'Ovo polje je obavezno.',
      naslov: formData.naslov ? '' : 'Ovo polje je obavezno.',
      poruka: formData.poruka ? '' : 'Ovo polje je obavezno.',
    };

    setErrors(newErrors);

    const isValid = Object.values(newErrors).every(err => err === '');

    if (!isValid) return;

    try {
      const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;

      // Mapiranje polja na DTO sa velikim početnim slovima
      const dataToSend = {
        Ime: formData.ime,
        Kompanija: formData.kompanija,
        Email: formData.email,
        Naslov: formData.naslov,
        Poruka: formData.poruka,
      };

      const res = await axios.post(`${apiAddress}/api/Partner/PosaljiPoruku`, dataToSend);

      if (res.status !== 200) {
        alert(res.data.poruka || 'Došlo je do greške.');
        return;
      }

      alert('Poruka je uspešno poslata!');
      setFormData({
        ime: '',
        kompanija: '',
        email: '',
        naslov: '',
        poruka: '',
      });
    } catch (err: any) {
      console.error('Greška pri slanju:', err);
      alert(
        err.response?.data?.poruka ||
          'Došlo je do greške. Pokušajte ponovo kasnije.'
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-3xl font-bold text-center mb-10">Kontaktirajte nas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Leva kolona */}
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-2">Opšti podaci</h2>
            <p><strong>Adresa:</strong> Šesta Industrijska 12, 22330 Nova Pazova, Srbija</p>
            <p><strong>Email:</strong> <a href="mailto:mail@dabel.rs" className="text-blue-600 underline">mail@dabel.rs</a></p>
            <p><strong>MB:</strong> 17141724 &nbsp;|&nbsp; <strong>PIB:</strong> 100267585</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Kontakt za pravna lica</h2>
            <p><strong>Telefon:</strong> <a href="tel:+38122802860" className="text-blue-600 underline">+381 22 802 860</a>, <a href="tel:+38122802861" className="text-blue-600 underline">+381 22 802 861</a></p>
            <p><strong>Radno vreme:</strong> Pon–Pet: 7:00–15:00</p>
            <p><strong>Subotom i nedeljom ne radimo.</strong></p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Poštanska adresa</h2>
            <p>Šesta Industrijska 12,<br />22330 Nova Pazova, Srbija</p>
            <p className="mt-2"><strong>Radno vreme:</strong><br />Radnim danima od 7 do 15h<br />Subotom i nedeljom ne radimo</p>
          </section>

        <section>
        <h2 className="text-xl font-semibold mb-2">Preuzmite identifikacione podatke</h2>
        <a
            href="https://www.dabel.rs/Dabel-d.o.o.-Identifikacioni-podaci.pdf"
            target = "_blank"
            download
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer inline-block"
        >
            Preuzmi PDF
        </a>
        </section>

        </div>

        {/* Desna kolona: forma */}
        <div className="bg-gray-100 p-6 rounded shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ime i prezime *</label>
              <input
                type="text"
                name="ime"
                value={formData.ime}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-blue-500"
              />
              {errors.ime && <p className="text-red-600 text-sm mt-1">{errors.ime}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Naziv kompanije (opciono)</label>
              <input
                type="text"
                name="kompanija"
                value={formData.kompanija}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-blue-500"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Naslov *</label>
              <input
                type="text"
                name="naslov"
                value={formData.naslov}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-blue-500"
              />
              {errors.naslov && <p className="text-red-600 text-sm mt-1">{errors.naslov}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Poruka *</label>
              <textarea
                name="poruka"
                rows={5}
                value={formData.poruka}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 resize-none focus:outline-blue-500"
              ></textarea>
              {errors.poruka && <p className="text-red-600 text-sm mt-1">{errors.poruka}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition cursor-pointer"
            >
              Pošalji poruku
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Kontakt;
