import { useState } from "react";
import PdfViewerToolBar from "./PdfViewerToolBar";


export default function PdfViewer() {
  const [text, setText] = useState("");
  const readText = () => {

  }
  const handleFile = () => {
    
  }
  return (
    <div className="border border-white rounded flex flex-col h-full">

      <PdfViewerToolBar />
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