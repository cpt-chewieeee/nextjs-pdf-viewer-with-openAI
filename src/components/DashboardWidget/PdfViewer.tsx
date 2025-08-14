import { useState } from "react";
import PdfViewerToolBar from "./PdfViewerToolBar";
import { PdfUpload } from "@/app/types/PdfUpload";
import { selectFileCallback } from "@/app/types/functions";

interface PdfViewerProps {
  selectedFile: PdfUpload | null;
  setSelectedFile: selectFileCallback
}
export default function PdfViewer({ selectedFile, setSelectedFile }: PdfViewerProps) {
  const [text, setText] = useState("");
  const readText = () => {

  }
  const handleFile = () => {

  }

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
      <div>
         <div className="p-4">
          <input type="file" accept="application/pdf" onChange={handleFile} />
          <button onClick={readText} disabled={!text} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
            Read PDF
          </button>
          <textarea value={text} readOnly className="w-full h-64 mt-4 border p-2" />
        </div>
      </div>
    </div>
  )
}