import FormTable from "@/components/FormTable";
import { Metadata } from "next";


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

const Istorija = () => {

    return (
        <FormTable title="Istorija poručivanja"/>
    );
}

export default Istorija;