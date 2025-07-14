import React, { useEffect, useRef } from "react";
import * as pdfjsLib from 'pdfjs-dist';

const PdfThumbnail = ({ fileUrl }: { fileUrl: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadPdf = async () => {
      const loadingTask = pdfjsLib.getDocument(fileUrl);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 1 });
      const canvas = canvasRef.current!;
      const context = canvas.getContext("2d")!;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext).promise;
    };

    loadPdf();
  }, [fileUrl]);

  return <canvas ref={canvasRef} style={{ width: "200px", height: "auto" }} />;
};

export default PdfThumbnail;
