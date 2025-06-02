interface Props {
  params: {
    korisnik: string;
    id: string;
  };
}

const DokumentPage = ({ params }: Props) => {
    const { korisnik, id } = params;

    // const izvuciDokument = async (id: string) => {
    //     const res = await fetch("")
    // }


    return (
        <div className="p-8">
        <h1 className="text-2xl font-bold">Detalji dokumenta</h1>
        <p><strong>Korisnik:</strong> {korisnik}</p>
        <p><strong>ID dokumenta:</strong> {id}</p>
        </div>
    );        
};

export default DokumentPage;
