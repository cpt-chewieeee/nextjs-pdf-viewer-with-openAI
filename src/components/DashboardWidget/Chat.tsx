import { ChatMessage, ChatSession, PdfUpload } from "@prisma/client/edge";
import { useEffect, useRef, useState } from "react";
import Stt from "./Stt";


interface ChatProps {
  selectedFile: PdfUpload | null;
  currentChatSession: ChatSession | null;
  setCurrentChatSession: (chat: ChatSession | null) => void;
}
export default function Chat({ currentChatSession, setCurrentChatSession, selectedFile }: ChatProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState("");

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  

  useEffect(() => {
    // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setChatMessages([]);
    if(currentChatSession !== null) {
      
      getSessionMessages();
    }
  }, [currentChatSession]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend()
    }
  };
  const getSessionMessages = async () => {
    if (!currentChatSession) {
      return;
    }
    
      const resp = await fetch(`/api/chatMessage/${currentChatSession.id}`);
      

      if(!resp.ok) {
        alert('Unable to create new chat');
  
        return;
      }
      const data = await resp.json();
 
      setChatMessages(data);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  };
  const createNewSession = async () => {
    if(selectedFile === null) {
      return null;
    }

    const data = new FormData();
    data.set('title', input.trim());
    data.set('pdfUploadId', String(selectedFile.id));
    
    const uploadRequest = await fetch('/api/chatSession', {
      method: 'POST',
      body: data,
    });
    return await uploadRequest.json();
  };
  const sendNewMessage = async (session: ChatSession) => {
    try {
      const data = new FormData();
      data.set('sessionId', String(session.id));
      data.set('content', input.trim());
      const resp = await fetch('/api/chatMessage', {
        method: 'POST',
        body: data
      });

      const newMsg: ChatMessage = await resp.json();

      setChatMessages(chatMessages.concat([newMsg]))
      setInput('');
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch(err) {
      alert('unable to create new message')
      console.error(err);
    }
  };
  const handleSend = async () => {
    if (!input.trim()) return;
    
    if(currentChatSession === null) {
      const newSession = await createNewSession();
   
      setCurrentChatSession(newSession);
      sendNewMessage(newSession);
    } 
    else {
      sendNewMessage(currentChatSession);
    }
    
    
  };

  const handleRecord = () => {
    
  }

  
  return (
    <div className="border border-white flex flex-col h-full mx-auto border rounded shadow"> 
      <div className="flex-1 overflow-auto p-1 space-y-2">
        {
          chatMessages.map((item: ChatMessage, index: number) => {
            return (
              <div key={index} className={`flex ${
              item.isReply ?  'justify-start' : 'justify-end'
            }`}>
              <div className={`max-w-xs px-4 py-2 rounded break-words ${
                item.isReply ? 'bg-blue-600 text-white' : 'bg-green-200 text-gray-800'
              }`}>
                <p>{item.content}</p>
                {/* <span className="text-xs text-gray-400 block text-right mt-1">10/10/2025</span> */}
              </div>
            </div>
            )
          })
        }
        <div ref={messagesEndRef} />
      </div>

       <div className="flex border-t p-1">
        {/* <div className="relative w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 w-full border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button className="absolute top-2 right-4" onClick={handleRecord}>
            {
              1 ? (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>) : (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="1" y1="1" x2="23" y2="23"></line>
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12"></path>
                <path d="M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>)
            }
          </button>
        </div> */}
        <Stt input={input} setInput={setInput} handleKeyDown={handleKeyDown}/>
        <button
          onClick={handleSend}
          className="px-1 py-1 bg-blue-600 text-white rounded-r hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  )
}