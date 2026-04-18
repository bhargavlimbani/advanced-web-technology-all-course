import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function createPdf() {
  const pdfDoc = await PDFDocument.create();
  
  // Read screenshot
  const imageBytes = fs.readFileSync('screenshot.png');
  const image = await pdfDoc.embedPng(imageBytes);
  
  const imgDims = image.scale(0.5); // scale down to fit

  const page = pdfDoc.addPage([imgDims.width + 100, imgDims.height + 200]);
  
  page.drawText('Library Management System - Output Screenshot', { x: 50, y: page.getHeight() - 50, size: 24 });
  page.drawImage(image, {
    x: 50,
    y: page.getHeight() - imgDims.height - 100,
    width: imgDims.width,
    height: imgDims.height,
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('Output_Screenshot.pdf', pdfBytes);
  console.log('PDF created successfully!');
}

createPdf().catch(console.error);
