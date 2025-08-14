import { selectFileCallback } from "@/app/types/functions";
import { PdfUpload } from "@/app/types/PdfUpload";

interface ToolbarProps {
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;


  selectedFile: PdfUpload | null;
  setSelectedFile: selectFileCallback

}


export default function PdfViewerToolBar({ onPlay, onPause, onStop, selectedFile, setSelectedFile }: ToolbarProps) {
  return (
    <div className="flex justify-between border-b-1">
      <div className="flex space-x-4 bg-gray-900 p-2 rounded shadow justify-center">
        {/* Play Button */}
        <button
          onClick={onPlay}
          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M4 2v20l18-10L4 2z" />
          </svg>
        </button>

        {/* Pause Button */}
        <button
          onClick={onPause}
          className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M6 2h4v20H6V2zm8 0h4v20h-4V2z" />
          </svg>
        </button>

        {/* Stop Button */}
        <button
          onClick={onStop}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M6 6h12v12H6V6z" />
          </svg>
        </button>
      </div>
      <div className="border-l-1 rounded">
        <button
          onClick={() => setSelectedFile(null)}
          className="p-2 rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>

        </button>
      </div>
    </div>
  );
}