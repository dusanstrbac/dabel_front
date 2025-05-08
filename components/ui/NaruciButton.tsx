import { Button } from "./button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
const NaruciButton = () => {

    return(
        <div className="">
        <Dialog>
            <DialogTrigger className="cursor-pointer"><Button variant={"outline"} className="px-10 py-4 cursor-pointer">Naruci</Button></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle></DialogTitle>
                        <DialogDescription>
                            Uspesno ste porucili artikle.                                                </DialogDescription>
                    </DialogHeader>
                </DialogContent>
        </Dialog>
        </div>
    )
}

export default NaruciButton;