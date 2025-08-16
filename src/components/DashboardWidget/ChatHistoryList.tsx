import { ChatType } from "@/app/types/ChatType";

interface ChatHistoryListProps {
  chatHistory: ChatType[];
}
export default function ChatHistoryList({ chatHistory }: ChatHistoryListProps) {
  return (
    <div className="border border-white h-full flex-1 overflow-auto p-1 space-y-2 rounded border">
      <div className="flex justify-between border-b-1 pb-1">
        <button className="p-2 text-white flex bg-green-600 text-white rounded shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400">
          <svg xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          <span>New Chat</span>
        </button>
      </div>
      {
        chatHistory.map((item: ChatType, index: number) => {
          return (
            <div key={index} className={`flex ${
              index % 3 === 0 ?  'justify-start' : 'justify-end'
            }`}>
              <div className={`max-w-xs px-4 py-2 rounded break-words ${
                index % 3 === 0 ? 'bg-blue-600 text-white' : 'bg-green-200 text-gray-800'
              }`}>
                <p>hello world</p>
                <span className="text-xs text-gray-400 block text-right mt-1">10/10/2025</span>
              </div>
            </div>
          );
        })
      }
    </div>
  )
}