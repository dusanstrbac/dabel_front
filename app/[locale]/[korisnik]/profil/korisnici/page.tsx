import KorisniciTable from "@/components/KorisniciTable";
import { useTranslations } from "next-intl";

const korisnici=()=>{
    return(
        <div>
            <KorisniciTable title="Korisnici"/>
        </div>
    )
}

export default korisnici;