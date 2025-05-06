import Image from "next/image";

const HeroImage = () => {
  return (
    <div className="w-full mx-auto z-0">
      <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
        <Image
          src="/heroImage.jpg"
          alt="Main Photo"
          fill
          className="object-cover object-center"
          priority
        />
      </div>
    </div>
  );
};

export default HeroImage;
