import { useRef, useState } from "react";
import PdfListCard from "./PdfListCard";

export default function PdfList() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // const [file, setFile] = useState<File>();
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File) => {
    try {
      if(!file) {
        alert('No file selected');
        return;
      }
      setUploading(true);
      const data = new FormData();
     
      data.set("file", file);
    

      const uploadRequest = await fetch('/api/pdf', {
        method: 'POST',
        body: data
      });

      const signedUrl = await uploadRequest.json();
      setUrl(signedUrl);
      setUploading(false);

    } catch(e) {
      setUploading(false);
      alert('Trouble uploading file');
      console.log(e);
    }
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    // Extra safety: ensure it's a PDF
    if (file && file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      event.target.value = ""; // reset input
      return;
    }
    
  
    uploadFile(event.target?.files?.[0] as File);

  };
  const handleUploadClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('click', fileInputRef);
    fileInputRef.current?.click();

    
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
        
        ref={fileInputRef}
        className="hidden"
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