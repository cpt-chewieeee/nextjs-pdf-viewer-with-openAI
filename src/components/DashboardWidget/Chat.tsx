import { useEffect, useRef, useState } from "react"

export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState("");

  const messages: number[] = [0,1,2,3,4,5,6,7,8,9,10];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

   
  };

  
  return (
    <div className="border border-white flex flex-col h-full mx-auto border rounded shadow"> 
      <div className="flex-1 overflow-auto p-1 space-y-2">
        {
          messages.map((item: number) => {
            return (
              <div key={item} className={`flex ${
              item % 3 === 0 ?  'justify-start' : 'justify-end'
            }`}>
              <div className={`max-w-xs px-4 py-2 rounded break-words ${
                item % 3 === 0 ? 'bg-blue-600 text-white' : 'bg-green-200 text-gray-800'
              }`}>
                <p>hello world</p>
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