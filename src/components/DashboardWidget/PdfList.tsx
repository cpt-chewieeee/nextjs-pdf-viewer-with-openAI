import { useEffect, useRef, useState } from "react";
import PdfListCard from "./PdfListCard";
import { PdfUpload } from "../../app/types/PdfUpload";
import { selectFileCallback } from '../../app/types/functions';


interface PdfListProps {
  setSelectedFile: selectFileCallback
}
export default function PdfList({ setSelectedFile }: PdfListProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [allFiles, setAllFiles] = useState<PdfUpload[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  useEffect(() => {
    fetchAllUploads();
  },  []);
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
    
      setUploading(false);

    } catch(e) {
      setUploading(false);
      alert('Trouble uploading file');
      console.log(e);
    } finally {
      fetchAllUploads();
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

  }
  const handleUploadClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    fileInputRef.current?.click();
  }
  const fetchAllUploads = async () => {
    try {
      setLoadingList(true);
      const res = await fetch('/api/pdf');
      if(!res.ok) {
        alert('Something went wrong, unable to fetch uploads');
        return;
      }
      const data: PdfUpload[] = await res.json();
      setAllFiles(data);
    } catch(error) {
      console.error('Error fetching products:', error);

    } finally {
      setLoadingList(false);
    }
  }

  return <div className="border border-white rounded flex flex-col h-full">
    <div className="mx-1 my-1">
      <button       
        disabled={uploading}  
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
        allFiles.map((item: PdfUpload, index: number) => {
          return (
            <PdfListCard key={index} file={item} setSelectedFile={setSelectedFile}/>
          )
        })
      }
      {/* </div> */}
    </div>

  </div>
}