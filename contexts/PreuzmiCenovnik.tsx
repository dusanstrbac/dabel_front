const preuzmiCenovnikCSV = async (partnerId: number) => {
  try {
    const res = await fetch(`/api/cenovnik/${partnerId}`);
    if (!res.ok) throw new Error("Greška prilikom preuzimanja cenovnika");

    const data = await res.json();

    const header = "Naziv,Cena\n";
    const rows = data
      .map((item: { naziv: string; cena: number }) => `${item.naziv},${item.cena}`)
      .join("\n");

    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `cenovnik_partner_${partnerId}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Greška:", error);
    alert("Nešto nije u redu prilikom preuzimanja cenovnika.");
  }
};
