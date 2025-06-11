import Image from "next/image";

const HeroImage = () => {
  return (
    <div className="relative w-full mx-auto z-[-1]">
      <div className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden relative">
        <Image
          src="/heroImage.jpg"
          alt="Main Photo"
          fill
          className="object-cover object-center static"
          priority
        />
      </div>
    </div>
  );
};

export default HeroImage;
