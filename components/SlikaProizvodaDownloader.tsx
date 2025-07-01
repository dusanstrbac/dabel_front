"use client";

import { useEffect } from "react";

interface Props {
  proizvod: {
    idArtikla: string;
  };
}

export default function SlikaProizvodaDownloader({ proizvod }: Props) {
  useEffect(() => {
    if (!proizvod?.idArtikla) return;

    const saveImage = async () => {
      const url = `https://94.230.179.194:8443/SlikeProizvoda/${proizvod.idArtikla}.jpg`;

      try {
        const res = await fetch(`/api/save-image?url=${encodeURIComponent(url)}`);
        const data = await res.json();

        if (res.ok) {
          console.log("Saved image at:", data.filePath);
        } else {
          console.error("Error saving image:", data.error);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    saveImage();
  }, [proizvod?.idArtikla]);

  return null; // ne renderuje ništa
}
