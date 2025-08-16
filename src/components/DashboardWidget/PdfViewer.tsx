import { useState } from "react";
import PdfViewerToolBar from "./PdfViewerToolBar";
import { PdfUploadType } from "@/app/types/PdfUploadType";
import { selectFileCallback } from "@/app/types/functions";
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
interface PdfViewerProps {
  selectedFile: PdfUploadType | null;
  setSelectedFile: selectFileCallback
}
export default function PdfViewer({ selectedFile, setSelectedFile }: PdfViewerProps) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  if(selectedFile === null) {
    return (
      <div className="flex items-center justify-center h-full border border-white rounded">
        <p className="text-center">Upload or select a Pdf on the left.</p>
      </div>
    );
   
  }
  return (
    <div className="border border-white rounded flex flex-col h-full">

      <PdfViewerToolBar selectedFile={selectedFile} setSelectedFile={setSelectedFile}/>
      
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
        
        <div className="overflow-auto">
          <Viewer fileUrl={selectedFile.fullUrl} plugins={[defaultLayoutPluginInstance]} />
        </div>
      </Worker> 
      
    </div>
  )
}