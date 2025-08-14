import { PdfUpload } from "../../app/types/PdfUpload";
import { selectFileCallback } from '../../app/types/functions';


interface FileCardProps {
  file: PdfUpload,
  setSelectedFile: selectFileCallback
}
function ConvertToMb(bytes: number): string {
  if(bytes < 0) {
    return '0MB';
  } else {
    const mb: number = bytes/ (1024 * 1024);
    return `${mb.toFixed(2)}MB`
  }
}
export default function PdfListCard({ file, setSelectedFile }: FileCardProps) {


  return (
    <div className="max-w-sm rounded border border-gray-200 shadow hover:shadow-lg transition-shadow p-4 mt-1" onClick={() => setSelectedFile(file)}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-semibold text-white-800 truncate relative group">
          <h3>
            {file.filename}
          </h3>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-max bg-black text-white text-xs rounded px-2 py-1">
            {file.filename}
          </div>
        </div>
        <span className="text-sm text-white-500">{file.createdAt.split('T')[0]}</span>
        
      </div>
      
      <div className="text-sm text-white-600 flex items-center justify-between"> 

        <label>Size: {ConvertToMb(file.sizeBytes)}</label>
        <button
          onClick={() => console.log("Delete", file.filename)}
          className="text-gray-400 hover:text-red-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
            />
          </svg>
        </button>
      </div>
      
    </div>
  ); 
}