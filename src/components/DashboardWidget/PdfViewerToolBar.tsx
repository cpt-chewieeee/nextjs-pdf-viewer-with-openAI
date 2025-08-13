interface ToolbarProps {
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
}


export default function PdfViewerToolBar({ onPlay, onPause, onStop }: ToolbarProps) {
  return (
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
  );
}