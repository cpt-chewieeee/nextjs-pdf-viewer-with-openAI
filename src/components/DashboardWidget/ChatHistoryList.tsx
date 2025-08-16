

import { PdfUpload, ChatSession } from "@prisma/client/edge";
import { useEffect, useState } from "react";

interface ChatHistoryListProps {
  currentChatSession: ChatSession | null;
  selectedFile: PdfUpload | null;
  setCurrentChatSession: (chat: ChatSession | null) => void;
}

export default function ChatHistoryList({ selectedFile, setCurrentChatSession, currentChatSession }: ChatHistoryListProps) {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  useEffect(() => {

    const fetchData = async () => {

      await fetchChatSessions();
    };
    fetchData();
  }, [selectedFile, currentChatSession]);

  const fetchChatSessions: () => Promise<void> = async (): Promise<void> => {
    if(selectedFile === null) {
      return;
    }

    const req = await fetch(`/api/chatSession/${selectedFile.id}`);
    if(!req.ok) {

      alert('Unable to create a new chat session');
      return;
    }
    const data = await req.json();

    setChatSessions(data);
  }
  return (
    <div className="border border-white h-full flex-1 overflow-auto p-1 space-y-2 rounded border">
      <div className="flex justify-between border-b-1 pb-1">
        <button
          onClick={() => setCurrentChatSession(null)} 
          className="p-2 text-white flex bg-green-600 text-white rounded shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400">
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
        chatSessions.map((item: ChatSession, index: number) => {
          return (
            <div key={index} className='flex w-full' onClick={() => setCurrentChatSession(item)}>
              <div className={`w-full px-4 py-2 rounded break-words bg-green-400 text-gray-800`}>
                <p>{item.title}</p>
                <span className="text-xs text-gray-400 block text-right mt-1">10/10/2025</span>
              </div>
            </div>
          );
        })
      }
    </div>
  )
}