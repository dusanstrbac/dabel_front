'use client';

const VideoUputstva = () => {
  return (
    <div className="flex flex-col md:flex-row gap-10 items-center px-4">
      <div className="w-full md:w-1/3">
        <div>
          <h1 className="text-3xl font-bold mb-4">Video uputstva</h1>
        </div>

        <div className="flex flex-col gap-2 mb-5 mt-5 justify-start items-start border border-gray-300 rounded-lg p-4">
          {[
            "Cenovnik.mp4",
            "Finansijski izvestaji.mp4",
            "Definisanje korisnika za kreiranje rezervacija.mp4",
            "Korisnici.mp4",
            "Moja dokumenta.mp4",
            "Narucivanje robe.mp4",
            "Ponude i predracuni.mp4",
            "Promena lozinke.mp4",
            "Rezervacija robe.mp4",
            "Snimljene narudzbenice.mp4",
            "Unos artikala u korpu preko Excel tabele.mp4"
          ].map((video, index) => (
            <a
              key={index}
              href="#"
              className="bg-transparent text-black cursor-pointer px-4 py-3 text-left hover:bg-gray-100 rounded-md"
            >
              {video}
            </a>
          ))}
        </div>
      </div>

      <div className="w-full md:w-2/3">
        <video className="w-full h-auto" controls preload="none">
          <source src="/path/to/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoUputstva;
