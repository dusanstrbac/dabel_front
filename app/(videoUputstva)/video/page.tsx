'use client';

const VideoUputstva = () => {
  return (
    <div className="px-4 mb-5">
                {/*
    <div className="flex flex-row md:flex-row gap-10 mb-5 px-4">
      <div>
          <h1 className="text-3xl font-bold mb-4">Video uputstva</h1>
      </div>
          // className="flex flex-col md:flex-row gap-7 p-4 rounded-lg" 
      <div className="flex flex-col md:flex-row gap-10 items-center mb-5 border-2">
        <div className="w-full md:w-1/3">

          <div className="flex flex-col px-2 py-3 justify-start items-start border border-gray-300 rounded-lg">
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

        <div className="w-full md:w-2/3 sm:flex items-start">
          <video className="w-full h-auto" controls preload="none">
            <source src="/path/to/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>

    */}

    

      <h1 className="px-4 py-5 text-3xl font-bold">Video uputstva</h1>

      {/* Flex kontejner za meni i video plejer */}
      <div className="flex flex-col md:flex-row gap-7 px-4 rounded-lg">
        {/* Meni sa videima */}
        <div className="w-full md:w-1/3">
          <div className="flex flex-col px-2 py-3 gap-1 justify-start items-start border border-gray-300 rounded-lg">
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
                className="bg-transparent text-black cursor-pointer px-4 py-2 text-left hover:bg-gray-100 rounded-md w-full"
              >
                {video}
              </a>
            ))}
          </div>
        </div>

        {/* Video plejer */}
        <div className="w-full md:w-2/3">
          <video className="w-full h-auto rounded-md" controls preload="none">
            <source src="/path/to/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default VideoUputstva;
