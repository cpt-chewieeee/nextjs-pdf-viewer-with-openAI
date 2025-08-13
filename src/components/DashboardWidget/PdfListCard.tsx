

interface FileCardProps {
  fileName: string;
  uploadDate: string;
  fileSize: string;
}

export default function PdfListCard({ fileName, uploadDate, fileSize }: FileCardProps) {


  return (
    <div className="max-w-sm rounded border border-gray-200 shadow hover:shadow-lg transition-shadow p-4 mt-1">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-white-800 truncate">{fileName}</h3>
        <span className="text-sm text-white-500">{uploadDate}</span>
        
      </div>
      
      <div className="text-sm text-white-600 flex items-center justify-between"> 

        <label>Size: {fileSize}</label>
        <button
          onClick={() => console.log("Delete", fileName)}
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