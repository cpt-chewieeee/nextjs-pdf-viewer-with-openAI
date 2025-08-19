import { useEffect, useRef, useState } from "react";
import PdfListCard from "./PdfListCard";
import { PdfUpload, ChatSession } from "@prisma/client/edge";




interface PdfListProps {
  setSelectedFile: (file: PdfUpload | null) => void;
  setCurrentChatSession: (chat: ChatSession | null) => void;
}
export default function PdfList({ setSelectedFile, setCurrentChatSession }: PdfListProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [allFiles, setAllFiles] = useState<PdfUpload[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchAllUploads();
  },  []);
  const uploadFile = async (file: File) => {
    try {
      if(!file) {
        alert('No file selected');
        return;
      }
      setLoading(true);


      // create new assistant
      const assistantRequest = await fetch('/api/ai/assistants', {
        method: 'POST',
        body: JSON.stringify({
          name: file.name
        })
      });
      const {assistantId} = await assistantRequest.json();
    
      const data = new FormData();
     
      data.set("file", file);
      data.set("assistantId", assistantId);
    

      const uploadRequest = await fetch('/api/pdf', {
        method: 'POST',
        body: data
      });

      const result = await uploadRequest.json();
  
    } catch(e) {
      
      alert('Trouble uploading file');
      console.error(e);
    } finally {
      setLoading(false);
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
      setLoading(true);
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
      setLoading(false);
    }
  }

  return <div className="border border-white rounded flex flex-col h-full">
    <div className="mx-1 my-1">
      <button       
        disabled={loading}  
        onClick={handleUploadClick}
        className="w-full py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
        {
          loading ? <div className="flex justify-center items-center">
            <div className="animate-spin h-4 w-4 border-4 border-blue-500 border-solid rounded-full border-t-transparent">
            </div>
          </div> : <span>Upload Pdf</span>
        }

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
            <PdfListCard key={index} file={item} setSelectedFile={setSelectedFile} setCurrentChatSession={setCurrentChatSession}/>
          )
        })
      }
      {/* </div> */}
    </div>

  </div>
}