'use client';

const katalozi = [
  {
    naziv: 'Katalog 1',
    link: 'https://dabel.rs/login/files/c1efac68440c57317c2ba10db071631c4c144af1.pdf',
    thumbnail: 'https://www.dabel.rs/wp-content/uploads/2023/05/Katalog1-thumbnail.jpg', // URL slike prvog pdf-a
  },
  {
    naziv: 'Katalog 2',
    link: 'https://www.dabel.rs/wp-content/uploads/2023/05/Katalog2.pdf',
    thumbnail: 'https://www.dabel.rs/wp-content/uploads/2023/05/Katalog2-thumbnail.jpg',
  },
  {
    naziv: 'Katalog 3',
    link: 'https://www.dabel.rs/wp-content/uploads/2023/05/Katalog2.pdf',
    thumbnail: 'https://www.dabel.rs/wp-content/uploads/2023/05/Katalog2-thumbnail.jpg',
  },
  {
    naziv: 'Katalog 4',
    link: 'https://www.dabel.rs/wp-content/uploads/2023/05/Katalog2.pdf',
    thumbnail: 'https://www.dabel.rs/wp-content/uploads/2023/05/Katalog2-thumbnail.jpg',
  }, 
];

const KataloziPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Naši katalozi</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {katalozi.map(({ naziv, link, thumbnail }, i) => (
          <a
            key={i}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="block border rounded shadow hover:shadow-lg transition"
          >
            <img
              src={thumbnail}
              alt={`Thumbnail za ${naziv}`}
              className="w-full h-64 object-cover rounded-t"
              loading="lazy"
            />
            <div className="p-4 text-center font-semibold text-lg">{naziv}</div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default KataloziPage;
