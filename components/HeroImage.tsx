import Image from "next/image"


const HeroImage = () => {

    return (
        <Image 
            src="/heroImage.jpg"
            height={400}
            width={1333}
            alt="MainPhoto"
        />
    )
}

export default HeroImage;