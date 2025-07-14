import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PdfThumbnailProps {
  file: File;
  width?: number;
}

const PdfThumbnail: React.FC<PdfThumbnailProps> = ({ file, width = 200 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function () {
      if (!reader.result) return;

      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(reader.result as ArrayBuffer) });

      loadingTask.promise.then((pdf: { getPage: (arg0: number) => Promise<any>; }) => {
        pdf.getPage(1).then(page => {
          const viewport = page.getViewport({ scale: 1 });
          const scale = width / viewport.width;
          const scaledViewport = page.getViewport({ scale });

          const canvas = canvasRef.current;
          if (!canvas) return;
          const context = canvas.getContext('2d');
          if (!context) return;

          canvas.height = scaledViewport.height;
          canvas.width = scaledViewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: scaledViewport,
          };

          page.render(renderContext);
        });
      }).catch((err: any) => {
        console.error('Error loading PDF: ', err);
      });
    };

    reader.readAsArrayBuffer(file);
  }, [file, width]);

  return <canvas ref={canvasRef} style={{ border: '1px solid #ccc', borderRadius: 4 }} />;
};

export default PdfThumbnail;
