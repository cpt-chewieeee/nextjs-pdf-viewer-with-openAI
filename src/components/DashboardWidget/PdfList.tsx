import { useRef } from "react";
import PdfListCard from "./PdfListCard";

export default function PdfList() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    // Extra safety: ensure it's a PDF
    if (file && file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      event.target.value = ""; // reset input
      return;
    }


  };
  const handleUploadClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('click', fileInputRef);
    fileInputRef.current?.click()
  }
  return <div className="border border-white rounded flex flex-col h-full">
    <div className="mx-1 my-1">
      <button         
        onClick={handleUploadClick}
        className="px-4 w-full py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
        Upload Pdf
      </button>
      <input type='file'         
        onChange={handleFileChange}
        className="hidden" 
        ref={fileInputRef}

        accept="application/pdf" />
        
    </div>
    <div className="flex-1 overflow-auto border rounded p-1">
      {/* <div> */}
        {
        [0,1,2,3,4,5,6,7,8,9,10].map((item: number) => {
          return (
            <PdfListCard key={item} fileName={"test"} uploadDate={"abc"} fileSize={"3mb"} />
          )
        })
      }
      {/* </div> */}
    </div>

  </div>
}