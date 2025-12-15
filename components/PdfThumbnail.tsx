'use client';

import React, { useEffect, useRef } from 'react';

interface PdfThumbnailProps {
  file: File;
  width?: number;
}

const PdfThumbnail: React.FC<PdfThumbnailProps> = ({ file, width = 200 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!file) return;

    let cancelled = false;

    const loadPdf = async () => {
      const pdfjsLib = await import('pdfjs-dist/build/pdf');

      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const reader = new FileReader();
      reader.onload = async () => {
        if (!reader.result || cancelled) return;

        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(reader.result as ArrayBuffer),
        });

        try {
          const pdf = await loadingTask.promise;
          const page = await pdf.getPage(1);

          const viewport = page.getViewport({ scale: 1 });
          const scale = width / viewport.width;
          const scaledViewport = page.getViewport({ scale });

          const canvas = canvasRef.current;
          if (!canvas) return;
          const context = canvas.getContext('2d');
          if (!context) return;

          canvas.width = scaledViewport.width;
          canvas.height = scaledViewport.height;

          await page.render({
            canvasContext: context,
            viewport: scaledViewport,
          }).promise;
        } catch (err) {
          console.error('Error loading PDF:', err);
        }
      };

      reader.readAsArrayBuffer(file);
    };

    loadPdf();

    return () => {
      cancelled = true;
    };
  }, [file, width]);

  return (
    <canvas
      ref={canvasRef}
      style={{ border: '1px solid #ccc', borderRadius: 4 }}
    />
  );
};

export default PdfThumbnail;
