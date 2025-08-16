import { ChatMessage } from "@prisma/client/edge";
import { useEffect, useRef, useState } from "react"

export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState("");

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend()
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    console.log('sending', input);

    const newMsg: ChatMessage = {
      id: 0,
      sessionId: 0,
      content: input.trim(),
      createdAt: new Date(),
      metadata: null,
      isReply: false
    }
    setChatMessages(chatMessages.concat([newMsg]))
    setInput('');
  };

  
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
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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